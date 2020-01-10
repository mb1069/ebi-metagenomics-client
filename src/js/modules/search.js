const SEARCH_URL = process.env.SEARCH_URL;

const util = require('../util');
const _ = require('underscore');
const Backbone = require('backbone');
const Cookies = require('js-cookie');
const commons = require('../commons');
const cookieName = commons.COOKIE_NAME;
const Pagination = require('../components/pagination').Pagination;
require('webpack-jquery-ui/slider');
require('webpack-jquery-ui/css');
require('../../../static/js/jquery.TableCSVExport');

const CheckboxTree = require('../components/checkboxTree');

const Slider = require('../components/slider.js');

util.setupPage('#search-nav');
util.attachTabHandlers();

const DEFAULT_QUERIES = [
    'domain_source:metagenomics_projects',
    'domain_source:metagenomics_samples',
    'domain_source:metagenomics_analyses'
];

const SLIDER_PARAM_RE = /(\w+):\[\s*([-]?\d+) TO ([-]?\d+)]/;

let ProjectsView;
let SamplesView;
let AnalysesView;

/**
 *  Retrieve query object from cookie
 * @return {*}
 */
function getCookieQuery() {
    let cookie = Cookies.get(cookieName);
    let data = null;
    if (cookie) {
        cookie = JSON.parse(cookie);
        try {
            data = cookie['projects']['query'];
        } catch (e) {
            console.warn('Could not retrieve site data from cookie.');
        }
    }
    return data;
}

let queryText = util.getURLFilterParams()['query'];
if (queryText === undefined || queryText === null) {
    queryText = getCookieQuery();
}
$('#navbar-query').val(queryText);

$(document).ready(function() {
    // TODO convert to template argument
    $('#pagesize-text').hide();
});

$('#pageSize').append(commons.pagesize).find('#pagesize').change(function() {
    updateAll($(this).val());
});

/**
 * Format search summary from params
 * @param {object} params with properties queryText, filterText and sliderText
 * @return {string}
 */
function formatSearchSummaryStr(params) {
    let str = '';
    const queryText = params.queryText || '';
    const validQueryText = queryText.length > 0;
    const filterText = params.filterText || '';
    const validFilterText = filterText.length > 0;
    const sliderText = params.sliderText || '';
    const validSliderText = sliderText.length > 0;

    if (validQueryText) {
        str += ' with keyword: ' + queryText;
    }
    if (validFilterText) {
        if (validQueryText) {
            str += ' and ';
        } else {
            str += ' with ';
        }
        str += 'filters: ' + filterText;
    }
    if (validSliderText) {
        if (validQueryText || validFilterText) {
            str += ' and ';
        } else {
            str += ' with ';
        }
        str += sliderText;
    }
    if (!(validQueryText || validFilterText || validSliderText)) {
        str += ' with no parameters';
    }
    str += '.';
    return str;
}

/**
 * Retrieve names of visible columns of facets
 * @param {string} facet string  should be in [projects, samples, analyses]
 * @return {[string]} of visible columns or null
 */
function getVisibleColumns(facet) {
    let cookieData = Cookies.get(cookieName);
    let columns = null;
    if (cookieData) {
        cookieData = JSON.parse(cookieData);
        if (cookieData[facet]) {
            columns = cookieData[facet]['columns'];
        }
    }
    return columns;
}

/**
 * Store list of visible colums to cookie
 * @param {string} facet string {projects, samples, analyses}
 * @param {[string]} columns list of column names
 */
function saveVisibleColumns(facet, columns) {
    let cookieData = Cookies.get(cookieName);
    if (cookieData) {
        cookieData = JSON.parse(cookieData);
    } else {
        cookieData = {};
    }
    if (cookieData[facet]) {
        cookieData[facet] = {
            columns,
            data: cookieData[facet]['data']
        };
    } else {
        cookieData[facet] = {
            columns
        };
    }
    Cookies.set(cookieName, cookieData);
}

/**
 * Retrieve pagesize from selector
 * @return {int}
 */
