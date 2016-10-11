function readPageInfo() {

	//find cid, cid is like EmbedPlayer('player', "http://static.hdslb.com/play.swf", "cid=2340733&aid=1539719&pre_ad=0");
	var cidInfo = $("param[name='flashvars']").attr("value");
	var regexForCid = /cid=(.*?)\&aid/;
	var cid = cidInfo.match(regexForCid)[1];

	//find title of the video
	var title = $("[property='media:title']").attr('content');
	
	//select duration from <meta itemprop="duration" content="T1M36S" />
	var duration = $("[itemprop='duration']").attr('content');

	chrome.runtime.sendMessage(
		{
			type: "danmuData",
			cid: cid,
			title: title,
			duration: duration
		},
		function(response) {
		console.log("response received");
	});

	console.log("send");
	console.log("readPageInfo");
}

readPageInfo();

console.log("content_script running");
