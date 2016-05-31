function getDomainFromUrl(url){
	var host = "null";
	if(typeof url == "undefined" || url == null)
		url = window.location.href;
	var regex = /.*\:\/\/([^\/]*).*/;
	var match = url.match(regex);
	if(typeof match != "undefined" && match != null)
		host = match[1];
	return host;
}

function checkForValidUrl(tabId, changeInfo, tab) {
	console.log("checkForValidUrl");
	if(getDomainFromUrl(tab.url).toLowerCase() == "www.bilibili.com"){
		chrome.pageAction.show(tabId);
		console.log("show");
	}
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

var danmuData = {};
danmuData.error = "Loading...";
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
		console.log("received");
		if (request.type !== "BiliBH-information") {
			return;
		}
		if (request.content == "danmuData") {
			danmuData = request;
			updatePop();
		}
		sendResponse({});
});