function getPageSize() {
    return $('#pagesize').val();
}

/**
 * Show loading gif
 */
function showSpinner() {
    $('#loading-icon').fadeIn();
}

/**
 * Hide loading gif
 */
function hideSpinner() {
    $('#loading-icon').fadeOut();
}

/**
 * Retrieve list of other facet form Ids other than specified id
 * @param {string} except id to exclude from list
 * @return {[string]} Array of form ids
 */
function getAllFormIds(except) {
    return $('form.search-filters:not(#' + except + ')').map((i, elem) => {
        return '#' + elem.id;
    }).get();
}

const button = $(
    '<button id="search-reset" class="button" type="reset">Clear all</button>');
const $searchForm = $('#headerSearchForm');
$searchForm.append(button);
$searchForm.on('reset', function() {
    Cookies.remove(cookieName);
    window.location.href = 'search';
});

/**
 * Retrieve query text from search form
 * @return {string}
 */
function getQueryText() {
    return $searchForm.find('#navbar-query').val();
}

/**
 * Retrieve value from slider and facets to which the slider is applied,
 * and the query text for the slider
 * @param {object} formData
 * @return {{facets, queryParams: Array}}
 */
function processSliders(formData) {
    const queryNames = [
        'temperaturemin',
        'temperaturemax',
        'depthmin',
        'depthmax'];
    const temp = [null, null];
    const depth = [null, null];
    _.each(formData, function(elem) {
        switch (elem.name) {
            case 'temperaturemin':
                temp[0] = elem.value;
                break;
            case 'temperaturemax':
                temp[1] = elem.value;
                break;
            case 'depthmin':
                depth[0] = elem.value;
                break;
            case 'depthmax':
                depth[1] = elem.value;
                break;
            default:
        }
    });
    let queryParams = [];

    if (temp.indexOf(null) === -1) {
        queryParams.push('temperature:[' + temp[0] + ' TO ' + temp[1] + ']');
    }
    if (depth.indexOf(null) === -1) {
        queryParams.push('depth:[' + depth[0] + ' TO ' + depth[1] + ']');
    }
    return {
        facets: formData.filter(function(elem) {
            return (queryNames.indexOf(elem.name) === -1);
        }),
        queryParams
    };
}

/**
 * Form search filters for submission to search
 * @param {[string]} filters
 * @return {string}
 */
function joinFilters(filters) {
    return filters.map(function(elem) {
        return elem.name + ':' + elem.value;
    }).join(',');
}

/**
 * Simplify filters (i.e do not query by sub-biome if parent biome is already included in filter
 * @param {[string]} formData list of filters
 * @return {[string]} simplified list of filters
 */
function removeRedundantFilters(formData) {
    let newData = [];
    _.each(formData, function(biome) {
        let parent = null;
        let biomeValue = biome.value;
        if (biomeValue.indexOf('/') > -1) {
            let pos = biomeValue.lastIndexOf('/');
            parent = biomeValue.substring(0, pos);
        } else {
            parent = '';
        }
        let parentExists = _.find(formData, function(biome2) {
            return biome2.value === parent;
        });

        if (!parentExists) {
            newData.push(biome);
        }
    });
    return newData;
}

/**
 * Format biomes to name/icon for use in
 * @param {object} entry
 * @return {Array}
 */
