function getDomainFromUrl(url){
	var host = "null";
	if(typeof url == "undefined" || url == null)
		url = window.location.href;
	// var regex = /.*\:\/\/([^\/]*).*/;
	var regex = "bilibili.com";
	var match = url.match(regex);
	if(typeof match != "undefined" && match != null)
		host = match[0];
	return host;
}

function checkForValidUrl(tabId, changeInfo, tab) {
	console.log("checkForValidUrl");
	if(getDomainFromUrl(tab.url).toLowerCase() != "null"){
		chrome.pageAction.show(tabId);
		console.log("show");
	}
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

var danmuData = {};

function loadXMLDoc (dname) {
	var xmlDoc;

	try {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('GET', dname, false);
		//xmlhttp.setRequestHeader('Content-Type', 'text/xml');
		xmlhttp.send('');
		xmlDoc = xmlhttp.responseXML;
	} catch (e) {
		try {
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		} catch (e) {
			console.error(e.message);
		}
	}
	return xmlDoc;
}

function savePageInfo(pageInfo) {

	var cid = pageInfo.cid;

	var barrageXMLAdd = "http://comment.bilibili.com/" + cid + ".xml";
	console.log(barrageXMLAdd);

	var barrageXMLDoc = loadXMLDoc(barrageXMLAdd);
	if (barrageXMLDoc == null) {
		chrome.runtime.sendMessage({type:"BiliBH-information", error:"获取弹幕xml失败."});
	}
	var barrageTxtSet = barrageXMLDoc.getElementsByTagName("d");
	var regexForTime = /^(.*?),/;
	for (i = 0; i < barrageTxtSet.length; i++) {
		var time = parseInt(barrageTxtSet[i].getAttribute("p").match(regexForTime)[1]);
		//console.log(time);
	}

	//find title of the video
	var title = pageInfo.title;

	//select duration from <meta itemprop="duration" content="T1M36S" />
	var durationInfo = pageInfo.duration;
	var min = parseInt(durationInfo.match(/T(.*?)M/)[1]);
	var sec = parseInt(durationInfo.match(/M(.*?)S/)[1]);
	var duration = 0;
	if (min != null) {
		duration += min * 60;
	}
	duration += sec;
	//console.log(duration);

	var blockNum = 100;
	var blockLength = duration / blockNum;
	var blockArray = new Array(blockNum);
	for (i = 0; i < blockArray.length; i++) {
		blockArray[i] = 0;
	}
	for (i = 0; i < barrageTxtSet.length; i++) {
		var time = parseInt(barrageTxtSet[i].getAttribute("p").match(regexForTime)[1]);
		if (time <= duration) {
			blockArray[parseInt(time / blockLength)]++;
		}
	}
	for (i = 0; i < blockArray.length; i++) {
		//console.log(blockArray[i]);
	}

	var danmu = {
		title: title,
		blockNum: blockNum,
		blockLength: blockLength,
		blockArray: blockArray
	};

	danmuData[cid] = danmu;
	danmuData["currentCID"] = cid;
	console.log(danmuData);
	console.log("danmuData updated");

	console.log(chrome.tabs);
} //savePageInfo


chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.type == "danmuData") {
			savePageInfo(request);	
		}
	});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.type == "cidChange") {
			danmuData["currentCID"] = request.cid;
		}
	});

chrome.tabs.onActivated.addListener(function(tabId, windowId) {
	console.log(tabId);
	chrome.tabs.executeScript( tabId["tabId"], {file: 'content_script.js'} );
	console.log("onActivated");
});

console.log("background running");
