const Backbone = require('backbone');
const _ = require('underscore');
const Commons = require('../commons');
const api = require('mgnify').api;
const util = require('../util');
const DetailList = require('../components/detailList');
const GenericTable = require('../components/genericTable');

require('tablesorter');

util.setupPage('#browse-nav');

window.Foundation.addToJquery($);

let accession = util.getURLParameter();
let isRun = ['SRR', 'ERR', 'DRR'].indexOf(accession.slice(0, 3)) > -1;
let objType = 'Assembly';
if (isRun) {
    objType = 'Run';
}
util.specifyPageTitle(objType, accession);

let RunView = Backbone.View.extend({
    model: api.Run,
    template: _.template($('#runTmpl').html()),
    el: '#main-content-area',
    init() {
        const that = this;
        const deferred = $.Deferred();
        this.model.fetch({
            data: {},
            success(data) {
                const attr = data.attributes;
                that.render(attr);
                deferred.resolve();
            },
            error(ignored, response) {
                util.displayError(response.status, 'Could not retrieve ' +
                    (isRun ? 'run' : 'assembly') + ': ' + accession);
                deferred.reject();
            }
        });
        return deferred.promise();
    },
    render(attr) {
        this.$el.html(this.template(this.model.toJSON()));
        let description = {
            'Study': '<a href=\'' + attr.study_url + '\'>' + attr.study_id + '</a>',
            'Sample': '<a href=\'' + attr.sample_url + '\'>' + attr.sample_id + '</a>',
            'ENA accession': '<a class=\'ext\' href=\'' + attr.ena_url + '\'>' + attr.run_id +
            '</a>'
        };
        $('#overview').append(new DetailList('Description', description));
        return this.$el;
    }
});

const columns = [
    {sortBy: null, name: 'Analysis accession'},
    {sortBy: null, name: 'Experiment type'},
    {sortBy: null, name: 'Instrument model'},
    {sortBy: null, name: 'Instrument platform'},
    {sortBy: 'pipeline', name: 'Pipeline version'}
];

let RunAnalysesView = util.GenericTableView.extend({
    tableObj: null,
    pagination: null,
    params: {},

    getRowData(attr) {
        const accessionLink = '<a href=\'' + attr.analysis_url + '\'>' +
            attr.analysis_accession +
            '</a>';
        const pipelineLink = '<a href=\'' + attr.pipeline_url + '\'>' +
            attr.pipeline_version +
            '</a>';
        return [
            accessionLink,
            attr['experiment_type'],
            attr['instrument_model'],
            attr['instrument_platform'],
            pipelineLink];
    },

    initialize() {
        const that = this;
        const $analysesSection = $('#analyses');
        let tableOptions = {
            title: 'Analyses',
            headers: columns,
            initialOrdering: '-pipeline',
            initPageSize: Commons.DEFAULT_PAGE_SIZE,
            isHeader: false,
            textFilter: false,
            tableClass: 'analyses-table',
            callback: function(page, pageSize, order, search) {
                that.update({
                    page: page,
                    page_size: pageSize,
                    ordering: order,
                    search: search
                });
            }
        };
        this.tableObj = new GenericTable($analysesSection, tableOptions);
        const up = this.update({page_size: Commons.DEFAULT_PAGE_SIZE});
        up.always((data) => {
            if (data.models.length === 0) {
                $analysesSection.hide();
            }
        });
    }

});

let RunAssemblyView = util.GenericTableView.extend({
    tableObj: null,
    pagination: null,
    params: {},

    getRowData(attr) {
        const accessionLink = '<a href=\'' + attr.analysis_url + '\'>' +
            attr.analysis_accession +
            '</a>';
        return [
            accessionLink,
            attr['experiment_type'],
            attr['instrument_model'],
            attr['instrument_platform'],
            attr['pipeline_version']];
    },
    initialize() {
        const that = this;
        const $assembliesSection = $('#assemblies');
        let tableOptions = {
            title: 'Assemblies',
            headers: columns,
            initialOrdering: '-pipeline',
            initPageSize: Commons.DEFAULT_PAGE_SIZE,
            isHeader: false,
            textFilter: false,
            tableClass: 'assemblies-table',
            callback: function(page, pageSize, order, search) {
                that.update({
                    page: page,
                    page_size: pageSize,
                    ordering: order,
                    search: search
                });
            }
        };
        this.tableObj = new GenericTable($assembliesSection, tableOptions);
        const up = this.update({page_size: Commons.DEFAULT_PAGE_SIZE});
        up.always((data) => {
            if (data.models.length === 0) {
                $assembliesSection.hide();
            }
        });
    }

});

let run = new api.Run({id: accession});
let runView = new RunView({model: run});

let runAnalyses = new api.RunAnalyses({id: accession});
let runAssemblies = new api.RunAssemblies({id: accession});
runView.init().then(() => {
    return $.when(new RunAnalysesView({collection: runAnalyses}),
        new RunAssemblyView({collection: runAssemblies}));
}).then(() => {
    util.attachExpandButtonCallback();
});
