function savePageInfo() {
	var cidInfo = $("div.player-wrapper").find("script").first().text();
	// cidInfo is like EmbedPlayer('player', "http://static.hdslb.com/play.swf", "cid=2340733&aid=1539719&pre_ad=0");
	if(cidInfo == null){
		chrome.runtime.sendMessage({type:"BiliBH-information", error:"获取cid失败."});
	}
	console.log(cidInfo);

	var regexForCid = /cid=(.*?)\&aid/;
	var cid = cidInfo.match(regexForCid);
	console.log(cid[1]);

	var barrageXMLAdd = "http://comment.bilibili.com/" + cid[1] + ".xml";
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
	var titleInfo = $("[property='media:title']").attr('content');

	//select duration from <meta itemprop="duration" content="T1M36S" />
	var durationInfo = $("[itemprop='duration']").attr('content');
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

	var msg = {
		type: "BiliBH-information",
		content: "danmuData",
		title: titleInfo,
		blockNum: blockNum,
		blockLength: blockLength,
		blockArray: blockArray,
	};

	$.data(document.body, "danmuInfo", msg);

	chrome.runtime.sendMessage(msg, function(response) {
	      console.log("response received");
	});
	console.log("send");
}

savePageInfo();

function readPageInfo() {
	msg = $.data(document.body, "danmuInfo");
	chrome.runtime.sendMessage(msg, function(response) {
				console.log("response received");
	});
	console.log("send");
	console.log("readPageInfo");
}

chrome.tabs.onActivated.addListener(savePageInfo);
chrome.tabs.onUpdated.addListener(savePageInfo);
chrome.tabs.onCreated.addListener(savePageInfo);
chrome.tabs.onActiveChanged.addListener(savePageInfo);
