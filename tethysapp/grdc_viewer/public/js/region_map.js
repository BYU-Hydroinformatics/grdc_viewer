let $loading = $('#view-file-loading');
let continent=$("#select_continent").find('option:selected').val();
let country=$("#select_country").find('option:selected').val();

let shape_continent;
let shape_country;
let stations;
let africa_rivers;
let north_america_rivers;
let south_america_rivers;
let cuba_rivers;
let dominican_republic_rivers;
let north_asia_rivers;
let south_asia_rivers;
let west_asia_rivers;
let europe_rivers;
let east_europe_rivers;
let south_iran_rivers;
let australasia_rivers;
let feature_layer
let current_layer;

function list_country () {
	map.removeLayer(shape_continent);
	map.removeLayer(shape_country);
	map.removeLayer(stations);
	map.removeLayer(africa_rivers);
	map.removeLayer(north_america_rivers);
	map.removeLayer(south_america_rivers);
	map.removeLayer(cuba_rivers);
	map.removeLayer(dominican_republic_rivers);
	map.removeLayer(north_asia_rivers);
	map.removeLayer(south_asia_rivers);
	map.removeLayer(west_asia_rivers);
	map.removeLayer(europe_rivers);
	map.removeLayer(east_europe_rivers);
	map.removeLayer(south_iran_rivers);
	map.removeLayer(australasia_rivers);

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
			.split('GRDC_Viewer:' + continent + '_Countries')[1]
			.split('LatLongBoundingBox ')[1]
			.split('/></FeatureType>')[0];

			let minx = Number(x.split('"')[1]);
			let miny = Number(x.split('"')[3]);
			let maxx = Number(x.split('"')[5]);
			let maxy = Number(x.split('"')[7]);

			if (continent == 'Africa') {
				minx = minx + 10;
				miny = miny + 13;
				maxx = maxx - 10;
				maxy = maxy - 5;
			} else if (continent == 'America') {
				minx = minx + 10;
				miny = miny + 10;
				maxx = maxx - 186;
				maxy = maxy- 10;
			} else if (continent == 'Asia') {
				minx = minx + 200;
				miny = miny + 13;
				maxx = maxx;
				maxy = maxy - 13;
			} else if (continent == 'Europe') {
				minx = minx + 165;
				miny = miny + 25;
				maxx = maxx - 100;
				maxy = maxy - 25;
			}

			let extent = ol.proj.transform([minx, miny], 'EPSG:4326', 'EPSG:3857').concat(ol.proj.transform([maxx, maxy], 'EPSG:4326', 'EPSG:3857'));
			//let extent = ol.proj.transform([minx, miny], 'EPSG:4326', 'EPSG:4326').concat(ol.proj.transform([maxx, maxy], 'EPSG:4326', 'EPSG:4326'));

			map.getView().fit(extent, map.getSize());

		}
	});

	if (continent == 'Africa') {
		africa_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'africa-continental-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		map.addLayer(africa_rivers);
	} else if (continent == 'America') {
		north_america_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'north_america-continental-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		south_america_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'south_america-continental-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		cuba_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-41f7a9cd-1286-5faf-8aab-da7e503aa5fd/wms',
				params: { 'LAYERS': 'cuba-national_drainage-line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		dominican_republic_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-d6e47e2a-54eb-533e-89e7-a783e083f974/wms',
				params: { 'LAYERS': 'dominican_republic-national-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		map.addLayer(north_america_rivers);
		map.addLayer(south_america_rivers);
		map.addLayer(cuba_rivers);
		map.addLayer(dominican_republic_rivers);
	} else if (continent == 'Asia') {
		north_asia_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'asia-north_asia-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		south_asia_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'south_asia-mainland-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		west_asia_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'west_asia-continental-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		east_europe_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'east_europe-continental-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		south_iran_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'south_iran-continental-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		australasia_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'australasia-continental-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		map.addLayer(north_asia_rivers);
		map.addLayer(south_asia_rivers);
		map.addLayer(west_asia_rivers);
		map.addLayer(east_europe_rivers);
		map.addLayer(south_iran_rivers);
		map.addLayer(australasia_rivers);
	} else if (continent == 'Europe') {
		europe_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'europe-continental-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		east_europe_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'east_europe-continental-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		map.addLayer(europe_rivers);
		map.addLayer(east_europe_rivers);
	} else if (continent == 'Oceania') {
		australasia_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'australasia-continental-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		map.addLayer(australasia_rivers);
	}

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
	map.removeLayer(africa_rivers);
	map.removeLayer(north_america_rivers);
	map.removeLayer(south_america_rivers);
	map.removeLayer(cuba_rivers);
	map.removeLayer(dominican_republic_rivers);
	map.removeLayer(north_asia_rivers);
	map.removeLayer(south_asia_rivers);
	map.removeLayer(west_asia_rivers);
	map.removeLayer(europe_rivers);
	map.removeLayer(east_europe_rivers);
	map.removeLayer(south_iran_rivers);
	map.removeLayer(australasia_rivers);

	continent=$("#select_continent").find('option:selected').val();
	country=$("#select_country").find('option:selected').val();

	//console.log(continent);
	//console.log(country);

	if (country == 'Moldova'|| country == 'Benin' || country == 'Ivory_Coast') {
		shape_country = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'http://tethys-staging.byu.edu:8181/geoserver/GRDC_Viewer_' + continent + '/wms',
				params: { 'LAYERS': country },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			}),
			opacity: 0.3
		});
	} else {
		shape_country = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/GRDC_Viewer_' + continent + '/wms',
				params: { 'LAYERS': country },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			}),
			opacity: 0.3
		});
	}

	//let ajax_url = 'https://tethys.byu.edu/geoserver/GRDC_Viewer_' + continent + '/wms?service=WMS&version=1.1.0&request=GetCapabilities&layers=GRDC_Viewer_' + continent + ':'+ country;
	let ajax_url;

	if (country == 'Moldova' || country == 'Benin' || country == 'Ivory_Coast') {
		ajax_url = 'http://tethys-staging.byu.edu:8181/geoserver/GRDC_Viewer_' + continent + '/wfs?request=GetCapabilities';
	} else {
		ajax_url = 'https://tethys.byu.edu/geoserver/GRDC_Viewer_' + continent + '/wfs?request=GetCapabilities';
	}


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

			if (country == 'United_States') {
				minx = minx + 10;
				miny = miny + 13;
				maxx = maxx - 186;
				maxy = maxy - 10;
			} else if (country == 'Russia') {
				minx = minx + 200;
				miny = miny + 10;
				maxx = maxx - 10;
				maxy = maxy- 10;
			}

			let extent = ol.proj.transform([minx, miny], 'EPSG:4326', 'EPSG:3857').concat(ol.proj.transform([maxx, maxy], 'EPSG:4326', 'EPSG:3857'));
			//let extent = ol.proj.transform([minx, miny], 'EPSG:4326', 'EPSG:4326').concat(ol.proj.transform([maxx, maxy], 'EPSG:4326', 'EPSG:4326'));

			map.getView().fit(extent, map.getSize());

		}
	});

	if (continent == 'Africa') {
		africa_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'africa-continental-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		map.addLayer(africa_rivers);
	} else if (continent == 'America') {
		north_america_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'north_america-continental-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		south_america_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'south_america-continental-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		cuba_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-41f7a9cd-1286-5faf-8aab-da7e503aa5fd/wms',
				params: { 'LAYERS': 'cuba-national_drainage-line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		dominican_republic_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-d6e47e2a-54eb-533e-89e7-a783e083f974/wms',
				params: { 'LAYERS': 'dominican_republic-national-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		map.addLayer(north_america_rivers);
		map.addLayer(south_america_rivers);
		map.addLayer(cuba_rivers);
		map.addLayer(dominican_republic_rivers);
	} else if (continent == 'Asia') {
		north_asia_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'asia-north_asia-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		south_asia_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'south_asia-mainland-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		west_asia_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'west_asia-continental-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		east_europe_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'east_europe-continental-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		south_iran_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'south_iran-continental-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		australasia_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'australasia-continental-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		map.addLayer(north_asia_rivers);
		map.addLayer(south_asia_rivers);
		map.addLayer(west_asia_rivers);
		map.addLayer(east_europe_rivers);
		map.addLayer(south_iran_rivers);
		map.addLayer(australasia_rivers);
	} else if (continent == 'Europe') {
		europe_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'europe-continental-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		east_europe_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'east_europe-continental-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		map.addLayer(europe_rivers);
		map.addLayer(east_europe_rivers);
	} else if (continent == 'Oceania') {
		australasia_rivers = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/spt-global/wms',
				params: { 'LAYERS': 'australasia-continental-drainage_line' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
		map.addLayer(australasia_rivers);
	}

	map.addLayer(shape_country);

	if (country == 'Moldova' || country == 'Benin' || country == 'Ivory_Coast') {
		stations = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'http://tethys-staging.byu.edu:8181/geoserver/GRDC_Viewer_' + continent + '/wms',
				params: { 'LAYERS': country + '_Stations' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
	} else {
		stations = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: 'https://tethys.byu.edu/geoserver/GRDC_Viewer_' + continent + '/wms',
				params: { 'LAYERS': country + '_Stations' },
				serverType: 'geoserver',
				crossOrigin: 'Anonymous'
			})
		});
	}

	map.addLayer(stations);

	feature_layer = stations;

	shape_country.once('render', function() {
		view.fitExtent(shape_country.getSource().getExtent(), map.getSize());
	});
}


