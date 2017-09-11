import Backbone from 'backbone';
import _ from 'underscore';
import * as util from '../main';
import tablesorter from 'tablesorter';
import livefilter from 'livefilter';
import Handlebars from 'handlebars'

util.setCurrentTab('#studies-nav');


var study_id = util.getURLParameter();

const STUDIES_PER_PAGE = 500;
var currentPage = 1;
var totalPages = -1;

var Study = Backbone.Model.extend({
    url: function () {
        return util.API_URL + 'studies/' + this.id;
    },
    parse: function (data) {
        const attr = data.data.attributes;
        const biomes = data.data.relationships.biomes.data;
        const biome_list = biomes.map(function (x) {
            return util.formatLineage(x.id)
        });

        return {
            study_id: attr['project-id'],
            study_accession: attr['accession'],
            last_updated: util.formatDate(attr['last-update']),
            contact_details: {
                institute: attr['centre-name'] || util.NO_DATA_MSG,
                name: attr['author-name'] || util.NO_DATA_MSG,
                email: attr['author-email'] || util.NO_DATA_MSG,
            },
            abstract: attr['study-abstract'],
            classifications: biome_list,
            samples: data.included
        }
    }
});

var StudyView = Backbone.View.extend({
    model: Study,
    template: _.template($("#studyTmpl").html()),
    el: '#main-content-area',
    initialize: function () {
        const that = this;
        this.model.fetch({
            data: $.param({include: 'samples'}), success: function (data) {
                that.render();
                attachTabHandlers();
                util.initTableTools();
                const runs = new RunCollection({pid: study_id});
                const runsView = new RunsView({collection: runs});
                initMap(data.attributes.samples);
            }
        });
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this.$el
    }
});

var Run = Backbone.Model.extend({
    parse: function (data) {
        var attr = data.attributes;
        var rel = data.relationships;
        var pipelines = rel.pipelines;
        var analysis = rel.analysis;

        return {
            sample_name: "N/A",
            sample_id: attr['sample-accession'],
            sample_url: '/sample/' + attr['sample-accession'],
            run_id: attr.accession,
            experiment_type: data.relationships['experiment-type'].data.id,
            instrument_model: attr.instrument_model || util.NO_DATA_MSG,
            pipeline_version: pipelines.data.map(function (x) {
                return x.id;
            }).join(", "),
            analysis_results: 'TAXONOMIC / FUNCTION / DOWNLOAD'
        }
    }
});

var RunView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($("#runRow").html()),
    attributes: {
        class: 'run',
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this.$el
    }
});

var RunCollection = Backbone.Collection.extend({
    url: util.API_URL + 'runs',
    model: Run,
    initialize: function (data) {
        this.pid = data.pid;
    },
    parse: function (response) {
        return response.data
    }
});

var RunsView = Backbone.View.extend({
    el: '#runsTableBody',
    initialize: function () {
        var that = this;
        this.collection.fetch({
            data: $.param({study_accession: this.collection.pid}), success: function () {
                that.render();
                createLiveFilter();
            }
        });
        return this;
    },
    render: function () {
        this.collection.each(function (run) {
            var runView = new RunView({model: run});
            $(this.$el).append(runView.render());
        }, this);
        $(this.el).parent().tablesorter();
        return this;
    }
});


function attachTabHandlers() {
    $("li.tabs-title > a").on('click', function () {
        var tabButtonContainer = $(this).closest('ul');
        $(tabButtonContainer).children().children('a').attr('aria-selected', 'false');
        $(this).attr('aria-selected', 'true');

        // Remove active class from all sibling buttons
        var tabId = $(this).attr('href');
        var tabGroup = tabButtonContainer.attr('id');
        $("[data-tab-content=" + tabGroup + "] > .tabs-panel").removeClass('active');
        $(tabId).addClass('active');
    });
};

function createLiveFilter() {
    $('#runsTableBody').liveFilter(
        '#search-filter', 'tr'
    );
}

window.initMap = initMap;

function initMap(samples) {
    var map = new google.maps.Map(document.getElementById('map'), {
        streetViewControl: false,
    });

    const template = Handlebars.compile($("#marker-template").html());

    var oms = new OverlappingMarkerSpiderfier(map, {
        markersWontMove: true,
        markersWontHide: true,
        basicFormatEvents: true
    });

    // Do not display markers with invalid Lat/Long values
    let markers = samples.reduce(function (result, sample) {
        const lat = sample.attributes.latitude;
        const lng = sample.attributes.longitude;
        if (!(lat === null || lng === null)) {
            result.push(placeMarker(map, oms, template, sample));
        }
        return result;
    }, []);

    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].getPosition());
    }
    map.fitBounds(bounds);

    var markerCluster = new MarkerClusterer(map, markers,
        {
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
            maxZoom: 17
        });
    window.map = map;
    return map
}

function getSamplePosition(sample) {
    return {lat: parseFloat(sample.attributes.latitude), lng: parseFloat(sample.attributes.longitude)}
}

function createMarkerLabel(template, sample) {
    const attr = sample.attributes;
    var data = {
        id: attr.accession,
        name: attr['sample-name'],
        desc: attr['sample-desc'],
        classification: attr['environment-biome'],
        collection_date: attr['collection-date'],
        lat: attr['latitude'],
        lng: attr['longitude'],
        sample_url: 'sample/' + attr.accession + '/'
    };
    return template(data);
}

function placeMarker(map, oms, template, sample) {
    const pos = getSamplePosition(sample);

    var marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: sample.id
    });


    var contentString = createMarkerLabel(template, sample);

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    google.maps.event.addListener(marker, 'spider_click', function(e){
        infowindow.open(map, marker);
    });
    oms.addMarker(marker);
    // marker.addListener('click', function () {
    // });
    return marker;
}

var study = new Study({id: study_id});
var studyView = new StudyView({model: study});
