const Backbone = require('backbone');
const _ = require('underscore');
const $ = require('jquery');
const api = require('../components/api');
const ebisearch = require('../components/ebisearch');
const apiUrl = process.env.API_URL;
const commons = require('../commons');
const blogUrl = commons.BLOG_URL;
const cookieName = commons.COOKIE_NAME;
const Cookies = require('js-cookie');

import {setCurrentTab, truncateString} from "../util";

setCurrentTab('#overview-nav');
// initHeadTag('EBI metagenomics: archiving, analysis and integration of metagenomics data');

$('#this_close').on('click', function () {
    $('.jumbo-header').slideUp();
});

// Shorthand for $( document ).ready()
$(function () {
    // Sets the blog url for 'See all articles' link
    $('#blog-url').attr('href', blogUrl);
});

//  re-style the twitter component
$("iframe").ready(function () {
    var timer = setInterval(function () {
        if ($($("iframe").contents()).find(".avatar").length > 0) {
            $($("iframe").contents()).find(".avatar, .timeline-Tweet-author, .timeline-Tweet-media").css({display: "none"});
            $($("iframe").contents()).find(".timeline-Tweet-retweetCredit").css({'text-align': "center"});
            /*style retweet info text*/
            $($("iframe").contents()).find(".timeline-Tweet-text").css({
                'text-align': "center",
                'font-size': '157%',
                'line-height': '1.4'
            });
            /*style tweet main text*/
            $($("iframe").contents()).find("img.autosized-media").css({'max-height': '175px'});
            /*don't know if this is relevant anymore*/
            clearInterval(timer);
        }
    }, 100);
});

var BiomeView = Backbone.View.extend({
    tagName: 'div',
    first: false,
    template: _.template($("#biomeTmpl").html()),
    attributes: {
        class: 'small-6 medium-6 large-2 columns biome-disp'
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this.$el;
    }
});

var Biomes = Backbone.Collection.extend({
    url: apiUrl + 'biomes/top10?ordering=-samples_count',
    model: api.Biome,
    parse: function (response) {
        return response.data;
    }
});

var BiomesView = Backbone.View.extend({
    el: '#top10biomes',
    initialize: function () {
        var that = this;
        this.collection.fetch({
            success: function () {
                that.collection.models.sort(function (a, b) {
                    return b.attributes.studies_count - a.attributes.studies_count
                });
                that.render();
            }
        });
        return this;
    },
    render: function () {
        let x = 0;
        this.collection.each(function (biome) {
            var biomeView = new BiomeView({model: biome});
            let newElem = biomeView.render();
            if (x % 5 === 0) {
                newElem.addClass('medium-offset-1')
            }
            if ((x + 1) % 5 === 0) {
                newElem.addClass('end')
            }
            $(this.$el).append(newElem);
            x += 1
        }, this);
        return this;
    }
});

var biomes = new Biomes();
var biomesView = new BiomesView({collection: biomes});


var StudyView = Backbone.View.extend({
    tagName: 'div',
    template: _.template($("#studyTmpl").html()),
    attributes: {
        class: 'study',
    },
    render: function () {
        let data = this.model.toJSON();
        data.abstract = truncateString(data.abstract, 250);
        this.$el.html(this.template(data));
        return this.$el
    }
});

// Model for a collection of studies,
var StudiesCollection = Backbone.Collection.extend({
    url: apiUrl + "studies/recent",
    model: api.Study,
    parse: function (response) {
        return response.data;
    }
});

var StudiesView = Backbone.View.extend({
    el: '#studies',
    initialize: function () {
        var that = this;
        this.collection.fetch({
            success: function (response) {
                that.render();
            }
        });
        return this;
    },
    update: function (page, page_size, searchQuery, biome) {
        var that = this;
        $(".study").remove();
        var params = {};
        if (page !== undefined) {
            params.page = page
        }
        if (page_size !== undefined) {
            params.page_size = page_size
        }
        if (biome !== undefined) {
            params.biome = biome
        }
        if (searchQuery !== undefined && searchQuery.length > 0) {
            params.search = searchQuery
        }

        this.collection.fetch({
            data: $.param(params), remove: true, success: function () {
                that.render();
            }
        });
        return this;
    },
    render: function () {
        this.collection.each(function (study) {
            var studyView = new StudyView({model: study});
            $(this.$el).append(studyView.render());
        }, this);
        return this;
    }
});

var studies = new StudiesCollection();
var studiesView = new StudiesView({collection: studies});