function convertBiomes(entry) {
    let biomes = [];
    _.each(entry.fields.biome, function(biome) {
        biome = 'root:' + biome.replace(/\/([^/]*)$/, '').replace(/\//g, ':');
        biomes.push({
            name: util.formatLineage(biome, true),
            icon: util.getBiomeIcon(biome)
        });
    });
    return biomes;
}

/**
 * Enable or disable a slider
 * @param {jQuery.HTMLElement} $checkbox jQuery elem of toggle button
 * @param {boolean} enabled
 */
function setSlider($checkbox, enabled) {
    const $groupContainer = $checkbox.parent().parent();
    const $elemGroup = $groupContainer.siblings('.slider-group');
    if (enabled) {
        $elemGroup.removeClass('disabled');
        $elemGroup.find('.slider').slider('enable');
    } else {
        $elemGroup.addClass('disabled');
        $elemGroup.find('.slider').slider('disable');
    }
    $elemGroup.find(':input').prop('disabled', !enabled);
}

/**
 * Callback for toggle button which enables/disables slider
 * @param {event} e
 */
function sliderToggleCallback(e) {
    const $checkbox = $(this);
    const dataFacetName = $checkbox.attr('data-facet-name');
    const enabled = $checkbox.is(':checked');

    setSlider($checkbox, enabled);
    const formId = $(this).closest('form').attr('id');
    if (e && e.originalEvent && e.originalEvent.isTrusted) {
        _.map(getAllFormIds(formId), function(otherFacetForm) {
            const $checkbox = $(otherFacetForm)
                .find('input.switch-input[data-facet-name="' + dataFacetName +
                    '"]');
            $checkbox.trigger('click');
            setSlider($checkbox, enabled);
        });
        updateAll();
    }
}

/**
 * Pre-load filter forms with formData
 * @param {string} formId id of form in facet
 * @param {*} formData
 */
function setFacetFilters(formId, formData) {
    if (formData.facets) {
        let facetParams = formData.facets.split(',');
        _.each(facetParams, function(param) {
            let [name, value] = param.split(':');
            // Set checkbox parent and propagate to parent
            const selector = formId + ' input[name="' + name + '"][value="' +
                value + '"]';
            $(selector).prop('checked', true).parent().show();
        });
    }
    let setSliders = [];
    // TODO slider setting
    if (formData.query) {
        const facets = formData.query.split(' AND ');
        const $form = $(formId);
        _.each(facets, function(facet) {
            const data = SLIDER_PARAM_RE.exec(facet);
            if (data && data.length === 4) {
                const facetName = data[1];
                setSliders.push(facetName);
                const valueMin = data[2];
                const valueMax = data[3];
                $form.find('[name=' + facetName + 'min]')
                    .val(valueMin)
                    .prop('disabled', false);
                $form.find('[name=' + facetName + 'max]')
                    .val(valueMax)
                    .prop('disabled', false);
                $form.find('.slider[data-facet-slider=' + facetName + ']')
                    .slider({
                        values: [valueMin, valueMax],
                        disabled: false
                    });
                $form.find('.switch-input[data-facet-name=' + facetName + ']')
                    .prop('checked', true);
            }
        });
    }
    _.each(['temperature', 'depth'], function(facetName) {
        $(formId)
            .find('.' + facetName + '-group')
            .find('input.switch-input')
            .each(function() {
                const enabled = setSliders.indexOf(facetName) > -1;
                $(this).prop('checked', enabled);
                setSlider($(this), enabled, false);
                // addClearButton($(this), $(".filter-clear"));
            });
    });
    $(formId).find('.switch-input').click(sliderToggleCallback);
}

/**
 * Returns true if parameter name is that of a slider
 * @param {string} name
 * @return {boolean}
 */
function isSliderParam(name) {
    const res = SLIDER_PARAM_RE.exec(name);
    return res !== null && res.length === 4;
}

/**
 * Instantiate result view with modal for column toggling
 * @param {string} facet {projects, samples, analyses}
 * @param {jQuery.HTMLElement} $table jQuery elem of table for facet
 * @param {jQuery.HTMLElement} $modal jQuery elem of modal for table and facet
 * @param {[string]} initColumns initially visible columns
 */
function createDataTable(facet, $table, $modal, initColumns) {
    /**
     * Set column visibility
     * @param {boolean} visible
     * @param {string} dataColumn attribute value
     */
    function setColumnVisibility(visible, dataColumn) {
        const tds = $table.find('td[data-column="' + dataColumn + '"]');
        if (visible) {
            tds.show();
        } else {
            tds.hide();
        }
    }

    /**
     * Add checkbox to a modal
     * @param {jQuery.HTMLElement} $modal
     * @param {string} text
     * @param {string} label
     * @param {boolean} checked
     */
    function addModalCheckbox($modal, text, label, checked) {
        setColumnVisibility(checked, label);

        const $checkbox = $('<input data-column="' + label +
            '" type="checkbox" />');
        $checkbox.prop('checked', checked);

        const $label = $('<label for="' + label + '">' + text + '</label>');
        const $container = $('<div class="row column"></div>');
        $checkbox.click(function() {
            setColumnVisibility($(this).is(':checked'),
                $(this).attr('data-column'));

            const visibleColumns = [];
            $modal.find('input[type=checkbox]:checked').each(function() {
                visibleColumns.push($(this).attr('data-column'));
            });
            saveVisibleColumns(facet, visibleColumns);
        });

        $container.append($label).append($checkbox);
        $modal.append($container);
    }

    _.each($table.find('thead').find('td'), function(column) {
        const text = $(column).attr('data-column');
        const visible = initColumns.indexOf(text) !== -1;
        addModalCheckbox($modal, $(column).text(),
            $(column).attr('data-column'), visible);
    });
}

/**
 * Instantiate sliders in form
 * @param {jQuery.HTMLElement} $form jQuery elem of form
 * @param {string} facet {projects, samples, analyses}
 * @param {callback} callback action required on slider value change
 * @param {jQuery.HTMLElement} $btnContainer container of button
 */
function createSliders($form, facet, callback, $btnContainer) {
    let tempSliderOptions = {
        facet: facet,
        label: 'Temperature',
        name: 'temperature',
        min: -20,
        max: 110,
        units: '°C',
        callback: callback,
        $btnContainer: $btnContainer
    };
    new Slider().init($form, tempSliderOptions);
    let depthSliderOptions = {
        facet: facet,
        label: 'Depth',
        name: 'depth',
        min: 0,
        max: 2000,
        units: 'meters',
        callback: callback,
        $btnContainer: $btnContainer
    };
    new Slider().init($form, depthSliderOptions);
}

/**
 * Create waterfall of expandable checkboxes
 * @param {string} facet name {projects, samples, analyses}
 * @param {{}} trees trees to create
 * @param {Backbone.View} facetView view to update on checkbox action
 * @param {jQuery.HTMLElement} $facetForm jQuery elem for facet form
 * @param {jQuery.HTMLElement} $facetBtnContainer jQuery elem for tree container in facetform
 * @param {callback} callback on checkbox event callback
 */
function createCheckboxTrees(
    facet, trees, facetView, $facetForm, $facetBtnContainer, callback) {
    let values = null;
    if (facetView.params.facets) {
        values = _.map(facetView.params.facets.split(','), function(facet) {
            const p = facet.split(':');
            return {
                id: p[0],
                value: p[1]
            };
        });
    } else {
        values = [];
    }

    _.each(trees, function(tree) {
        if (tree.id !== 'domain_source') {
            new CheckboxTree().init(facet, $facetForm,
                $facetBtnContainer, tree, callback, values, false);
        }
    });
}

/**
 * Save search filters to cookie
 * @param {string} facet {projects, samples, analyses}
 * @param {string} filters
 * @param {string} query
 */
function saveSearchParams(facet, filters, query) {
    let cookieParams = Cookies.get(cookieName);
    if (cookieParams === undefined) {
        cookieParams = {};
        cookieParams[facet] = {};
    } else {
        cookieParams = JSON.parse(cookieParams);
        if (cookieParams[facet] === undefined) {
            cookieParams[facet] = {};
        }
    }
    if (filters) {
        cookieParams[facet]['filters'] = filters;
    } else {
        delete cookieParams[facet]['filters'];
    }
    if (query) {
        if (DEFAULT_QUERIES.indexOf(query) === -1) {
            cookieParams[facet]['query'] = query;
        }
    } else {
        delete cookieParams[facet]['query'];
    }

    Cookies.set(cookieName, cookieParams);
}

/**
 * Load filters from cookies
 * @param {string} facet {projects, samples, analyses}
 * @return {{filters: *, query: *}}
 */
function loadSearchParams(facet) {
    let data = null;
    let query = null;
    let cookie = Cookies.get(cookieName);
    if (cookie) {
        cookie = JSON.parse(cookie);
        try {
            data = cookie[facet]['filters'];
        } catch (e) {
            data = null;
        }

        try {
            query = cookie[facet]['query'];
        } catch (e) {
            query = null;
        }
    }
    return {
        filters: data,
        query
    };
}

/**
 * Calculate pagination metrics
 * @param {number} hitcount total number of results
 * @param {number} start starting
 * @param {number} pagesize pagesize
 * @return {{page: number, pages: number}}
 */
function getPagesObj(hitcount, start, pagesize) {
    let page = (parseInt(start) / parseInt(pagesize)) + 1;
    let pages = Math.ceil(parseInt(hitcount) / parseInt(pagesize)) || 1;
    return {
        page,
        pages
    };
}

/**
 * Generic collection for search results, should only be instantiated via subclass
 */
const Search = Backbone.Collection.extend({
    tab: null,
    params: {
        format: 'json',
        size: 25,
        start: 0,
        fields: 'id,name,biome_name,description',
        facetcount: 10,
        facetsdepth: 5
    },
    filterBtnContainer: 'div.btn-container',
    initialize() {
        if (queryText) {
            this.params.query = queryText;
        }
    },
    url() {
        return SEARCH_URL + this.tab;
    }
});

/**
 * Generic view of search results, should only be instantiated via subclass
 */
const ResultsView = Backbone.View.extend({
    render(response, params, noDisplay, columns) {
        $(this.numResultDisp).text('(' + response['hitCount'] + ')');
        let templateData = $.extend({}, response);
        const defaultQueries = [
            ProjectsView.prototype.defaultQuery,
            SamplesView.prototype.defaultQuery,
            AnalysesView.prototype.defaultQuery];

        if (defaultQueries.indexOf(params.query) === -1) {
            const splitParams = params.query.split(' AND ');
            templateData.queryText = _.reject(splitParams, isSliderParam)[0];

            const sliderParams = _.filter(splitParams, isSliderParam);
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
        templateData['subfolder'] = util.subfolder;
        templateData['queryString'] = formatSearchSummaryStr(templateData);
        if (!noDisplay) {
            const $data = $(this.template(templateData));
            $data.find('td').map(function() {
                if (columns.indexOf($(this).attr('data-column')) === -1) {
                    $(this).hide();
                }
            });
            this.$el.html($data);
        } else {
            return this.template(templateData);
        }
    },
    fetchCSV($buttonElem) {
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
                success(collection) {
                    return collection;
                }
            }));
        }

        $.when(...fetches).done(function(...rawArgs) {
            let args;
            if (typeof(rawArgs[1]) === 'string') {
                args = [rawArgs];
            } else {
                args = rawArgs;
            }
            let collection = null;
            // Concatenate collection entries onto first collection
            for (let i = 0; i < args.length; i++) {
                if (!collection) {
                    collection = args[i][0];
                } else {
                    collection.entries = collection.entries.concat(
                        args[i][0].entries);
                }
            }
            const resultsTmpl = that.render(collection, tmpParams, true, []);
            $(resultsTmpl).filter('table').TableCSVExport({
                showHiddenRows: true,
                delivery: 'download'
            });
        }).fail(function() {
            alert('Could not download, an error has occurred');
            //    TODO improve error handling
        }).always(function() {
            $buttonElem.removeClass('loading-cursor');
            $buttonElem.prop('disabled', false);
        });
    },

    fetchAndRender(renderFilter) {
        const that = this;

        return this.collection.fetch({
            data: $.param(this.params),
            success(ignored, response) {
                that.totalResults = response.hitCount;
                saveSearchParams(that.facetName, that.params.facets,
                    that.params.query);

                const columns = getVisibleColumns(that.facetName) ||
                    that.initColumns;

                that.render(response, that.params, false, columns);

                if (renderFilter) {
                    createDataTable(that.facetName, $(that.tableElem),
                        $(that.tableModal),
                        columns);
                    that.pagination.init(1, that.params.size,
                        Math.ceil(response.hitCount / that.params.size),
                        response.hitCount, function(page) {
                            that.update(page);
                        });
                } else {
                    const pageObj = getPagesObj(response.hitCount,
                        that.params.start, that.params.size);
                    that.pagination.update(pageObj, function(page) {
                        that.update(page);
                    });
                }

                $(that.el).find('button[name="download"]').click(function() {
                    that.fetchCSV($(this));
                });
            }
        }).promise();
    }
});

