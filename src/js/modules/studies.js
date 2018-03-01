const Backbone = require('backbone');
const _ = require('underscore');
const util = require('../util');
const commons = require('../commons');
const api = require('../components/api');
const Pagination = require('../components/pagination').Pagination;
const Order = require('../components/order');

const pagination = new Pagination();

const DEFAULT_PAGE_SIZE = require('../commons').DEFAULT_PAGE_SIZE;

const BIOME_FILTER_DEPTH = 3;

import {
    getFormData,
    getURLFilterParams,
    hideTableLoadingGif,
    initResultsFilter,
    setCurrentTab,
    setURLParams,
    showTableLoadingGif,
    BiomeCollectionView,
    getDownloadParams,
    setDownloadResultURL,
    checkAPIonline
} from "../util";

checkAPIonline();
setCurrentTab('#studies-nav');
$("#pagination").append(commons.pagination);
$("#pageSize").append(commons.pagesize);

const pageFilters = getURLFilterParams();

const orderOptions = [
    // {name: 'Study accession', value: 'accession'},
    {name: 'Study name', value: 'study_name'},
    // {name: 'Number of runs', value: 'runs-count'}, // NOT DISPLAYED IN TABLE
    {name: 'Number of samples', value: 'samples_count'},
    {name: 'Last updated', value: 'last_update'},
];


var StudyView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($("#study-row").html()),
    attributes: {
        class: 'study',
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this.$el
    }
});


var StudiesView = Backbone.View.extend({
    el: '#studies-table-body',
    params: {},

    initialize: function () {
        var that = this;

        let params = {};
        params.page = pagination.currentPage;
        params.page_size = pagination.getPageSize();

        const biome = pageFilters.get('lineage');
        if (biome) {
            params.lineage = biome;
        } else {
            params.lineage = 'root';
        }

        const ordering = pageFilters.get('ordering');
        if (ordering) {
            params.ordering = ordering;
        } else {
            params.ordering = '-last_update';
        }

        const search = pageFilters.get('search');
        if (search) {
            params.search = search;
            $("#search").val(search);
        }

        const pagesize = pageFilters.get('pagesize') || DEFAULT_PAGE_SIZE;
        if (pagesize) {
            params.page_size = pagesize;
        }
        params.page = parseInt(pageFilters.get('page')) || 1;
        this.params = params;
        this.fetchXhr = this.collection.fetch({
            data: $.param(params),
            remove: true,
            success: function (collection, response, options) {
                const newParams = getDownloadParams(params);
                setDownloadResultURL(that.collection.url+'?'+$.param(newParams));
                that.render();
                const pag = response.meta.pagination;
                pagination.init(params.page, pagesize, pag.pages, pag.count, changePage);
                Order.initHeaders(params.ordering, function (sort) {
                    var formData = getFormData("#filter");
                    const params = {
                        page: 1,
                        page_size: pagination.getPageSize(),
                        ordering: sort
                    };
                    that.update(params);
                });

            }
        });
        return this;
    },

    update: function (params) {
        const that = this;

        this.params = $.extend(this.params, params);
        $(".study").remove();
        showTableLoadingGif();
        setURLParams(this.params, false);
        if(this.fetchXhr.readyState > 0 && this.fetchXhr.readyState < 4){
            this.fetchXhr.abort();
        }
        this.fetchXhr = this.collection.fetch({
            data: $.param(that.params),
            remove: true,
            success: function (collection, response, options) {
                hideTableLoadingGif();
                pagination.update(response.meta.pagination, changePage);
                that.render();
            }
        });
        const newParams = getDownloadParams(that.params);
        setDownloadResultURL(that.collection.url+'?'+$.param(newParams));

        return this;
    },
    render: function () {
        $(".study").remove();
        this.collection.each(function (study) {
            var studyView = new StudyView({model: study});
            $(this.$el).append(studyView.render());
        }, this);
        return this;
    }
});


function updatePageSize(pageSize) {
    const params = {
        page_size: pageSize,
        page: 1,
    };
    studiesView.update(params);
}

function changePage(page) {
    const params = {
        page_size: pagination.getPageSize(),
        page: page,
    };
    studiesView.update(params);
}

pagination.setPageSizeChangeCallback(updatePageSize);


var biomes = new api.BiomeCollection();
var biomesSelectView = new BiomeCollectionView({collection: biomes, maxDepth: BIOME_FILTER_DEPTH}, pageFilters.get('lineage'));
var studies = new api.StudiesCollection();
var studiesView = new StudiesView({collection: studies});


initResultsFilter(pageFilters.get('search'), function (e) {
    var params = {
        page_size: pagination.getPageSize(),
        page: pagination.currentPage,
        search: $("#search-input").val(),
        lineage: $("#biome-select").val(),
        ordering: Order.currentOrder,
    };
    studiesView.update(params);
});

//TODO remove this
// studiesView.update(1,10);
window.biomes = biomes;
window.studiesView = studiesView;