let base_layer = new ol.layer.Tile({
	source: new ol.source.BingMaps({
		key: 'eLVu8tDRPeQqmBlKAjcw~82nOqZJe2EpKmqd-kQrSmg~AocUZ43djJ-hMBHQdYDyMbT-Enfsk0mtUIGws1WeDuOvjY4EXCH-9OK3edNLDgkc',
		imagerySet: 'Road'
	})
});

let map = new ol.Map({
	target: 'showMapView',
	layers: [base_layer],
	view: new ol.View({
		center: ol.proj.fromLonLat([10, 40]),
		zoom: 1.9
	})
});

function get_dailyData (stationcode, stationname, countryname, stream) {

	$('#dailyData-loading').removeClass('hidden');
	$.ajax({
        url: '/apps/grdc-viewer/get-dailyData/',
        type: 'GET',
        data: {'stationcode' : stationcode, 'stationname': stationname, 'countryname': countryname, 'stream': stream},
        error: function () {
            $('#info').html('<p class="alert alert-danger" style="text-align: center"><strong>An unknown error occurred while retrieving the data</strong></p>');
            $('#info').removeClass('hidden');

            setTimeout(function () {
                $('#info').addClass('hidden')
            }, 5000);
        },
        success: function (data) {
            if (!data.error) {
                $('#dailyData-loading').addClass('hidden');
                $('#dates').removeClass('hidden');
//                $('#obsdates').removeClass('hidden');
                $loading.addClass('hidden');
                $('#dailyData-chart').removeClass('hidden');
                $('#dailyData-chart').html(data);

                //resize main graph
                Plotly.Plots.resize($("#dailyData-chart .js-plotly-plot")[0]);

                let params = {
                    stationcode: stationcode,
                    stationname: stationname,
                    countryname: countryname,
                    stream: stream,
                };

                $('#submit-download-dailyData').attr({
                    target: '_blank',
                    href: '/apps/grdc-viewer/download-dailyData?' + jQuery.param(params)
                });

                 $('#download-dailyData').removeClass('hidden');

            } else if (data.error) {
            	$('#info').html('<p class="alert alert-danger" style="text-align: center"><strong>An unknown error occurred while retrieving the Data</strong></p>');
            	$('#info').removeClass('hidden');

            	setTimeout(function() {
            		$('#info').addClass('hidden')
                }, 5000);

            } else {
            	$('#info').html('<p><strong>An unexplainable error occurred.</strong></p>').removeClass('hidden');
            }
        }
    });
}