/**
 * Method to generate initial search parameters for a view, either from stored cookie or defaults
 * @param {Backbone.View} view instance of facet {projects, samples, analysess}
 * @param {{}} cookieParams
 */
function genInitParams(view, cookieParams) {
    view.params = $.extend(true, {}, Search.prototype.params);

    if (cookieParams) {
        view.params.facets = cookieParams.filters || '';
        view.params.query = queryText || getQueryText() || cookieParams.query ||
            view.defaultQuery;
    } else {
        view.params.facets = '';
        view.params.query = queryText || getQueryText() || view.defaultQuery;
    }
    view.params.fields += view.defaultParamFields;
}

/**
 * Method to update search parameters for a view based on form data, pagination data or defaults
 * @param {Backbone.View} view instance of facet {projects, samples, analyses}
 * @param {number} page currentPage (1-indexed)
 * @param {number} pagesize
 * @param {{}} formData
 */
function updateParams(view, page, pagesize, formData) {
    view.params.facets = joinFilters(formData);
    if (pagesize) {
        view.params.size = pagesize;
    } else {
        view.params.size = getPageSize();
    }
    if (page) {
        view.params.start = parseInt(view.params.size) * (page - 1);
    } else {
        view.params.start = 0;
    }
}

/**
 * Project model parser
 */
