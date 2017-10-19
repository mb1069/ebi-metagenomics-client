import {SEARCH_URL} from '../config';
import {attachTabHandlers, setCurrentTab} from "../util";

const util = require('../util');
const _ = require('underscore');
const Backbone = require('backbone');
const Cookies = require('js-cookie');
const commons = require('../commons');
const Pagination = require('../components/pagination').Pagination;
require('webpack-jquery-ui/slider');
require('webpack-jquery-ui/css');
import 'foundation-sites';
import '../../../static/libraries/jquery.TableCSVExport';

setCurrentTab('#search-nav', true);
attachTabHandlers();

$("#pageSize").append(commons.pagesize).find('#pagesize').change(function () {
    updateAll($(this).val())
});

let queryText = util.getURLFilterParams().get('query');
$("#navbar-query").val(queryText);

$(document).ready(function () {
    //TODO convert to template argument
    $("#pagesize-text").hide();
});

const COOKIE_NAME = 'metagenomic_filter_params';
const SLIDER_PARAM_RE = /(\w+):\[\s*([-]?\d+) TO ([-]?\d+)]/;

const Search = Backbone.Collection.extend({
    tab: null,
    params: {
        format: 'json',
        size: 10,
        start: 0,
        fields: 'id,name,biome,description',
        facetcount: 10,
        facetsdepth: 5,
    },
    initialize: function () {
        if (queryText) {
            this.params.query = queryText;
        }
    },
    url: function () {
        return SEARCH_URL + this.tab;
    },
    parse: function (response) {
        if (this.pagination) {
            // TODO pagination
            // Pagination.updatePagination(response.meta.pagination);
        }
        return response.data;
    }
});

const ResultsView = Backbone.View.extend({
    render: function (response, params, no_display) {
        let templateData = $.extend({}, response);
        const defaultQueries = [ProjectsView.prototype.defaultQuery, SamplesView.prototype.defaultQuery, RunsView.prototype.defaultQuery];

        if (defaultQueries.indexOf(params.query) === -1) {
            const splitParams = params.query.split(' AND ');
            templateData.queryText = _.reject(splitParams, isFacetParam)[0];

            const sliderParams = _.filter(splitParams, isFacetParam);
            templateData.sliderText = sliderParams.join(', ');
        } else {
            templateData.queryText = null;
            templateData.sliderText = null;
        }

        if (params.facets && params.facets.length > 0) {
            templateData.filterText = params.facets.replace(/,/g, ', ');
        } else {
            templateData.filterText = null;
        }
        if (!no_display) {
            this.$el.html(this.template(templateData));
        }
        return this.template(templateData);
    },
    fetchCSV: function ($buttonElem) {
        $buttonElem.prop('disabled', true);
        $buttonElem.addClass('loading-cursor');
        let tmpParams = $.extend(true, {}, this.params);
        tmpParams.facetcount = 0;
        tmpParams.facetsdepth = 1;
        const maxSize = 100;
        const totalResults = this.totalResults;
        const that = this;
        let fetches = [];
        for (let start = 0; start < totalResults; start += maxSize) {
            const number = Math.min(maxSize, totalResults - start);
            let p = $.extend(true, {}, tmpParams);
            p.start = start;
            p.size = number;
            fetches.push(this.collection.fetch({
                data: $.param(p),
                success: function (collection, response) {
                    return collection;
                }
            }));
        }

        $.when.apply($, fetches).done(function () {
            let collection = null;
            for (var i = 0; i < arguments.length; i++) {
                if (!collection) {
                    collection = arguments[i][0];
                } else {
                    collection.entries = collection.entries.concat(arguments[i][0].entries);
                }
            }
            const resultsTmpl = that.render(collection, tmpParams, true);
            $(resultsTmpl).filter('table').TableCSVExport({
                showHiddenRows: true,
                delivery: 'download'
            });
        }).fail(function () {
            alert('Could not download, an error has occured');
        //    TODO improve error handling
        }).always(function () {
            $buttonElem.removeClass('loading-cursor');
            $buttonElem.prop('disabled', false);
        });
    }
});

