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
				sendResponse({greeting: e});
			});
		} 
		else if(request.greeting == 'getdirectoryPath'){
			console.log('here to get videos');
			let pathOfDirectory = null;
			chrome.downloads.search({filenameRegex: '^.*\.(webm|png|mp4)$'}, function(data){
				for (var i = 0; i < data.length; i++) {
					if(data[i].filename.indexOf('videorecordmylife') != -1 && data[i].exists){
						pathOfDirectory = data[i].filename.split('videorecordmylife')[0] + 'videorecordmylife/';
						console.log("indexOf---", data[i].filename.split('videorecordmylife')[0] + 'videorecordmylife/');
						break;
					} 
				}
				// console.log("result-------", pathOfDirectory);
				
				sendResponse({greeting: pathOfDirectory});
			})
		}
		return true;
  });


function handleVideoResults(e) {
	// console.log('blob', e);
}

chrome.storage.sync.clear(function(obj){
	console.log("cleared");
});