const Project = Backbone.Model.extend({
    parse(d) {
        d.biomes = convertBiomes(d);
        d.studyLink = util.subfolder + '/studies/' + d.id;

        // Fix for ebi search issues
        if (d.fields.ENA_PROJECT.length === 0) {
            d.fields.ENA_PROJECT = d.fields.id;
        }
        return d;
    }
});

/**
 * Collection of project results to call parser for each result
 */
const Projects = Search.extend({
    tab: 'projects',
    parse(response) {
        return response.entries.map(Project.prototype.parse);
    }
});

/**
 * View for projects search results
 */
ProjectsView = ResultsView.extend({
    facetName: 'projects',
    el: '#projectsResults',
    formEl: 'projectsFilters',
    params: {},
    pagination: new Pagination(),
    template: _.template($('#projectResultsTmpl').html()),
    defaultQuery: 'domain_source:metagenomics_projects',
    initColumns: [
        'project-ena-accession',
        'project-id',
        'project-biome',
        'project-centre-name'],
    tableElem: '#projectsTable',
    tableModal: '#projectsModal',
    numResultDisp: '#numStudyResults',

    initialize() {
        this.pagination.setPaginationElem('#projects-pagination');
        const cookieParams = loadSearchParams('projects');
        genInitParams(this, cookieParams);
        this.params.fields = 'ENA_PROJECT,METAGENOMICS_ANALYSES,METAGENOMICS_SAMPLES,biome_name,' +
            'centre_name,creation_date,description,domain_source,id,last_modification_date,' +
            'name,releaseDate_date';
    },

    update(page, pagesize) {
        let formData = removeRedundantFilters(
            $('#' + this.formEl).serializeArray());
        if (!this.params.query.length) {
            this.params.query = this.defaultQuery;
        }
        updateParams(this, page, pagesize, formData);
        return this.fetchAndRender(false, false);
    }
});
/**
 * Sample model parser
 */