const FiltersView = Backbone.View.extend({
    template: _.template($("#filtersTmpl").html()),
    render: function (elem, data, formId, query) {
        data.formId = formId;
        data.elem = elem;
        $(elem).html(this.template(data));
        attachCheckboxHandlers('#' + data.formId);
        _.each(data.facets, function (facet) {
            if (facet.type === 'slider') {
                const initValues = getFacetValues(facet.label, query);

                const initData = (initValues && initValues.length === 2) ? initValues : [facet.min, facet.max];
                const sliderId = '#' + data.formId + facet.label + 'slider';
                $(sliderId).slider({
                    range: true,
                    min: facet.min,
                    max: facet.max,
                    values: initData,
                    minInput: $(this).siblings('[data-min]'),
                    maxInput: $(this).siblings('[data-max]'),
                    slide: function (event, ui) {
                        const inputSelector = ui.handleIndex ? '[data-max]' : '[data-min]';
                        $(this).siblings(inputSelector).val(ui.value);
                        const sliderSelector = $(this).attr('data-facet-slider');
                        // Apply to other facet's sliders and inputs
                        _.each(getAllFormIds(), function (formId) {
                            if (formId !== '#' + data.formId) {
                                const $slider = $(formId).find('[data-facet-slider=' + sliderSelector + ']').slider('values', ui.handleIndex, ui.value);
                                $slider.siblings(inputSelector).val(ui.value).trigger('change');
                            }
                        });
                        updateAll();
                    },
                    create: function (event, ui) {
                        $(this).siblings('[data-min]').val(initData[0]);
                        $(this).siblings('[data-max]').val(initData[1]);
                        $(this).siblings('.slider-input').on('change', function (e) {
                            const index = $(this).is('[data-min]') ? 0 : 1;
                            const val = parseInt($(this).val());
                            $(sliderId).slider('values', index, val);

                            // Apply to other facet's sliders and inputs
                            const sliderSelector = $(sliderId).attr('data-facet-slider');
                            const inputSelector = index ? '[data-max]' : '[data-min]';
                            _.each(getAllFormIds(), function (formId) {
                                if (formId !== '#' + data.formId) {
                                    const $slider = $(formId).find('[data-facet-slider=' + sliderSelector + ']');
                                    $slider.slider('values', index, val);
                                    $slider.siblings(inputSelector).val(val);
                                }
                            });
                            if (e.hasOwnProperty('originalEvent')) {
                                updateAll();
                            }
                        });
                    }
                })
            }
        });
        $('#' + formId).find('.switch-input').click(sliderToggleCallback);
        return $(elem);
    }
});

function getFacetValues(label, query) {
    let params = query.split(' AND ');
    for (let i = 0; i < params.length; i++) {
        const d = SLIDER_PARAM_RE.exec(params[i]);
        if (d && d[1] === label) {
            return _.map(d.slice(2, 3), parseInt);
        }
    }
}

const Project = Backbone.Model.extend({
    parse: function (d) {
        // d.biomes = [];
        // _.each(d.fields.biome, function(biome){
        //     biome = 'root:'+biome.replace(/\/([^\/]*)$/, '').replace(/\//g, ':');
        //     d.biomes.push({
        //         name: util.formatLineage(biome),
        //         icon: util.getBiomeIcon(biome)
        //     });
        // });
        d.biomes = convertBiomes(d);
        d.study_link = '/study/' + d.id;
        return d;
    }
});

const Projects = Search.extend({
    tab: 'projects',
    parse: function (response) {
        let data = response.entries.map(Project.prototype.parse);
        return data;
    }
});

