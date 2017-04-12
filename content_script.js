var readPageInfo = function() {

	//find cid, cid is like EmbedPlayer('player', "http://static.hdslb.com/play.swf", "cid=2340733&aid=1539719&pre_ad=0");
	var cidInfo = "";

	// console.log("content_script html is " + $("#bofqi script").html());
	console.log("content_script html is " + document.getElementById("bofqi").innerHTML);
	cidInfo = document.getElementById("bofqi").innerHTML;
	console.log("cid found");

	// $("[type='text/javascript']").each(function() {
	// 	console.log("content_script html is " + $(this).html());
	// 	if ($(this).html().indexOf('cid') > -1) {
	// 		cidInfo = $(this).html();
	// 		console.log("cid found");
	// 	}
	// });

	// var regexForCid = /cid=(.*?)\&aid/;
	var regexForCid = /cid=(.*?)&amp;aid/
	var cid = cidInfo.match(regexForCid)[1];
	console.log("content_script cid is " + cid);

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
}();

var addListener = function () {
	console.log("requestToUpdate listener added");
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.type == "requestToUpdate") {
				console.log("requestToUpdate received");
				readPageInfo();
			}
		});
}();

document.addEventListener('DOMContentLoaded', addListener);
document.addEventListener('load', addListener);
document.addEventListener('load', readPageInfo);

// $(document).ready(readPageInfo());

console.log("content_script running");
