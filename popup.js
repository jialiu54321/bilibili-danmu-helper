var text = zh;

$('#videoTitle a').text(text.loading);

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
	updateText();
	updatePop();
});

var updateText = function () {
	$("#message").text(text.thankyou);
	$("#author").text(text.author);
	$("#version").text(text.versionInfo + "0.0.6");
	$('#videoTitle a').text(text.loading);

	console.log("language updated");
};

var requestToUpdate = function () {
	chrome.runtime.sendMessage(
		{
			type: "requestToUpdate",
		},
		function(response) {
			console.log("requestToUpdate send");
		});
};

var updatePop = function () {
	console.log("updatePop running");

	var cid = chrome.extension.getBackgroundPage().danmuData["currentCID"];

	console.log("cid is " + cid);
	if (cid === null) {
		return;
	}

	var xAxisData = [];
	var danmuSeriesData = [];

	var data = chrome.extension.getBackgroundPage().danmuData[cid];
	console.log(data);

	if (!data) {
		return;
	}

	for (i = 0; i < data.blockNum; i++) {
		var h = parseInt(i * data.blockLength / 3600);
		var m = parseInt((i * data.blockLength - 3600 * h) / 60);
		var s = parseInt(i * data.blockLength - 3600 * h - 60 * m);
		xAxisData.push(String(h) + ":" + String(m) + ":" + String(s));
	}
	for (i = 0; i < data.blockArray.length; i++) {
		danmuSeriesData.push(parseInt(data.blockArray[i]));
	}
	$("#videoTitle a").text(data.title);


	Highcharts.chart('graphContainer', {
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

	console.log("graph updated");
};

document.getElementById("refreshBtn").addEventListener("click", function() {
	console.log("refresh btn clicked");
	requestToUpdate();
	updatePop();
});

var addListener = function () {
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.type == "danmuData") {
				console.log("popup get msg, current cid is " + request.cid);
				cid = request.cid;
				updatePop();
			}
		});
};

document.addEventListener('DOMContentLoaded', addListener);
document.addEventListener('DOMContentLoaded', updateText);
document.addEventListener('DOMContentLoaded', updatePop);
document.addEventListener('load', addListener);
document.addEventListener('load', updateText);
document.addEventListener('load', updatePop);
$(document).ready(function() {
	addListener();
	updateText();
	updatePop();
});