const ProjectsView = ResultsView.extend({
    el: '#projects',
    formEl: 'projectsForm',
    params: {},
    pagination: new Pagination(),
    template: _.template($("#projectResultsTmpl").html()),
    defaultQuery: 'domain_source:metagenomics_projects',

    initialize: function () {
        this.pagination.setPaginationElem('#projects-pagination');
        const cookieParams = loadSearchParams('projects', queryText);
        if (cookieParams) {
            this.params = cookieParams;
        } else {
            this.params = $.extend(true, {}, Search.prototype.params);
            this.params.fields += ",METAGENOMICS_PROJECTS";
        }
        this.params.query = queryText || this.defaultQuery;
    },

    update: function (page, pagesize) {
        var formData = removeRedundantBiomes($('#' + this.formEl).serializeArray());
        this.params.facets = joinFilters(formData);
        if (!this.params.query.length) {
            this.params.query = this.defaultQuery;
        }
        if (pagesize) {
            this.params.size = pagesize;
        }
        if (page) {
            this.params.start = parseInt(this.params.size) * (page - 1);
        }
        return this.fetchAndRender(false, false);
    },

    fetchAndRender: function (renderFilter, setFilters) {
        const that = this;
        return this.collection.fetch({
            data: $.param(that.params),
            success: function (collection, response) {
                that.totalResults = response.hitCount;

                saveSearchParams('projects', that.params);
                if (renderFilter) {
                    filters.render('#projectsFilters', response, that.formEl, that.params.query);
                    const $form = $('#' + that.formEl);

                    $form.find("input[type=checkbox]:not('.switch-input')").on('click', function () {
                        setChildrenCheckboxes(this);
                        setParentCheckboxStatus(this);
                        addClearButton($(this), $('.filter-clear'));
                        propagateToFacets($(this).attr('type'), $(this).attr('name'), $(this).val(), $(this).is(':checked'), ['#samplesFilters', '#runsFilters']);
                        updateAll();
                    });

                    // $form.find('button.reset').click(function () {
                    //     resetAllForms();
                    // });

                    that.pagination.initPagination(1, that.params.size, Math.ceil(response.hitCount / that.params.size), response.hitCount, function (page) {
                        that.update(page);
                    });
                    that.pagination.setPageSizeChangeCallback(updateAll);

                }
                if (setFilters) {
                    setFacetFilters('#' + that.formEl, that.params);
                }
                that.render(response, that.params);
                $(that.el).find("button[name='download']").click(function () {
                    that.fetchCSV($(this));
                });
            }
        }).promise();
    },
});

const Sample = Backbone.Model.extend({
    parse: function (d) {
        d.study_link = '/study/' + d.fields.METAGENOMICS_PROJECTS[0];
        d.sample_link = '/sample/' + d.id;
        return d;
    }
});

const Samples = Search.extend({
    tab: 'samples',
    parse: function (response) {
        response.facets.unshift(addSliderFilter('Depth', 'Metres', 0, 2000));
        response.facets.unshift(addSliderFilter('Temperature', '°C', -20, 110));
        response.entries = response.entries.map(Sample.prototype.parse);
        return response;
    }
});

const SamplesView = ResultsView.extend({
    el: '#samples',
    formEl: 'samplesForm',
    params: {},
    template: _.template($("#samplesResultsTmpl").html()),
    defaultQuery: 'domain_source:metagenomics_samples',
    pagination: new Pagination(),

    setDefaultParams: function(){
        this.params = $.extend(true, {}, Search.prototype.params);
        this.params.fields += ",METAGENOMICS_PROJECTS";
        this.params.searchQuery = this.defaultQuery;
    },

    initialize: function () {
        //TODO fetch params from session storage
        this.pagination.setPaginationElem('#samples-pagination');
        const cookieParams = loadSearchParams('samples', getQueryText());
        if (cookieParams) {
            console.log(cookieParams);
            this.params = cookieParams;
        } else {
            this.setDefaultParams();
        }
        console.log('params1', this.params);
        this.params.searchQuery = getQueryText() || this.defaultQuery;
        console.log('params2', this.params);
    },
    update: function (page, pagesize) {
        var formData = processSliders(removeRedundantBiomes($('#' + this.formEl).serializeArray()));
        this.params.facetQuery = formData.queryParams;
        this.params.facets = formData.facets;

        if (pagesize) {
            this.params.size = pagesize;
        }
        if (page) {
            this.params.start = parseInt(this.params.size) * (page - 1);
        }
        return this.fetchAndRender(false, false);
    },
    fetchAndRender: function (renderFilter, setFilters) {
        const that = this;
        const fetchParams = genCombinedQuery(this.params);
        console.log('params3', fetchParams);
        return this.collection.fetch({
            data: $.param(fetchParams),
            success: function (collection, response) {
                that.totalResults = response.hitCount;
                saveSearchParams('samples', that.params);
                if (renderFilter) {
                    filters.render('#samplesFilters', response, that.formEl, fetchParams.query);
                    const $form = $('#' + that.formEl);

                    $form.find("input[type=checkbox]:not('.switch-input')").on('click', function (e) {
                        setChildrenCheckboxes(this);
                        setParentCheckboxStatus(this);
                        addClearButton($(this), $('.filter-clear'));
                        propagateToFacets($(this).attr('type'), $(this).attr('name'), $(this).val(), $(this).is(':checked'), ['#projectsFilters', '#runsFilters']);
                        updateAll();
                    });

                    // $form.find('button.reset').click(function (e) {
                    //     resetAllForms();
                    // });

                    that.pagination.initPagination(1, that.params.size, Math.ceil(response.hitCount / that.params.size), response.hitCount, function (page) {
                        that.update(page);
                    });
                }
                if (setFilters) {
                    setFacetFilters('#' + that.formEl, fetchParams);
                }
                that.render(response, fetchParams);
                $(that.el).find("button[name='download']").click(function () {
                    that.fetchCSV($(this));
                });
            }
        }).promise();
    }
});

