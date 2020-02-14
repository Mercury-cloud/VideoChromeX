chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.windows.create({
		url: chrome.runtime.getURL("index.html"),
		type: "popup"
	});
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
		console.log("hello", request.greeting.data, request.greeting.name);
		if(request.greeting.name){
			chrome.downloads.download({
					url:      request.greeting.data,
					filename: 'videorecordmylife/' + request.greeting.name
			}, function(e){
				chrome.runtime.sendMessage({greeting: e});
			});
		} else if(request.greeting == 'getvideos'){
			console.log('here to get videos');
			chrome.downloads.search({filenameRegex: '^.*\.(webm|png|mp4)$'}, function(data){
				console.log(data);
				// var xhr = new XMLHttpRequest();
				// xhr.onreadystatechange = handleVideoResults; // Implemented elsewhere.
				// xhr.open("GET", chrome.runtime.getURL('525d3ec9-249a-401c-862c-9b0fd5e2639c'), true);
				// xhr.send();
				chrome.runtime.sendMessage({greeting: {watchvideos: data}});
			})
		}
		return true;
  });


function handleVideoResults(e) {
	console.log('blob', e);
}

chrome.storage.sync.clear(function(obj){
	console.log("cleared");
	});