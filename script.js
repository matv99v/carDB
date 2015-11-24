(function(){
'use strict';

	var $minYearEl = $('#minYear'),
		$maxYearEl = $('#maxYear'),
		BASE_URL = 'http://www.carqueryapi.com/api/0.3/?callback=?',
		years = [],
		$makesSearchForm = $('#makesSearchForm'),
		$makesTable = $('#makesTable'),
		$makesList = $('#makesList'),
		$makesTable = $('#makesTable'),
		$modelsHolder = $('#modelsHolder'),
		$closeWindow = $('#closeWindow'),
		$closeCross = $('#closeCross'),
		$paranja = $('#paranja');



	getData("getYears").then(function (data){
		years = fillYears(data);
		addOptions($minYearEl, years);
		$minYearEl.removeAttr("disabled");
	});

	$minYearEl.on("change", function(e){
		var currentMinYear = $(this).val();

			if (currentMinYear) {

				resetOptions($maxYearEl, "Select max year");
				$maxYearEl.removeAttr("disabled");

				addOptions($maxYearEl, years.filter(function(year){
					return year >= currentMinYear;
				}));
			}

			else {
				resetOptions($maxYearEl, "Select max year");
				$maxYearEl.attr("disabled", "disabled");
			}
	});

	$makesSearchForm.on('submit', function(e){
		e.preventDefault();

		var formFields = $(this).serializeArray(),
			request = {};

		formFields.forEach(function(field){
			request[field.name] = field.value;
		});
		console.log('request:', request);

		getData( "getMakes", request ).then(function(data){
			var cars = [];

			cars = data.Makes.map(function(car){
				return  {
							make: car.make_display,
							country: car.make_country,
							id: car.make_id
						}
			});

			fillTable(cars);
			$makesTable[0].style.display = "block";

			var $getModelsByIdBtns = $('[data-make-id]');

			$getModelsByIdBtns.on('click', function(e){
				e.preventDefault();

				console.log($(this));

				var request = {
					make: $(this).data('make-id')
				};

				console.log(request);

				getData("getModels", request).then(function(data){
					showModels(data.Models);

					});
			});
		});
	});

	$closeCross.on("click", function(e){
		$closeWindow[0].style.display = "none";
		$paranja[0].style.display = "none";

	});

	$paranja.on('click', function(e){
		$closeWindow[0].style.display = "none";
		$paranja[0].style.display = "none";
		console.log('paranja!');
	});
	//pull jQuery object from server
	function getData(cmd, request) {
		request = request || {};
		request.cmd = cmd;
		return $.getJSON(BASE_URL, request);
	}

	//fills array from min to max
	function fillYears(data){
		var min = +data.Years.min_year,
			max = +data.Years.max_year,
			years = [];

		for(; max >= min; max--){
			years.push(max);
		}
		return years;
	}

	//append options to element
	function addOptions($el, years){
		years.forEach(function(year){
			var template = '<option value="' + year + '">' + year + '</option>';
			$el.append(template);
		});

	}

	//reset previous array
	function resetOptions($el, text){
		$el.empty()
		   .append( '<option value="">' + text + '</option>');
	}

	function fillTable(cars){
		$makesList.empty();

		cars.forEach(function(car, index){
			var template = 	'<tr>' +
								'<td class="va-middle text-left">' + (index + 1) + '</td>' +
								'<td class="va-middle">' + car.make + '</td>' +
								'<td class="va-middle">' + car.country + '</td>' +
								'<td class="va-middle text-right">' +
									'<a class="btn btn-info" role="button" data-make-id="'+ car.id  + '">Get models</a>' +
								'</td>' +
							'</tr>';
		$makesList.append(template);
		});

	}

	function showModels(cars){
		$modelsHolder.empty();

		var model = cars[0].model_make_id;
		model = model.charAt(0).toUpperCase() + model.substr(1);

		var template =  '<td class="text-center" ><h4>' + model + '</h4></td>';


		$modelsHolder.append(template);


		cars.forEach(function(car){
			// var template =  '<div>' +  car.model_name + '</div>';

			var searchForm = 'https://www.google.com.ua/#q=' + model  + '+' +  car.model_name;
			var searchLink = '<a href="' + searchForm + '" target="_blank" class="search"><i class="fa fa-external-link"></i></a>';

			var template =	'<tr>' +
								'<td>' + car.model_name + searchLink + '</td>'
								// '<td class="text-center">' + searchLink + '</td>' +
							'</tr>';

			$modelsHolder.append(template);

		});
		$closeWindow[0].style.display = "block";
		$paranja[0].style.display = "block";




	}
})($);