const Run = Backbone.Model.extend({
    parse: function (d) {
        d.study_link = '/study/' + d.fields['METAGENOMICS_PROJECTS'][0];
        d.sample_link = '/sample/' + d.fields['METAGENOMICS_SAMPLES'][0];
        d.run_link = '/run/' + d.id;
        d.pipeline_link = '/pipeline/' + d.fields.pipeline_version[0];
        d.biomes = convertBiomes(d);
        return d;
    }
});

const Runs = Search.extend({
    tab: 'runs',
    parse: function (response) {
        response.facets.unshift(addSliderFilter('Depth', 'Metres', 0, 2000));
        response.facets.unshift(addSliderFilter('Temperature', '°C', -20, 110));
        response.entries = response.entries.map(Run.prototype.parse);
        return response;
    }
});

const RunsView = ResultsView.extend({
    el: '#runs',
    formEl: 'runsForm',
    params: {},
    template: _.template($("#runsResultsTmpl").html()),
    defaultQuery: 'domain_source:metagenomics_runs',
    pagination: new Pagination(),

    setDefaultParams: function(){
        this.params = $.extend(true, {}, Search.prototype.params);
        this.params.fields += ",METAGENOMICS_PROJECTS,METAGENOMICS_SAMPLES,experiment_type,pipeline_version";
        this.params.searchQuery = this.defaultQuery;
    },

    initialize: function () {
        //TODO fetch params from session storage
        this.pagination.setPaginationElem('#runs-pagination');
        const cookieParams = loadSearchParams('runs', getQueryText());
        if (cookieParams) {
            console.log(cookieParams);
            this.params = cookieParams;
        } else {
            this.setDefaultParams();
        }
        console.log('params1', this.params);
        this.params.searchQuery = getQueryText() || this.defaultQuery;
        console.log('params2', this.params);
    },

    update: function (page, pagesize) {
        var formData = processSliders(removeRedundantBiomes($('#' + this.formEl).serializeArray()));
        this.params.query = formData.queryParams.join(" AND ");
        this.params.facets = formData.facets;

        if (pagesize) {
            this.params.size = pagesize;
        }
        if (page) {
            this.params.start = parseInt(this.params.size) * (page - 1);
        }
        return this.fetchAndRender(false, false);
    },

    fetchAndRender: function (renderFilter, setFilters) {
        const that = this;
        const fetchParams = genCombinedQuery(this.params);
        console.log('params3', fetchParams);
        return this.collection.fetch({
            data: $.param(fetchParams),
            success: function (collection, response) {
                that.totalResults = response.hitCount;
                saveSearchParams('runs', that.params);
                if (renderFilter) {
                    filters.render('#runsFilters', response, that.formEl, fetchParams.query);
                    const $form = $('#' + that.formEl);

                    $form.find("input[type=checkbox]:not('.switch-input')").on('click', function (e) {
                        setChildrenCheckboxes(this);
                        setParentCheckboxStatus(this);
                        addClearButton($(this), $('.filter-clear'));
                        propagateToFacets($(this).attr('type'), $(this).attr('name'), $(this).val(), $(this).is(':checked'), ['#projectsFilters', '#samplesFilters']);
                        updateAll();
                    });

                    // $form.find('button.reset').click(function (e) {
                    //     resetAllForms();
                    // });

                    that.pagination.initPagination(1, that.params.size, Math.ceil(response.hitCount / that.params.size), response.hitCount, function (page) {
                        that.update(page);
                    });
                }
                if (setFilters) {
                    setFacetFilters('#' + that.formEl, fetchParams);
                }
                that.render(response, fetchParams);
                $(that.el).find("button[name='download']").click(function () {
                    that.fetchCSV($(this));
                });
            }
        }).promise();
    }
});

