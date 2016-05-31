var text = zh;

$("#videoTitle").text(text.loading);

$('#authorLink').click(function() {
	 chrome.tabs.create({url: $(this).attr('href')});
});

$('input[type=radio][name=language]').change(function() {
	if (this.value == "en"){
		text = en;
	}
	if (this.value == "zh"){
		text = zh;
	}
	updatePop();
});

var updatePop = function () {

	$("#message").text(text.thankyou);
	$("#author").text(text.author);
	$("#version").text(text.versionInfo);

	var xAxisData = [];
	var danmuSeriesData = [];

	var data = chrome.extension.getBackgroundPage().danmuData;
	if(data.error){
		$("#test").text(data.error);
	}else{
		for (i = 0; i < data.blockNum; i++) {
			var h = parseInt(i * data.blockLength / 3600);
			var m = parseInt((i * data.blockLength - 3600 * h) / 60);
			var s = parseInt(i * data.blockLength - 3600 * h - 60 * m);
			xAxisData.push(String(h) + ":" + String(m) + ":" + String(s));
		}
		for (i = 0; i < data.blockArray.length; i++) {
				danmuSeriesData.push(parseInt(data.blockArray[i]));
		}
		$("#videoTitle").text(data.title);
	}

	$('#graphContainer').highcharts({
			title: {
					text: text.graphTitle,
			},
			xAxis: {
					categories: xAxisData,
			},
			yAxis: {
					title: {
							text: "",
					},
			},
			series: [{
					name: text.danmuNum,
					data: danmuSeriesData,
					color: 'rgb(234, 67, 53)',
			},]
	});
};

document.addEventListener('DOMContentLoaded', updatePop);
