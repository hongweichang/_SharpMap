$(document).ready(function() {
    var options, init;

    OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;
    OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
    OpenLayers.Util.onImageLoadErrorColor = 'transparent';
    OpenLayers.Util.onImageLoadError = function() {
        this.src = '/Content/Images/sorry.jpg';
        this.style.backgroundColor = OpenLayers.Util.onImageLoadErrorColor;
    };

    options = {
        wms: 'WMS',
        controls: [],
        maxExtent: new OpenLayers.Bounds(-2.003750834E7, -2.003750834E7, 2.003750834E7, 2.003750834E7),
        resolutions: [
            156543.03390625,
            78271.516953125,
            39135.7584765625,
            19567.87923828125,
            9783.939619140625,
            4891.9698095703125,
            2445.9849047851562,
            1222.9924523925781,
            611.4962261962891,
            305.74811309814453,
            152.87405654907226,
            76.43702827453613,
            38.218514137268066,
            19.109257068634033,
            9.554628534317017,
            4.777314267158508,
            2.388657133579254,
            1.194328566789627,
            0.5971642833948135,
            0.29858214169740677,
            0.14929107084870338,
            0.07464553542435169,
            0.037322767712175846,
            0.018661383856087923,
            0.009330691928043961,
            0.004665345964021981
        ],
        numZoomLevels: 24,
        projection: new OpenLayers.Projection('EPSG:900913'),
        displayProjection: new OpenLayers.Projection('EPSG:4326'),
        units: 'meters',
        format: 'text/json'
    };

    init = function() {
        var lon = -73.9529;
        var lat = 40.7723;
        var zoom = 10;
        var map, url, layers = [], center, highlight;

        map = new OpenLayers.Map('map', options);
        map.addControl(new OpenLayers.Control.LayerSwitcher());
        map.addControl(new OpenLayers.Control.NavToolbar());
        map.addControl(new OpenLayers.Control.PanZoom({
            position: new OpenLayers.Pixel(2, 10)
        }));
        map.addControl(new OpenLayers.Control.MousePosition());
        map.addControl(new OpenLayers.Control.LoadingPanel());
        map.addLayer(new OpenLayers.Layer.OSM());

        url = [
            '/wms.ashx',
            '?SERVICE=', options.wms,
            '&FORMAT=', options.format,
            '&CRS=', options.projection.getCode(),
            '&REQUEST=GETMAP&VERSION=1.3.0&STYLES=&WIDTH=0&HEIGHT=0'
        ].join('')

        layers.push(
            new OpenLayers.Layer.Vector(
                'POI', {
                    strategies: [new OpenLayers.Strategy.BBOX()],
                    protocol: new OpenLayers.Protocol.HTTP({
                        url: [url, '&LAYERS=poi'].join(''),
                        format: new OpenLayers.Format.GeoJSON()
                    }),
                    styleMap: OpenLayers.Resources.Styles.Layers.editable,
                    visibility: false
                }));
        layers.push(
            new OpenLayers.Layer.Vector(
                'Roads', {
                    strategies: [new OpenLayers.Strategy.BBOX()],
                    protocol: new OpenLayers.Protocol.HTTP({
                        url: [url, '&LAYERS=tiger_roads'].join(''),
                        format: new OpenLayers.Format.GeoJSON()
                    }),
                    styleMap: OpenLayers.Resources.Styles.Layers.editable,
                    visibility: false
                }));
        layers.push(
            new OpenLayers.Layer.Vector(
                'Landmarks', {
                    strategies: [new OpenLayers.Strategy.BBOX()],
                    protocol: new OpenLayers.Protocol.HTTP({
                        url: [url, '&LAYERS=poly_landmarks'].join(''),
                        format: new OpenLayers.Format.GeoJSON()
                    }),
                    styleMap: OpenLayers.Resources.Styles.Layers.editable,
                    visibility: false
                }));
        map.addLayers(layers.reverse());

        highlight = new OpenLayers.Control.SelectFeatureEx(layers, {
            hover: true,
            highlightOnly: true,
            renderIntent: 'temporary'
        });
        map.addControl(highlight);
        highlight.activate();

        center = new OpenLayers.LonLat(lon, lat);
        center.transform(options.displayProjection, options.projection);
        map.setCenter(center, zoom);
    };
    init();
});
