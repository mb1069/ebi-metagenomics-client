const _ = require('underscore');
// let MarkerClusterer = require('node-js-marker-clusterer');
const ol = require('ol');
const source = require('ol/source');
const layer = require('ol/layer');
const geom = require('ol/geom');
const proj = require('ol/proj');
const extent = require('ol/extent');
const styleLib = require('ol/style');
const controlLib = require('ol/control');
const styleCss = require('ol/ol.css');


module.exports = class MapHandler {
    /**
     * Create a new instance of a google map in the element with id
     * @param {string} elementId
     * @param {[object]} samples if true add tooltips to markers
     */
    constructor(elementId, samples) {
        let minLat = Number.MAX_SAFE_INTEGER;
        let maxLat = Number.MIN_SAFE_INTEGER;
        let minLng = Number.MAX_SAFE_INTEGER;
        let maxLng = Number.MIN_SAFE_INTEGER;
        let features = [];

        for (let i = 0; i < samples.length; i++) {
            const attr = samples[i]['attributes'];
            let coords = [attr['longitude'], attr['latitude']];
            let url = attr['sample_url'];
            coords = proj.fromLonLat(coords);
            if (coords[0] !== null && coords[1] !== null) {
                if (coords[0] < minLng) {
                    minLng = coords[0];
                } else if (coords[0] > maxLng) {
                    maxLng = coords[0];
                }
                if (coords[1] < minLat) {
                    minLat = coords[1];
                } else if (coords[1] > maxLat) {
                    maxLat = coords[1];
                }
                const feature = new ol.Feature(new geom.Point(coords));
                features.push(feature);
            }
        }

        let featureSrc = new source.Vector({
            features: features
        });

        let clusterSource = new source.Cluster({
            distance: 10,
            source: featureSrc
        });

        let styleCache = {};
        let clusters = new layer.Vector({
            source: clusterSource,
            style: function(feature) {
                let size = feature.get('features').length;
                let style = styleCache[size];
                if (!style) {
                    style = new styleLib.Style({
                        image: new styleLib.Circle({
                            radius: 10,
                            stroke: new styleLib.Stroke({
                                color: '#fff'
                            }),
                            fill: new styleLib.Fill({
                                color: '#3399CC'
                            })
                        }),
                        text: new styleLib.Text({
                            text: size.toString(),
                            fill: new styleLib.Fill({
                                color: '#fff'
                            })
                        })
                    });
                    styleCache[size] = style;
                }
                return style;
            }
        });

        let raster = new layer.Tile({
            source: new source.OSM({
                url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=en'
            })
        });
        // Enforce minimum zoom length
        const lngDiff = maxLng - minLng;
        if (lngDiff < 1000000) {
            minLng -= 500000;
            maxLng += 500000;
        }
        const latDiff = maxLat - minLat;
        if (latDiff < 1000000) {
            minLat -= 500000;
            maxLat += 500000;
        }
        let ext = extent.boundingExtent([[minLng, minLat], [maxLng, maxLat]]);
        ext = proj.transformExtent(ext, proj.get('EPSG:3857'), proj.get('EPSG:3857'));
        $('#' + elementId).empty(); // Remove loading icons
        let map = new ol.Map({
            target: elementId,
            controls: controlLib.defaults().extend([
                new controlLib.ZoomToExtent({
                    extent: ext
                })
            ]),
            layers: [raster, clusters],
            view: new ol.View({
                center: [0, 0],
                zoom: 2
            })
        });

        map.getView().fit(ext, map.getSize());

        window.map = map;
        return map;
    }
};