function genCombinedQuery(params){
    const fetchParams = $.extend(true, {}, params);
    let queryParts = fetchParams.facetQuery || [];
    queryParts.push(fetchParams.searchQuery);
    fetchParams.query = queryParts.join(" AND ");
    delete fetchParams.facetQuery;
    delete fetchParams.searchQuery;

    return fetchParams;
}


function addClearButton($input, $container) {
    let facet = $input.attr('name') || $input.attr('data-facet-name');
    if (facet) {
        facet = convertFacetLabelName(facet);
        // Verify checkbox is checked OR
        if ($input.is(':checked')) {
            if (!$container.find("[data-facet='" + facet + "']").length) {
                const $button = $("<button data-facet='" + facet + "' class='button facet-remove-button'>" + facet + " <span class=\"icon icon-functional\" data-icon=\"x\"/></button>");
                $button.click(function () {
                    resetInputsInElem($(".filters").find('.' + facet + '-group'));
                    $container.find("[data-facet='" + facet + "']").remove();
                    updateAll();
                });
                $container.append($button);
            }
        } else {
            // if any checkboxes on the same level are enabled
            if (!getFacetCheckboxes($input).is(':checked')) {
                $container.find("[data-facet='" + facet + "']").remove();
            }
        }
    }
}

window.convertFacetLabelName = convertFacetLabelName;

function convertFacetLabelName(label) {
    return label.replace(' ', '_');
}

function resetInputsInElem($elem) {
    _.each($elem.find('input:not([type="checkbox"])'), function (elem) {
        $(elem).val($(elem).attr('defaultValue')).trigger('change');
    });
    $elem.find('input[type="checkbox"]').prop('checked', false);
    $elem.find('input[type="checkbox"]').prop('indeterminate', false);
    $elem.find('.switch-input').map(sliderToggleCallback);
}

function processSliders(formData) {
    const queryNames = ['temperaturemin', 'temperaturemax', 'depthmin', 'depthmax'];
    const temp = [null, null];
    const depth = [null, null];
    _.each(formData, function (elem) {
        if (elem.name === 'temperaturemin') {
            temp[0] = elem.value;
        }
        else if (elem.name === 'temperaturemax') {
            temp[1] = elem.value;
        }
        else if (elem.name === 'depthmin') {
            depth[0] = elem.value;
        }
        else if (elem.name === 'depthmax') {
            depth[1] = elem.value;
        }
    });
    let queryParams = [];

    if (temp.indexOf(null) === -1) {
        queryParams.push('temperature:[' + temp[0] + ' TO ' + temp[1] + ']');
    }
    if (depth.indexOf(null) === -1) {
        queryParams.push('depth:[ ' + depth[0] + ' TO ' + depth[1] + ']');
    }

    return {
        facets: joinFilters(formData.filter(function (elem) {
            return (queryNames.indexOf(elem.name) === -1);
        })),
        queryParams: queryParams,
    }
}

function joinFilters(filters) {
    return filters.map(function (elem) {
        return elem.name + ":" + elem.value;
    }).join(',')
}

function removeRedundantBiomes(formData) {
    var newData = formData.filter(function (elem) {
        return elem.name !== 'biome';
    });
    var biomes = formData.filter(function (elem) {
        return elem.name === 'biome';
    });
    _.each(biomes, function (biome) {
        let parent = null;
        let biomeValue = biome.value;
        if (biomeValue.indexOf('/') > -1) {
            var pos = biomeValue.lastIndexOf('/');
            parent = biomeValue.substring(0, pos);
        } else {
            parent = '';
        }
        var parentExists = _.find(biomes, function (biome2) {
            return biome2.value === parent
        });

        if (!parentExists) {
            newData.push(biome);
        }
    });
    return newData;
}

function propagateToFacets(type, name, value, checked, otherFacets) {
    _.each(otherFacets, function (formId) {
        if (type === 'checkbox') {
            let checkbox = $(formId).find("input[name='" + name + "'][value='" + value + "']");
            if (checkbox.length) {
                let updateForm = checkbox.is(':checked') !== checked;
                checkbox.prop('checked', checked);
                setParentCheckboxStatus(checkbox);
                setChildrenCheckboxes(checkbox);
            }
        } else {
            $(formId).find("input[name='" + name + "']").val(value);
        }
    });
}