function get_monthlyData (stationcode, stationname, countryname, stream) {

	$('#monthlyData-loading').removeClass('hidden');
	$.ajax({
        url: '/apps/grdc-viewer/get-monthlyData/',
        type: 'GET',
        data: {'stationcode' : stationcode, 'stationname': stationname, 'countryname': countryname, 'stream': stream},
        error: function () {
            $('#info').html('<p class="alert alert-danger" style="text-align: center"><strong>An unknown error occurred while retrieving the data</strong></p>');
            $('#info').removeClass('hidden');

            setTimeout(function () {
                $('#info').addClass('hidden')
            }, 5000);
        },
        success: function (data) {
            if (!data.error) {
                $('#monthlyData-loading').addClass('hidden');
                $('#dates').removeClass('hidden');
//                $('#obsdates').removeClass('hidden');
                $loading.addClass('hidden');
                $('#monthlyData-chart').removeClass('hidden');
                $('#monthlyData-chart').html(data);

                //resize main graph
                Plotly.Plots.resize($("#monthlyData-chart .js-plotly-plot")[0]);

                let params = {
                    stationcode: stationcode,
                    stationname: stationname,
                    countryname: countryname,
                    stream: stream,
                };

                $('#submit-download-monthlyData').attr({
                    target: '_blank',
                    href: '/apps/grdc-viewer/download-monthlyData?' + jQuery.param(params)
                });

                 $('#download-monthlyData').removeClass('hidden');

            } else if (data.error) {
            	$('#info').html('<p class="alert alert-danger" style="text-align: center"><strong>An unknown error occurred while retrieving the Data</strong></p>');
            	$('#info').removeClass('hidden');

            	setTimeout(function() {
            		$('#info').addClass('hidden')
                }, 5000);

            } else {
            	$('#info').html('<p><strong>An unexplainable error occurred.</strong></p>').removeClass('hidden');
            }
        }
    });
}