const Sample = Backbone.Model.extend({
    parse(d) {
        d.studyLink = util.subfolder + '/studies/' +
            d.fields.METAGENOMICS_PROJECTS[0];
        d.sampleLink = util.subfolder + '/samples/' + d.id;
        return d;
    }
});

/**
 * Collection of sample results to call parser
 */
const Samples = Search.extend({
    tab: 'samples',
    parse(response) {
        // response.facets.unshift(addSliderFilter("Depth", "Metres", 0, 2000));
        // response.facets.unshift(addSliderFilter("Temperature", "°C", -20, 110));
        response.entries = response.entries.map(Sample.prototype.parse);
        return response;
    }
});

/**
 * Analysis model parser
 */
const Analysis = Backbone.Model.extend({
    parse(d) {
        d.analysisId = d.fields['name'][0];
        d.studyLink = util.subfolder + '/studies/' +
            d.fields['METAGENOMICS_PROJECTS'][0];
        d.sampleLink = util.subfolder + '/samples/' +
            d.fields['METAGENOMICS_SAMPLES'][0];
        d.analysisLink = util.subfolder + '/analyses/' + d.fields['name'][0] +
            '?version=' + d.fields.pipeline_version[0];
        d.pipelineLink = util.subfolder + '/pipelines/' +
            d.fields.pipeline_version[0];
        d.biomes = convertBiomes(d);
        d.assemblyLink = d.fields['ASSEMBLY'][0];
        d.runLink = d.fields['ENA_RUN'][0];
        return d;
    }
});