function convertBiomes(entry) {
    let biomes = [];
    _.each(entry.fields.biome, function (biome) {
        biome = 'root:' + biome.replace(/\/([^\/]*)$/, '').replace(/\//g, ':');
        biomes.push({
            name: util.formatLineage(biome),
            icon: util.getBiomeIcon(biome)
        });
    });
    return biomes;
}

function addSliderFilter(name, units, min, max) {
    return {
        type: 'slider',
        label: name,
        units: units,
        min: min,
        max: max
    }
}

function setFacetFilters(formId, params) {
    const $form = $(formId);
    if (params.facets) {
        let facetParams = params.facets.split(",");
        _.each(facetParams, function (param) {
            let [name, value] = param.split(":");
            // Set checkbox parent and propagate to parent
            const selector = formId + " input[name='" + name + "'][value='" + value + "']";
            $(selector).prop('checked', true).parent().show();
            setParentCheckboxStatus(selector);
            setChildrenCheckboxes(selector);

            addClearButton($(selector), $('.filter-clear'));
        });
    }
    let setSliders = [];
    if (params.query) {
        const facets = params.query.split(" AND ");
        _.each(facets, function (facet) {
            const data = SLIDER_PARAM_RE.exec(facet);
            if (data && data.length === 4) {
                const facetName = data[1];
                setSliders.push(facetName);
                const valueMin = data[2];
                const valueMax = data[3];
                $form.find(formId + facetName + 'min').val(valueMin);
                $form.find(formId + facetName + 'max').val(valueMax);
            }
        });
    }
    _.each(['temperature', 'depth'], function (facetName) {
        $(formId).find('.' + facetName + '-group').find('input.switch-input').each(function () {
            const enabled = setSliders.indexOf(facetName) > -1;
            $(this).prop('checked', enabled);
            enableSlider($(this), enabled, false);
            addClearButton($(this), $('.filter-clear'));
        });
    });
}

function getChildrenCheckboxes(elem) {
    return $(elem).siblings('.facet-child-group').children('.facet-checkbox');
}

function getParentCheckbox(elem) {
    return $(elem).parent().siblings('.facet-checkbox');
}

function getFacetCheckboxes(elem) {
    return $(elem).closest('.facet-group').find('input');
}

function setChildrenCheckboxes(elem) {
    const $children = getChildrenCheckboxes(elem);
    $children.attr('indeterminate', false);
    $children.attr('checked', $(elem).is(':checked'));

}

function setParentCheckboxStatus(elem) {
    const parentCheckSelector = getParentCheckbox(elem);
    const children = getChildrenCheckboxes(parentCheckSelector);
    let checkedChildren = 0;
    let countChildren = children.length;
    let indeterminateChildren = 0;
    _.each(children, function (checkbox) {
        if (checkbox.checked) {
            checkedChildren++;
        }
        if ($(checkbox).prop('indeterminate')) {
            indeterminateChildren++;
        }
    });

    const $parentCheckbox = $(parentCheckSelector);

    if (indeterminateChildren > 0) {
        $parentCheckbox.prop('indeterminate', true);
        $parentCheckbox.prop('checked', false);
    } else if (checkedChildren === 0) {
        $parentCheckbox.prop('indeterminate', false);
        $parentCheckbox.prop('checked', false);
    } else if (checkedChildren < countChildren) {
        $parentCheckbox.prop('indeterminate', true);
        $parentCheckbox.prop('checked', false);
    } else {
        $parentCheckbox.prop('indeterminate', false);
        $parentCheckbox.prop('checked', true);
    }
    if (getParentCheckbox(parentCheckSelector).val() !== undefined) {
        setParentCheckboxStatus(parentCheckSelector);
    }
}

/**
 * Waterfall checkbox behaviour (checkbox reflects values of child checkboxes (OFF | Partial | ON)
 */
function attachCheckboxHandlers(elem) {
    // $(elem).find('.facet-checkbox').on('change', function () {
    //     // Check children
    //     setChildrenCheckboxes(this);
    //     setParentCheckboxStatus(this);
    // });

    $(elem).find('.disp-children').on('click', function (e) {
        e.preventDefault();
        const $group = $(this).siblings('.facet-child-group');

        $group.toggle();
        if ($group.is(":visible")) {
            $(this).text("\u25BC");
        } else {
            $(this).text("\u25B6");
        }
    });
}

function isFacetParam(elem) {
    const res = SLIDER_PARAM_RE.exec(elem);
    return res !== null && res.length === 4;
}

function saveSearchParams(facet, params) {
    let cookieParams = $.extend(true, {}, params);
    if (cookieParams.query) {
        delete cookieParams.query;
    }
    Cookies.set(COOKIE_NAME + facet, cookieParams);
}

function loadSearchParams(facet) {
    let data = Cookies.get(COOKIE_NAME + facet);
    if (data) {
        data = JSON.parse(data);
        data.query = data.sliderQuery || [];
        if (data.textQuery) {
            data.query.push(data.textQuery);
        }
        data.query = data.query.join(' AND ');
        delete data.textQuery;
        delete data.sliderQuery;
        return data;
    }
    return null;
}

function deleteCachedSearchParams() {
    _.each(['projects', 'samples', 'runs'], function (facet) {
        Cookies.remove(COOKIE_NAME + facet);
    })
}

function sliderToggleCallback(e) {
    const $checkbox = $(this);
    const enabled = $checkbox.is(':checked');
    enableSlider($checkbox, enabled);
    const formId = $(this).closest('form').attr('id');
    if (e && e.originalEvent && e.originalEvent.isTrusted) {
        const groupClass = '.' + $(this).parent().parent().attr('class').replace(' ', '.');
        _.map(getAllFormIds(formId), function (otherFacetForm) {
            const $checkbox = $(otherFacetForm).find(groupClass).find('input.switch-input');
            $checkbox.prop('checked', enabled);
            enableSlider($checkbox, enabled);
        });
        addClearButton($(this), $('.filter-clear'));
        updateAll();
    }
}

function enableSlider($checkbox, enabled) {
    const $parent = $checkbox.parent();
    const $elemGroup = $parent.siblings('.slider-group');
    if (enabled) {
        $elemGroup.removeClass('disabled');
        $elemGroup.find('.slider').slider('enable');
    } else {
        $elemGroup.addClass('disabled');
        $elemGroup.find('.slider').slider('disable');
    }
    $elemGroup.find(':input').prop('disabled', !enabled);
}

function initAll(projectsView, samplesView, runsView, renderFilters, setFilters) {
    showSpinner();
    return $.when(
        projectsView.fetchAndRender(renderFilters, setFilters),
        samplesView.fetchAndRender(renderFilters, setFilters),
        runsView.fetchAndRender(renderFilters, setFilters)
    ).done(function () {
        hideSpinner();
    });
}

function updateAll(pagesize) {
    showSpinner();
    return $.when(
        projectsView.update(null, pagesize),
        samplesView.update(null, pagesize),
        runsView.update(null, pagesize)
    ).done(function () {
        hideSpinner();
    });
}

function showSpinner() {
    $('#loading-icon').fadeIn();
}

function hideSpinner() {
    $('#loading-icon').fadeOut();
}

function getAllFormIds(except) {
    return _.filter([
        '#' + projectsView.formEl,
        '#' + samplesView.formEl,
        '#' + runsView.formEl
    ], function (e) {
        return e !== except;
    })
}

function resetAllForms() {
    $(".facet-remove-button").remove();
    _.each(getAllFormIds(), function (id) {
        const $form = $(id);
        resetInputsInElem($form);
    });
    deleteCachedSearchParams();
    projectsView.initialize();
    samplesView.initialize();
    runsView.initialize();

    initAll(projectsView, samplesView, runsView, false, false);
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

const button = $("<button id='search-reset' class='button' type='reset'>Clear all</button>");
const $searchForm = $("#headerSearchForm");
$searchForm.append(button);
$searchForm.on('reset', function () {
    deleteCachedSearchParams();
    resetAllForms();
});


function getQueryText(){
    return $searchForm.find("#navbar-query").val();
}

let search = new Search();

let projects = new Projects();
let projectsView = new ProjectsView({collection: projects});

let samples = new Samples();
let samplesView = new SamplesView({collection: samples});

let runs = new Runs();
let runsView = new RunsView({collection: runs});

let filters = new FiltersView(updateAll);

initAll(projectsView, samplesView, runsView, true, true);



