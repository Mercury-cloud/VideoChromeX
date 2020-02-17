chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.windows.create({
		url: chrome.runtime.getURL("index.html"),
		type: "popup"
	});
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
		// console.log("hello", request.greeting.data, request.greeting.name);
		if(request.greeting.name){
			chrome.downloads.download({
					url:      request.greeting.data,
					filename: 'videorecordmylife/' + request.greeting.name
			}, function(e){
				sendResponse({greeting: e});
			});
		} 
		else if(request.greeting == 'getvideos'){
			console.log('here to get videos');
			let pathOfDirectory = null;
			chrome.downloads.search({filenameRegex: '^.*\.(webm|png|mp4)$'}, function(data){
				for (var i = 0; i < data.length; i++) {
					if(data[i].filename.indexOf('videorecordmylife') != -1 && data[i].exists){
						// console.log("indexOf---", data[i].filename.split('videorecordmylife')[0]);
						pathOfDirectory = data[i].filename.split('downloads')[0];
						break;
					} 
				}
				console.log("result-------", pathOfDirectory);
				// var xhr = new XMLHttpRequest();
				// xhr.onreadystatechange = handleVideoResults; // Implemented elsewhere.
				// xhr.open("GET", chrome.runtime.getURL('525d3ec9-249a-401c-862c-9b0fd5e2639c'), true);
				// xhr.send();
				sendResponse({greeting: pathOfDirectory});
			})
		}
		return true;
  });


function handleVideoResults(e) {
	console.log('blob', e);
}

// chrome.storage.sync.clear(function(obj){
// 	console.log("cleared");
// });