function initObjectCounts() {
    //Perform Ajax request
    const projectCountReq = $.get(new ebisearch.ProjectCount().url);
    const sampleCountReq = $.get(new ebisearch.SampleCount().url);
    const runCountReq = $.get(new ebisearch.RunCount().url);
    const ampliconCountReq = $.get(new ebisearch.AmpliconCount().url);
    const assemblyCountReq = $.get(new ebisearch.AssemblyCount().url);
    const metaGountReq = $.get(new ebisearch.MetagenomicCount().url);
    const metaTCountReq = $.get(new ebisearch.MetatranscriptomicCount().url);
    const metaBCountReq = $.get(new ebisearch.MetabarcodingCount().url);

    function createAnchorTag(count, experimentType, domainId) {
        const a = document.createElement('a');
        const linkText = document.createTextNode(count);
        a.appendChild(linkText);
        a.onclick = function (event) {
            let hashAppend = '';
            if (domainId === 'samples') {
                hashAppend = '#samplesTab'
            } else if (domainId === 'runs') {
                hashAppend = '#runsTab'
            }
            setCookieFilter(experimentType);
            window.location = "/metagenomics/search" + hashAppend;
        };
        return a;
    }

    function addTextNode(elementId, count) {
        const unlinkText = document.createTextNode(count);
        let statsElement = document.getElementById(elementId);
        statsElement.appendChild(unlinkText);
    }

    function appendNewAnchorEl(elementId, count, experimentType, domainId) {
        let statsElement = document.getElementById(elementId);
        statsElement.appendChild(createAnchorTag(count, experimentType, domainId));
    }

    function addStatsElementsToDOM(ampliconCount, assemblyCount,
                                   metaBCount, metaGCount, metaTCount,
                                   projectCount, sampleCount, runCount, dataSetCount) {

        appendNewAnchorEl('amplicon-stats', ampliconCount, 'amplicon', 'runs');
        appendNewAnchorEl('assembly-stats', assemblyCount, 'assembly', 'runs');
        appendNewAnchorEl('metaB-stats', metaBCount, 'metabarcoding', 'runs');
        appendNewAnchorEl('metaG-stats', metaGCount, 'metagenomic', 'runs');
        appendNewAnchorEl('metaT-stats', metaTCount, 'metatranscriptomic', 'runs');
        appendNewAnchorEl('project-stats', projectCount, null);
        appendNewAnchorEl('sample-stats', sampleCount, null, 'samples');
        appendNewAnchorEl('run-stats', runCount, null, 'runs');
        addTextNode('dataset-stats', dataSetCount);
    }

    function setCookieFilter(experimentType) {
        Cookies.remove(cookieName);
        const defaultCookieParamsStr = '{"samples":{"query":"domain_source:metagenomics_samples"},"projects":{"query":"domain_source:metagenomics_projects"},"runs":{"query":"domain_source:metagenomics_runs"}}';
        let cookieParams = JSON.parse(defaultCookieParamsStr);

        cookieParams['samples']['filters'] = 'experiment_type:' + experimentType;
        cookieParams['runs']['filters'] = 'experiment_type:' + experimentType;

        Cookies.set(cookieName, cookieParams);
    }

    //Use Promise to get acknowledged when succeeded
    return $.when(
        projectCountReq,
        sampleCountReq,
        runCountReq,
        ampliconCountReq,
        assemblyCountReq,
        metaGountReq,
        metaBCountReq,
        metaTCountReq
    ).done(function () {
        const projectCount = projectCountReq.responseJSON.hitCount;
        const sampleCount = sampleCountReq.responseJSON.hitCount;
        const runCount = runCountReq.responseJSON.hitCount;
        const ampliconCount = ampliconCountReq.responseJSON.hitCount;
        const assemblyCount = assemblyCountReq.responseJSON.hitCount;
        const metaGCount = metaGountReq.responseJSON.hitCount;
        const metaTCount = metaTCountReq.responseJSON.hitCount;
        const metaBCount = metaBCountReq.responseJSON.hitCount;
        const dataSetCount = metaBCount + metaTCount + metaGCount + assemblyCount + ampliconCount;

        addStatsElementsToDOM(ampliconCount, assemblyCount,
            metaBCount, metaGCount, metaTCount,
            projectCount, sampleCount, runCount, dataSetCount);

        let containers = document.getElementsByClassName('jumbo-stats');
        for (var container of containers) {
            container.style.visibility = "visible";
        }
    });
}

initObjectCounts();