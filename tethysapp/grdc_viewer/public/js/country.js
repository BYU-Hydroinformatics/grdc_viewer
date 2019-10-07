//var continent=$("#select_continent").find('option:selected').val();
var continent= 'America';
var country=$("#select_country").find('option:selected').val();

console.log(continent)
console.log(country)

var base_layer = new ol.layer.Tile({
	source: new ol.source.BingMaps({
		key: 'eLVu8tDRPeQqmBlKAjcw~82nOqZJe2EpKmqd-kQrSmg~AocUZ43djJ-hMBHQdYDyMbT-Enfsk0mtUIGws1WeDuOvjY4EXCH-9OK3edNLDgkc',
		imagerySet: 'Road'
	})
});

var shape_country = new ol.layer.Image({
	source: new ol.source.ImageWMS({
		url: 'https://tethys.byu.edu/geoserver/GRDC_Viewer_' + continent + '/wms',
		params: { 'LAYERS': country },
		serverType: 'geoserver',
		crossOrigin: 'Anonymous'
	})
});

var stations = new ol.layer.Image({
	source: new ol.source.ImageWMS({
		url: 'https://tethys.byu.edu/geoserver/GRDC_Viewer_' + continent + '/wms',
		params: { 'LAYERS': country + '_Stations' },
		serverType: 'geoserver',
		crossOrigin: 'Anonymous'
	})
});

var map = new ol.Map({
	target: 'showMapView',
	layers: [base_layer, shape_country, stations],
	view: new ol.View({
		center: ol.proj.fromLonLat([-73.073215, 10.000000]),
		zoom: 2
	})
});

var extent = shape_country.getSource().getExtent();
map.getView().fit(extent, {size:map.getSize(), maxZoom:16})