map.on('pointermove', function(evt) {
	if (evt.dragging) {
		return;
	}
	let pixel = map.getEventPixel(evt.originalEvent);
	let hit = map.forEachLayerAtPixel(pixel, function(layer) {
		if (layer == feature_layer) {
			current_layer = layer;
			return true;
		}
	});
	map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

map.on("singleclick", function(evt) {

	if (map.getTargetElement().style.cursor == "pointer") {

		let view = map.getView();
		let viewResolution = view.getResolution();
		let wms_url = current_layer.getSource().getGetFeatureInfoUrl(evt.coordinate, viewResolution, view.getProjection(), { 'INFO_FORMAT': 'application/json' });

		if (wms_url) {

			$("#obsgraph").modal('show');
			$('#dailyData-chart').addClass('hidden');
			$('#monthlyData-chart').addClass('hidden');
			$('#dailyData-loading').removeClass('hidden');
			$('#monthlyData-loading').removeClass('hidden');
			$("#station-info").empty()
			//$('#download_dailyData').addClass('hidden');
			//$('#download_monthlyData').addClass('hidden');

			$.ajax({
				type: "GET",
				url: wms_url,
				dataType: 'json',
				success: function (result) {
					stationcode = result["features"][0]["properties"]["grdc_no"];
					stationname = result["features"][0]["properties"]["station"];
					countryname = result["features"][0]["properties"]["Country"];
					stationlongitude = result["features"][0]["properties"]["long"];
					stationlatitude = result["features"][0]["properties"]["lat"];
					stream = result["features"][0]["properties"]["river"];
					$("#station-info").append('<h3 id="Station-Name-Tab">Current Station: '+ stationname
						+ '</h3><h5 id="Station-Code-Tab">GRDC Station Code: '
						+ stationcode + '</h3><h5 id="Country-Tab">Country: '
						+ countryname + '</h3><h5 id="Latitude">Latitude: '
						+ stationlatitude + '</h3><h5 id="Latitude">Longitude: '
						+ stationlongitude+ '</h5><h5>Stream: '+ stream);
					get_dailyData (stationcode, stationname, countryname, stream)
					get_monthlyData (stationcode, stationname, countryname, stream)
				}
			});
		}
	};
});

function resize_graphs() {
    $("#dailyData_tab_link").click(function() {
        Plotly.Plots.resize($("#dailyData-chart .js-plotly-plot")[0]);
    });
    $("#monthlyData_tab_link").click(function() {
        Plotly.Plots.resize($("#monthlyData-chart .js-plotly-plot")[0]);
    });
};