/**
 * Collection of analysis results to call parser
 */
const Analyses = Search.extend({
    tab: 'analyses',
    parse(response) {
        response.entries = response.entries.map(Analysis.prototype.parse);
        return response;
    }
});

/**
 * Generic results view with slider handling, should be parametrised via subclass
 * (see SamplesView, AnalysesView)
 */
const ComplexResultsView = ResultsView.extend({
    params: {},
    pagination: null,

    setDefaultParams() {
        this.params = $.extend(true, {}, Search.prototype.params);
        this.params.fields += this.defaultParamFields;
        this.params.searchQuery = this.defaultQuery;
    },

    initialize() {
        // TODO fetch params from session storage
        this.pagination = new Pagination();
        this.pagination.setPaginationElem(this.paginationElem);
        const cookieParams = loadSearchParams(this.facetName);
        genInitParams(this, cookieParams);
    },

    update(page, pagesize) {
        let formData = processSliders(
            removeRedundantFilters($('#' + this.formEl).serializeArray()));
        const queryText = getQueryText();
        if (queryText) {
            formData.queryParams.push(queryText);
        }
        this.params.query = formData.queryParams.join(' AND ');

        if (this.params.query === '') {
            this.params.query = this.defaultQuery;
        }

        updateParams(this, page, pagesize, formData.facets || []);
        return this.fetchAndRender(false, false);
    }
});

/**
 * Parametrised subclass of results view w/ sliders
 */
SamplesView = ComplexResultsView.extend({
    facetName: 'samples',
    el: '#samplesResults',
    formEl: 'samplesFilters',
    template: _.template($('#samplesResultsTmpl').html()),
    defaultQuery: 'domain_source:metagenomics_samples',
    tableElem: '#samplesTable',
    tableModal: '#samplesModal',
    initColumns: [
        'sample-id',
        'sample-projects',
        'sample-name',
        'sample-desc'],
    paginationElem: '#samples-pagination',
    defaultParamFields: ',METAGENOMICS_PROJECTS,project_name,biome_name',
    numResultDisp: '#numSampleResults'

});

/**
 * Parametrised subclass of results view w/ sliders
 */
AnalysesView = ComplexResultsView.extend({
    facetName: 'analyses',
    el: '#analysesResults',
    formEl: 'analysesFilters',
    template: _.template($('#analysesResultsTmpl').html()),
    defaultQuery: 'domain_source:metagenomics_analyses',
    tableElem: '#analysesTable',
    tableModal: '#analysesModal',
    initColumns: [
        'analysis-id',
        'analysis-sample',
        'analysis-project',
        'analysis-experiment-type',
        'analysis-pipeline-vers'],
    paginationElem: '#analyses-pagination',
    defaultParamFields: ',METAGENOMICS_PROJECTS,METAGENOMICS_SAMPLES,' +
    'experiment_type,pipeline_version,ASSEMBLY,ENA_RUN,ENA_WGS_SEQUENCE_SET',
    numResultDisp: '#numAnalysisResults'

});

