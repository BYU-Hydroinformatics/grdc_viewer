
let continent=$("#select_continent").find('option:selected').val();
let country=$("#select_country").find('option:selected').val();

let shape_continent;
let shape_country;
let stations;

function list_country () {
	map.removeLayer(shape_continent);
	map.removeLayer(shape_country);
	map.removeLayer(stations);

	continent=$("#select_continent").find('option:selected').val();

	shape_continent = new ol.layer.Image({
		source: new ol.source.ImageWMS({
			url: 'https://tethys.byu.edu/geoserver/GRDC_Viewer/wms',
			params: { 'LAYERS': continent + '_Countries' },
			serverType: 'geoserver',
			crossOrigin: 'Anonymous'
		}),
		opacity: 0.3
	});

	//let ajax_url = 'https://tethys.byu.edu/geoserver/GRDC_Viewer/wms?service=WMS&version=1.1.0&request=GetCapabilities&layers=GRDC_Viewer:'+ continent + '_Countries';
	let ajax_url = 'https://tethys.byu.edu/geoserver/GRDC_Viewer/wfs?request=GetCapabilities';

	let capabilities = $.ajax(ajax_url, {
		type: 'GET',
		data: {
			service: 'WFS',
			version: '1.0.0',
			request: 'GetCapabilities',
			outputFormat: 'text/javascript'
		},
		success: function() {
			let x = capabilities.responseText
			.split('<FeatureTypeList>')[1]
			.split('GRDC_Viewer' + ':' + continent + '_Countries')[1]
			.split('LatLongBoundingBox ')[1]
			.split('/></FeatureType>')[0];

			let minx = Number(x.split('"')[1]);
			let miny = Number(x.split('"')[3]);
			let maxx = Number(x.split('"')[5]);
			let maxy = Number(x.split('"')[7]);
			let extent = ol.proj.transform([minx, miny], 'EPSG:4326', 'EPSG:3857').concat(ol.proj.transform([maxx, maxy], 'EPSG:4326', 'EPSG:3857'));
			//let extent = ol.proj.transform([minx, miny], 'EPSG:4326', 'EPSG:4326').concat(ol.proj.transform([maxx, maxy], 'EPSG:4326', 'EPSG:4326'));

			map.getView().fit(extent, map.getSize());

		}
	});

	map.addLayer(shape_continent);

	shape_continent.once('render', function() {
        view.fitExtent(shape_continent.getSource().getExtent(), map.getSize());
    });

	$.ajax({
                url: '/apps/grdc-viewer/get_continent/',
                type: 'GET',
                data: {'continent':continent},
                contentType: 'application/json',
                error: function (status) {

                }, success: function (response) {
                    countrylist=response.countrylist;
                    //console.log(countrylist)
                    $("#select_country").empty();
                    $("#select_country").append('<option value="'+9999+'">'+''+'</option>');
					for (i=0;i<countrylist.length;i++){
						name=countrylist[i][0];
						number=countrylist[i][1];
						$("#select_country").append('<option value="'+number+'">'+name+'</option>');
					}
					document.getElementById("select2-select_country-container").innerHTML=$("#select_country").find('option:selected').text();
                }
            });
}

function showCountry () {
	map.removeLayer(shape_continent);
	map.removeLayer(shape_country);
	map.removeLayer(stations);

	continent=$("#select_continent").find('option:selected').val();
	country=$("#select_country").find('option:selected').val();

	console.log(continent);
	console.log(country);

	shape_country = new ol.layer.Image({
		source: new ol.source.ImageWMS({
			url: 'https://tethys.byu.edu/geoserver/GRDC_Viewer_' + continent + '/wms',
			params: { 'LAYERS': country },
			serverType: 'geoserver',
			crossOrigin: 'Anonymous'
		}),
		opacity: 0.3
	});


	//let ajax_url = 'https://tethys.byu.edu/geoserver/GRDC_Viewer_' + continent + '/wms?service=WMS&version=1.1.0&request=GetCapabilities&layers=GRDC_Viewer_' + continent + ':'+ country;
	let ajax_url = 'https://tethys.byu.edu/geoserver/GRDC_Viewer_' + continent + '/wfs?request=GetCapabilities';

	let capabilities = $.ajax(ajax_url, {
		type: 'GET',
		data: {
			service: 'WFS',
			version: '1.0.0',
			request: 'GetCapabilities',
			outputFormat: 'text/javascript'
		},
		success: function() {
			let x = capabilities.responseText
			.split('<FeatureTypeList>')[1]
			.split('GRDC_Viewer_' + continent + ':' + country)[1]
			.split('LatLongBoundingBox ')[1]
			.split('/></FeatureType>')[0];

			let minx = Number(x.split('"')[1]);
			let miny = Number(x.split('"')[3]);
			let maxx = Number(x.split('"')[5]);
			let maxy = Number(x.split('"')[7]);
			let extent = ol.proj.transform([minx, miny], 'EPSG:4326', 'EPSG:3857').concat(ol.proj.transform([maxx, maxy], 'EPSG:4326', 'EPSG:3857'));
			//let extent = ol.proj.transform([minx, miny], 'EPSG:4326', 'EPSG:4326').concat(ol.proj.transform([maxx, maxy], 'EPSG:4326', 'EPSG:4326'));

			map.getView().fit(extent, map.getSize());

		}
	});

	map.addLayer(shape_country);

	stations = new ol.layer.Image({
		source: new ol.source.ImageWMS({
			url: 'https://tethys.byu.edu/geoserver/GRDC_Viewer_' + continent + '/wms',
			params: { 'LAYERS': country + '_Stations' },
			serverType: 'geoserver',
			crossOrigin: 'Anonymous'
		})
	});

	map.addLayer(stations);

	shape_country.once('render', function() {
		view.fitExtent(shape_country.getSource().getExtent(), map.getSize());
	});
}


var base_layer = new ol.layer.Tile({
	source: new ol.source.BingMaps({
		key: 'eLVu8tDRPeQqmBlKAjcw~82nOqZJe2EpKmqd-kQrSmg~AocUZ43djJ-hMBHQdYDyMbT-Enfsk0mtUIGws1WeDuOvjY4EXCH-9OK3edNLDgkc',
		imagerySet: 'Road'
	})
});

var map = new ol.Map({
	target: 'showMapView',
	layers: [base_layer],
	view: new ol.View({
		center: ol.proj.fromLonLat([10, 40]),
		zoom: 1.9
	})
});
