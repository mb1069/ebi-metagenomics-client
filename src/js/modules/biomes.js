const Backbone = require('backbone');
const _ = require('underscore');
const api = require('../components/api');
const Pagination = require('../components/pagination').Pagination;
const commons = require('../commons');
const Order = require('../components/order');

const pagination = new Pagination();

const DEFAULT_PAGE_SIZE = commons.DEFAULT_PAGE_SIZE;
import {
    formatLineage,
    getURLFilterParams,
    hideTableLoadingGif,
    setCurrentTab,
    setURLParams,
    showTableLoadingGif,
    checkAPIonline
} from "../util";


checkAPIonline();


setCurrentTab('');

$("#pagination").append(commons.pagination);
$("#pageSize").append(commons.pagesize);

const pageFilters = getURLFilterParams();


var BiomeView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($("#biome-row").html()),
    attributes: {
        class: 'biome',
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this.$el
    }
});

var BiomesView = Backbone.View.extend({
    el: '#biomes-table-body',
    initialize: function () {
        var that = this;
        let params = {};
        params.page = pagination.currentPage;
        params.page_size = pagination.getPageSize();

        const ordering = pageFilters.get('ordering');
        if (ordering) {
            params.ordering = ordering;
        } else {
            params.ordering = '-samples_count';
        }

        const search = pageFilters.get('search');
        if (search !== null) {
            params.search = search;
            $("#search").val(search);
        }

        const pagesize = pageFilters.get('pagesize') || DEFAULT_PAGE_SIZE;
        if (pagesize) {
            params.page_size = pagesize;
        }
        params.page = pageFilters.get('page') || 1;
        this.params = params;

        this.fetchXhr = this.collection.fetch({
            data: $.param(params),
            remove: true,
            success: function (collection, response, options) {
                that.render();
                const pag = response.meta.pagination;
                pagination.init(params.page, pagesize, pag.pages, pag.count, changePage);
                Order.initHeaders(params.ordering, function (sort) {
                    const params = {
                        page: 1,
                        page_size: pagination.getPageSize(),
                        ordering: sort
                    };
                    that.update(params);
                })
            }
        });
        return this;
    },
    update: function (params) {
        var that = this;
        this.params = $.extend(this.params, params);
        $('.biome').remove();
        showTableLoadingGif();
        setURLParams(this.params, false);

        if(this.fetchXhr.readyState > 0 && this.fetchXhr.readyState < 4){
            this.fetchXhr.abort();
        }
        this.fetchXhr = this.collection.fetch({
            data: $.param(params), remove: true, success: function (collection, response, options) {
                hideTableLoadingGif();
                pagination.update(response.meta.pagination, that.update.bind(that));
                that.render();
            }
        });
        return this;
    },
    render: function () {
        $('.biome').remove();
        this.collection.each(function (biome) {
            biome.attributes.lineage = formatLineage(biome.attributes.lineage);
            var biomeView = new BiomeView({model: biome});
            $(this.$el).append(biomeView.render());
        }, this);

        return this;
    }
});




function updatePageSize(pageSize) {
    const params = {
        page_size: pageSize,
        page: 1,
    };
    biomesView.update(params);
}

function changePage(page) {
    const params = {
        page_size: pagination.getPageSize(),
        page: page,
    };
    biomesView.update(params);
}

pagination.setPageSizeChangeCallback(updatePageSize);




var biomes = new api.BiomeCollection();
var biomesView = new BiomesView({collection: biomes});