/**
 * Method to update all views following form events
 * @param {number} pagesize
 * @return {jQuery.promise}
 */
function updateAll(pagesize) {
    showSpinner();
    return $.when(
        projectsView.update(null, pagesize),
        samplesView.update(null, pagesize),
        analysesView.update(null, pagesize)
    ).done(function() {
        hideSpinner();
    });
}

/**
 * Method to instantiate all views on page load
 * @param {Backbone.View} projectsView
 * @param {Backbone.View} samplesView
 * @param {Backbone.View} analysesView
 * @return {jQuery.promise}
 */
function initAll(projectsView, samplesView, analysesView) {
    showSpinner();
    const facetOptions = {
        format: 'json',
        size: 1,
        start: 0,
        facetcount: 10,
        facetsdepth: 3
    };
    const projectFacet = $.get({
        url: SEARCH_URL + 'projects',
        data: _.extend({}, facetOptions, {
            query: 'domain_source:metagenomics_projects'
        }),
        cache: false
    });
    const sampleFacet = $.get({
        url: SEARCH_URL + 'samples',
        data: _.extend({}, facetOptions, {
            query: 'domain_source:metagenomics_samples'
        }),
        cache: false

    });
    const analysisFacet = $.get({
        url: SEARCH_URL + 'analyses',
        data: _.extend({}, facetOptions, {
            query: 'domain_source:metagenomics_analyses'
        }),
        cache: false
    });

    return $.when(
        projectsView.fetchAndRender(true, true),
        samplesView.fetchAndRender(true, true),
        analysesView.fetchAndRender(true, true),
        projectFacet,
        sampleFacet,
        analysisFacet
    ).done(function() {
        hideSpinner();
        createCheckboxTrees('projects', projectFacet.responseJSON.facets,
            projectsView, $('#projectsFilters'), $('#projects-search-params'),
            projectsView.update.bind(projectsView));
        setFacetFilters('#projectsFilters', projectsView.params);

        const $samplesForm = $('#samplesFilters');
        const $sampleBtnContainer = $('#samples-search-params');
        createSliders($samplesForm, 'samples',
            samplesView.update.bind(samplesView), $sampleBtnContainer);
        createCheckboxTrees('samples', sampleFacet.responseJSON.facets,
            samplesView, $samplesForm, $sampleBtnContainer,
            samplesView.update.bind(samplesView));
        setFacetFilters('#samplesFilters', samplesView.params);

        const $analysesForm = $('#analysesFilters');
        const $analysesBtnContainer = $('#analyses-search-params');
        createSliders($analysesForm, 'analyses', analysesView.update.bind(analysesView),
            $analysesBtnContainer);
        createCheckboxTrees('analyses', analysisFacet.responseJSON.facets, analysesView,
            $analysesForm, $analysesBtnContainer, analysesView.update.bind(analysesView));
        setFacetFilters('#analysesFilters', analysesView.params);
    });
}

/**
 * Insert powered-by-ebi search to all facet filter forms
 */
function insertEbiSearchText() {
    const html = '<p><small class="text-muted">Powered by ' +
        '<a href="https://www.ebi.ac.uk/ebisearch/&quot;" class="ext" target="_blank">' +
        'EBI Search' +
        '</a></small></p>';
    $('.ebi-search').html(html);
}

insertEbiSearchText();

window.getVisibleColumns = getVisibleColumns;

window.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

let projects = new Projects();
let projectsView = new ProjectsView({collection: projects});

let samples = new Samples();
let samplesView = new SamplesView({collection: samples});

let analyses = new Analyses();
let analysesView = new AnalysesView({collection: analyses});

initAll(projectsView, samplesView, analysesView);
