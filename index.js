var downloadTime = [];

var options = {
	controls: true,
	width: 600,
	height: 339,
	controlBar: {
			volumePanel: false
	},
	plugins: {
			record: {
					audio: true,
					//controls: true,
					video: {
						// video constraints: set resolution of camera
						mandatory: {
								minWidth: 1280, 
								minHeight: 720,
						},
						
					},
					// dimensions of captured video frames
					frameWidth: 1280,
					frameHeight: 720,
					maxLength: 7200,
					videoMimeType:"video/webm;codecs=H264",
					debug: true
			}
	}
};

var hidden = true;
document.getElementById('call').addEventListener('click', function() {
	if(hidden) {
		document.getElementById('myVideoSmall').className = 'video-js vjs-default-skin';
		hidden = false;
	} else {
		document.getElementById('myVideoSmall').className = 'hiddenVideo';
		hidden = true;
	}
})

var optionsSmall = {
	controls: true,
	width: 176,
	height: 100,
	controlBar: {
			volumePanel: false
	},
	plugins: {
			record: {
					audio: true,
					//controls: true,
					video: {
						// video constraints: set resolution of camera
						mandatory: {
								minWidth: 1280, 
								minHeight: 720,
						},
						
					},
					// dimensions of captured video frames
					frameWidth: 1280,
					frameHeight: 720,
					maxLength: 7200,
					videoMimeType:"video/webm;codecs=H264",
					debug: true
			}
	}
};

var watchoptions = {
	controls: true,
	width: 600,
	height: 339,
	controlBar: {
			volumePanel: false
	}
};


var optionsCamera = {
	controls: true,
	width: 1280,
	height: 720,
	controlBar: {
			volumePanel: false,
			fullscreenToggle: false
	},
	plugins: {
			record: {
					image: true,
					debug: true
			}
	}
};

var picture = videojs("myPicture", optionsCamera, function(){
	$('.vjs-record')[2].click();
	console.log("initilized picture taker");
});



var dPath = '';

var player = videojs("myVideo", options, function(){
	// print version information at startup
	var msg = 'Using video.js ' + videojs.VERSION +
			' with videojs-record ' + videojs.getPluginVersion('record') +
			' and recordrtc ' + RecordRTC.version;
	videojs.log(msg);
	$('.vjs-record').click();
});

var player = videojs("myVideoSmall", optionsSmall, function(){
	// print version information at startup
	var msg = 'Using video.js ' + videojs.VERSION +
			' with videojs-record ' + videojs.getPluginVersion('record') +
			' and recordrtc ' + RecordRTC.version;
	videojs.log(msg);
	//$('.vjs-record').click();
});

var wplayer = videojs("myWatchVideo", watchoptions, () => {
	// print version information at startup
	// var msg = 'Using video.js ' + videojs.VERSION +
	// 		' with videojs-record ' + videojs.getPluginVersion('record') +
	// 		' and recordrtc ' + RecordRTC.version;
	//videojs.log(msg);
	//$('.vjs-record').click();


	// var xhr = new XMLHttpRequest();
	// xhr.responseType = "blob";
	// xhr.onload = function () {
	// 	//var json = JSON.parse(xhr.responseText);
	// 	//console.log(json);
	// 	var a = URL.createObjectURL(xhr.response);

	// 	wplayer.src({type:"video/webm", src: a});
	// }
	// xhr.open("GET", 'file:///Users/tz7hll/Downloads/videorecordmylife/seth-my-birth-a-major-news-event-from-my-birth-year-mark-answered-1%20(1).webm');
	// xhr.send();



	//var a = URL.createObjectURL('blob:chrome-extension://fglmchfpfmcbeaiopebfblfgpcogbojb/525d3ec9-249a-401c-862c-9b0fd5e2639c');
	//console.log('blob', a);
	//wplayer.src({type:"video/webm", src: URL.createObjectURL('blob:chrome-extension://fglmchfpfmcbeaiopebfblfgpcogbojb/525d3ec9-249a-401c-862c-9b0fd5e2639c')});
});


$('#recordtab').click(() => {
	document.getElementById('watch').classList = 'hidden';
	document.getElementById('record').classList = 'content';
	document.getElementById('recordtab').classList = 'active';
	document.getElementById('watchtab').classList = '';

});

$('#watchtab').click(() => {
	// document.getElementById('record').classList = 'hidden';
	// document.getElementById('watch').classList = 'content';
	// document.getElementById('watchtab').classList = 'active';
	// document.getElementById('recordtab').classList = '';

	
	$('.counter').click();
	// chrome.runtime.sendMessage({greeting: 'getvideos'}, function(response) {
	// 	console.log("getvidoes response------", response);
	// 	//Setup for next recording
	// 	$('.vjs-record').click();
	// });
});

$('#play').click(() => {
	if(player.record().isRecording()) {
		player.record().resume();
	} else {
		player.record().start();
	}
	$("#eighthundred").attr('class', 'eighthundred');
	$('#play').attr('class', 'hidden');
	$('#stop').attr('class', '');
	$('#pause').attr('class', '');
});

$('#stop').click(() => {
	player.record().stop();
	$("#eighthundred").attr('class', 'hidden');
	$('#play').attr('class', '');
	$('#stop').attr('class', 'hidden');
	$('#pause').attr('class', 'hidden');
});

$('#pause').click(() => {
	player.record().pause();
	$("#eighthundred").attr('class', 'hidden');
	$('#play').attr('class', '');
	$('#stop').attr('class', '');
	$('#pause').attr('class', 'hidden');
});

// error handling
player.on('deviceError', function() {
	// console.warn('device error:', player.deviceErrorCode);
});

// user clicked the record button and started recording
player.on('startRecord', function() {
	//console.log('started recording!');
});



// chrome.runtime.onMessage.addListener(
// //   function(request, sender, sendResponse) {
// // 	chrome.storage.sync.get(['downloadedVideo'], function(result) {
// // 		downloads = result.downloadedVideo;
// // 		console.log('downloads', result);
// // 		console.log('downloads-----', request);
// // 		if(!downloads) {
// // 			chrome.storage.sync.set({"downloadedVideo": []}, function() {
// // 				//console.log('Value is set to ', items);
// // 			});
// // 			chrome.storage.sync.set({"downloadedVideosTime": []}, function() {
// // 				//console.log('Value is set to ', items);
// // 			});
// // 		}
// // 	})
// // 	console.log("From background", request.greeting);
// // 	var watchList = document.getElementById('questionSectionWatch');
	
// // 	watchList.innerHTML = '';

// // 	if(request.greeting.watchvideos) {

// // 		for(var i = 0; i < request.greeting.watchvideos.length; i++) {
// // 			if(request.greeting.watchvideos[i].filename.indexOf('Downloads') != -1){
// // 				dPath = request.greeting.watchvideos[i].filename.split('Downloads')[0];
// // 			}
// // 		}
// // 		console.log('dpath', dPath);
// // 		//console.log('here in results from watfch');
// // 		var usersArray = [];
// // 		var usersObj = {};
// // 		var userdropdown = [];
// // 		//console.log('length', request.greeting.watchvideos);
// // 		for(var i =0; i < downloads.length; i++){
// // 			//console.log(i);
// // 			// if(request.greeting.watchvideos[i].filename.indexOf('videorecordmylife') != -1 && request.greeting.watchvideos[i].exists) {
// // 				//console.log(request.greeting.watchvideos[i].filename);
// // 				//var parts = request.greeting.watchvideos[i].filename.split("/");
// // 				//var result = parts[parts.length - 1];
// // 				var result = downloads[i];
// // 				// console.log("result-", result);
// // 				// var endpart = result.split('.');
// // 				// var goodpart = endpart[0];
// // 				//console.log(request.greeting.watchvideos[i].filename, parts, result);
// // 				var splitName = result.split('_');
// // 				if(splitName.length > 1) {
// // 					for(var j = 0; j < splitName.length; j++){
// // 						splitName[j] = splitName[j].replace(/\W/g, ' ');
// // 						// splitName[j] = titleCase(splitName[j]);
// // 					}

// // 					//Users in dropdown
// // 					console.log('splitName', splitName);
// // 					if(!usersObj[splitName[0]]){
// // 						usersObj[splitName[0]] = {};
// // 						usersArray.push(splitName[0]);
// // 						userdropdown.push({name: splitName[0], value: splitName[0], text: splitName[0]});
// // 					// 	var name = document.createElement('div');
// // 					// 	var textnode = document.createTextNode(splitName[0]);
// // 					// 	name.setAttribute("id", splitName[0]);
// // 					// 	name.setAttribute("value", splitName[0]);
// // 					// 	name.appendChild(textnode); 
// // 					// 	document.getElementById('questionSectionWatch').appendChild(name);
// // 					}

// // 					// var idn = splitName[0].replace(/\s+/g, '-') + splitName[1].replace(/\s+/g, '-');
// // 					// if(idn[idn.length] == '-') {
// // 					// 	idn = idn.splice(-1,1);
// // 					// }
// // 					// console.log("idn------------", idn);

// // 					// //Header section nested in section element
// // 					// if(!usersObj[splitName[0]][splitName[1]]){
// // 					// 	usersObj[splitName[0]][splitName[1]] = {};
// // 					// 	//console.log(splitName[1]);
// // 					// 	var header = document.createElement('section');
// // 					// 	var addDiv = document.createElement('div');
// // 					// 	var textnode = document.createTextNode(splitName[1]);         // Create a text node
// // 					// 	header.appendChild(addDiv);
// // 					// 	addDiv.appendChild(textnode);
// // 					// 	addDiv.setAttribute('class', 'ui block header q-header');
// // 					// 	header.setAttribute('id',idn);  
// // 					// 	header.setAttribute('data',splitName[0].toLowerCase());                           // Append the text to <li>
// // 					// 	if(!$('#' + idn).length){
// // 					// 		watchList.appendChild(header);
// // 					// 	}
// // 					// }

// // 					// splitName[2] = splitName[2].replace(/^\s+|\s+$/g,'');
// // 					// console.log('splitName[2]', splitName[2])

// // 					// if(!usersObj[splitName[0]][splitName[1]][splitName[2]]){
// // 					// 	console.log('here 3');
// // 					// 	usersObj[splitName[0]][splitName[1]][splitName[2]] = [];
// // 					// 	//console.log(splitName[2]);
// // 					// 	var addDiv = document.createElement('div');
// // 					// 	var titleDiv = document.createElement('div');
// // 					// 	titleDiv.setAttribute('class', 'blockline-title');
// // 					// 	var textnode = document.createTextNode(splitName[2]);         // Create a text node
// // 					// 	addDiv.appendChild(titleDiv);
// // 					// 	titleDiv.appendChild(textnode);
// // 					// 	//addDiv.setAttribute('class', 'ui block header q-header');
// // 					// 	var idm = splitName[2].replace(/\s+/g, '-');
// // 					// 	if(idm[idm.length] == '-') {
// // 					// 		idm = idm.substring(0,idm.length - 1);
// // 					// 	}
// // 					// 	addDiv.setAttribute('id',idm);
// // 					// 	console.log("idm---------", idm);

// // 					// 	if(!$('#' + idm).length){
// // 					// 		document.getElementById(idn).appendChild(addDiv);
// // 					// 	}
// // 					// }

// // 					// if(downloadTime && downloadTime.length){
// // 					// 	date = downloadTime[i];//new Date(request.greeting.watchvideos[i].endTime);
// // 					// }
// // 					//date = date.toLocaleString();
// // 					//var urlLinkData = request.greeting.watchvideos[i].filename;
// // 					var _d = splitName[3].split(' ');
// // 					var date = _d[1] + '/' + _d[2] + '/' + _d[3] + ' ' + _d[5] + ':' + _d[6] + ':' + _d[7] + ' ' + _d[8];
// // 					// if(downloads[i].indexOf('png') != -1) {
// // 					// 	titleLink = 'Image';
// // 					// }                // Create a <li> node
// // 					// var textnode = document.createTextNode(result);         // Create a text node
// // 					// var datenode = document.createTextNode(date);//.toDateString());
// // 					var nodeD = $('<i></i>').attr('class', 'date-part').html(date); //document.createElement("i");  
// // 					// var br = document.createElement('br');                // Create a <li> node
// // 					// nodeD.setAttribute('class', 'date-part');
// // 					var node = $('<div></div>').html(result)
// // 												.attr({'class': 'q watchv', 'data-link': dPath + 'Downloads/videorecordmylife/' + downloads[i]});
// // 					// nodeD;
// // 					// node.setAttribute('class', 'q watchv');
// // 					// node.setAttribute('data-link', dPath + 'Downloads/videorecordmylife/' + downloads[i]);
// // 					// console.log(node, "dddddddddd", nodeD);
// // 					var new_table_row = $('<tr></tr>');
// // 					var new_table_cell = $('<td></td>').append(node);
// // 					new_table_row.append($('<td></td>').append(node));
// // 					new_table_row.append($('<td></td>').append(nodeD));
// // 					$('.file_table_body').append(new_table_row);
// // 					//console.log('below',splitName[2].replace(/\s+/g, '-'));
// // 					// var q = splitName[2].replace(/\s+/g, '-');
// // 					// if(q[q.length - 1] == '-'){
// // 					// 	q = q.substring(0,q.length - 1);
// // 					// }
// // 					// console.log('q',q);
// // 					// // console.log(document.getElementById(q + '-'));
// // 					// //q = q + '-';
// // 					// if(document.getElementById(q)){
// // 					// 	document.getElementById(q).append(node);
// // 					// 	if(date){
// // 					// 		document.getElementById(q).append(nodeD);
// // 					// 	}
// // 					// 	document.getElementById(q).append(br);
// // 					// }
// // 					// console.log('userobj', usersObj);
// // 				}
// // 		}
// // 		console.log('users', usersArray);
// // 		$('.watchuserdropdown').dropdown({
// // 			ignoreCase: true,
// // 			values: userdropdown,
// // 			action: 'activate',
// // 			onChange: function(value) {
// // 				if(value){
// // 					console.log('change', value);
// // 					$('section:not([data="' + value.toLowerCase() + '"])').hide();
// // 					$('[data="' + value.toLowerCase() + '"]').show();
// // 				}
// // 			}
// // 		}); 
// // 		if(userdropdown && userdropdown.length && userdropdown[0].name){
// // 			$('.watchuserdropdown').dropdown('set selected', userdropdown[0].name);
// // 		}
		
// // 	}
// //  });

//   function titleCase(str) {
// 	var splitStr = str.toLowerCase().split(' ');
// 	for (var i = 0; i < splitStr.length; i++) {
// 		// You do not need to check if i is larger than splitStr length, as your for does that for you
// 		// Assign it back to the array
// 		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
// 	}
// 	// Directly return the joined string
// 	return splitStr.join(' '); 
//  }


// user completed recording and stream is available
player.on('finishRecord', function() {
	// the blob object contains the recorded data that
	// can be downloaded by the user, stored on server etc.
	console.log('finished recording: ', player.recordedData);
	console.log(player.recordedData);

	var user = items.selectedUser ? items.selectedUser.replace(/[\W_]+/g, '-').toLowerCase() : "user";
	var header = items.selectedQHeader ? items.selectedQHeader.replace(/[\W_]+/g, '-').toLowerCase() : "header";
	var question;
	if(items.selectedQuestion) {
		console.log('a ', items.selectedQuestion);
		var a = items.selectedQuestion.split('(');
		question = a[0].replace(/[\W_]+/g, '-').toLowerCase();
		console.log(question);
	} else {
		question = 'question';
	}
	var dataURL = URL.createObjectURL(player.recordedData.video);

	var filename = user + "_" + header + "_" + question;
	var filenameValid = filename.replace(/\W/g, '-');
	var increment = "1";
	chrome.storage.sync.get(items.selectedQHeader, function(result) {
		console.log("Check user increment", result);
		if(result[items.selectedQHeader] && result[items.selectedQHeader][items.selectedQuestion] && result[items.selectedQHeader][items.selectedQuestion][items.selectedUser]){
			console.log("have one");
			increment = result[items.selectedQHeader][items.selectedQuestion][items.selectedUser];
		}

		filenameValid = filenameValid + '_Video-' + new Date().toLocaleString().replace(/\W/g, '-');


		chrome.runtime.sendMessage({greeting: {"data": dataURL, "name": filenameValid + "_.webm"}}, function(response) {
			console.log('first-response----------', response);
			//Setup for next recording
			$('.vjs-record').click();
		});

		downloads.push(filenameValid + '_.webm');
		chrome.storage.sync.set({"downloadedVideo": downloads}, function() {
			//console.log('Value is set to ', items);
		});
		downloadTime.push(new Date().toLocaleString());
		chrome.storage.sync.set({"downloadedVideosTime": downloadTime}, function() {
			//console.log('Value is set to ', items);
		});
	});

	console.log("h q u", header,question,user);
	if(header != "header" && question != "question" && user != "user"){
		chrome.storage.sync.get(items.selectedQHeader, function(result) {
			if(result[items.selectedQHeader] && result[items.selectedQHeader][items.selectedQuestion] && result[items.selectedQHeader][items.selectedQuestion][items.selectedUser]){
				result[items.selectedQHeader][items.selectedQuestion][items.selectedUser] = result[items.selectedQHeader][items.selectedQuestion][items.selectedUser] + 1;
			} else if (result[items.selectedQHeader] && result[items.selectedQHeader][items.selectedQuestion]){
				console.log("here to add increment");
				result[items.selectedQHeader][items.selectedQuestion][items.selectedUser] = 1;
			}
			console.log("saving result", result);
			chrome.storage.sync.set(result, function(){
				fillTemplate(false);
				fillTemplate(true);
			});
		});
	}
});

$("#settings").click(function() {
  $('.ui.modal.settings')
  .modal('show');
});

$("#reminder").click(function() {
	$('.ui.modal.reminder')
	.modal('show');
 });


var items = {};

if(!items) {
	items = {
	"headers": [],
	"questions": [],
	"users": ["Default"],
	selectedUser: "Default"
	};
}
//------Format-----
//var downloads = [];
// chrome.storage.sync.get(['downloads'], function(result) {
// 	var olddownloads = result.downloads;
// 	if(olddownloads) {
// 		chrome.storage.local.clear(function() {
// 			var error = chrome.runtime.lastError;
// 			if (error) {
// 				console.error(error);
// 			}
// 		});
// 	}
// })
let downloads = [];

// functionality changed by Bishoy
// When the document is ready, start
$(() => {
	
	
	chrome.storage.sync.get(['questions'], function(result) {
		items = result.questions;
		console.log("result------", result.questions);
		setPrimaryQuestion();
		//------Trial 30 Day period------
		try30Period();
		//-------Fill Interface--------
		fillTemplate(false);//Not Menu
		fillTemplate(true);//Menu
		setPrimaryDownloadData() //set downloads
		// ----------Camera functions------
		imageCaptureCallbacks();

		//-------Show DownloadsCount-------
		showDownloadedVideosCount();

		
		
	});

	imagechangeCallbacks();
	

	addItemCallback();


	

	

});

// when you click the photo or upload photo button in setup modal, you can select another photo
let imagechangeCallbacks = () => {
	$('#mainimage').click(function(e){
		$('#hidden-input').click();	
	});

	$('.upload-photo').click(function(e){
		$('#hidden-input').click();	
	});

	$('#hidden-input').change(function(e){
		let tmppath = URL.createObjectURL(e.target.files[0]);
		$('#mainimage').attr("src", tmppath);
	});
}

// Image capturing function commented by Bishoy
let imageCaptureCallbacks = () => {
	$('#picture').click(function(){
		console.log("clicked image");
		$('.vjs-camera-button').click();
	});
	picture.on('finishRecord', function() {
		console.log("captured image", downloads);
			// the blob object contains the recorded data that
		// can be downloaded by the user, stored on server etc.

		var user = items.selectedUser ? items.selectedUser.replace(/[\W_]+/g, '-').toLowerCase() : "user";
		var header = items.selectedQHeader ? items.selectedQHeader.replace(/[\W_]+/g, '-').toLowerCase() : "header";

		var question;
		console.log("selectedQuestion----", items.selectedQuestion);
		if(items.selectedQuestion) {
			console.log('a ', items.selectedQuestion);
			var a = items.selectedQuestion.split(' (');
			question = a[0].replace(/[\W_]+/g, '-').toLowerCase();
			console.log(question);
		} else {
			// window.alert("No question selected. please choose your question.");
			question = 'question';
		}
		var dataURL = picture.recordedData;
		// console.log("dataURL-----", dataURL);
		var filename = user + "_" + header + "_" + question;
		var filenameValid = filename.replace(/\W/g, '-');
		var increment = "1";
		chrome.storage.sync.get(items.selectedQHeader, function(result) {
			console.log("Check user increment picture", result);
			if(result[items.selectedQHeader] && result[items.selectedQHeader][items.selectedQuestion] && result[items.selectedQHeader][items.selectedQuestion][items.selectedUser]){
				console.log("have one");
				increment = result[items.selectedQHeader][items.selectedQuestion][items.selectedUser];
			}
			filenameValid = filenameValid + '_Image-' + new Date().toLocaleString().replace(/\W/g, '-');
			chrome.runtime.sendMessage({greeting: {"data": dataURL, "name": filenameValid + "_.png"}}, function(response) {
				console.log('download response', response);
				//Setup for next recording
				document.querySelectorAll('.vjs-camera-button')[1].click();
			});
			downloads.push(filenameValid + '_.png');
			increaseIndividualCounter(filenameValid + '_.png');
			// console.log("downloads---", downloads);
			chrome.storage.sync.set({"downloadedVideo": downloads}, function() {
				//console.log('Value is set to ', items);				
			});
			downloadTime.push(new Date().toLocaleString());
			chrome.storage.sync.set({"downloadedVideosTime": downloadTime}, function() {
				//console.log('Value is set to ', items);
			});

		});

		// if(header != "header" && question != "question" && user != "user"){

		// 	// chrome.storage.sync.get(items.selectedQHeader, function(result) {
		// 	// 	if(result[items.selectedQHeader] && result[items.selectedQHeader][items.selectedQuestion] && result[items.selectedQHeader][items.selectedQuestion][items.selectedUser]){
		// 	// 		result[items.selectedQHeader][items.selectedQuestion][items.selectedUser] = result[items.selectedQHeader][items.selectedQuestion][items.selectedUser] + 1;
		// 	// 	} else if (result[items.selectedQHeader] && result[items.selectedQHeader][items.selectedQuestion]){
		// 	// 		console.log("here to add increment");
		// 	// 		result[items.selectedQHeader][items.selectedQuestion][items.selectedUser] = 1;
		// 	// 	}
		// 	// 	console.log(result);
		// 	// 	chrome.storage.sync.set(result);
		// 	// });
		// 	// fillTemplate(false);
		// }
	});
}

let addItemCallback = () => {
	$('.add-item').click(function(e){
		console.log(e);
		var type = e.currentTarget.parentElement.parentElement.id;
		var newValue = e.currentTarget.parentElement.childNodes[1].value;
		if(type == "users" && newValue){
			if(items["users"]){
				items["users"].push({"name": newValue});
			} else {
				items["users"] = [{'name': newValue}];
			}
			fillTemplate(true);
			fillTemplate(false);
		} else if(type == "questions" && newValue){
			if(e.currentTarget.parentElement.childNodes[3].innerText == "Add Header" || e.currentTarget.parentElement.childNodes[3].innerText == "") {
				return false;
			}
			var header = e.currentTarget.parentElement.childNodes[3].innerText
			chrome.storage.sync.get(header, function(result) {
				result[header][newValue] = false;
				chrome.storage.sync.set(result, function(){
					fillTemplate(true);
					fillTemplate(false);
				});
			});
		} else if(type == "headers" && newValue){
			if(items["headers"]){
				items["headers"].push(newValue);
			} else {
				items["headers"] = [newValue];
			}
			chrome.storage.sync.set({newValue: {}}, function(){
				fillTemplate(true);
				fillTemplate(false);
			});
		}
		console.log("items", items);
		e.currentTarget.parentElement.childNodes[1].value = "";

		chrome.storage.sync.set({"questions": items}, function() {
			console.log('Value is set to ' + items);
		});
	});
}

let setPrimaryQuestion = () => {
	if(!items) {
		items = {
			"questions": 1,
			"users": [
				{"name": "Mark"}
			],
			"selectedUser": "Mark",
			"selectedQuestion": "this is a sample question?",
			"beginDate": new Date().getTime() + (30 * 24 * 60 * 60 * 1000),
			"unlocked": false,
			"headers": ["MY BIRTH",
			"CHILDHOOD FAVORITES",
			"FAMILY ROOTS",
			"EXTENDED FAMILY",
			"FAMILY GROWING UP",
			"GROWING UP",
			"SCHOOL FRIENDS",
			"THINGS GOING ON IN THE WORLD",
			"FASHIONS OF THE DAY",
			"THE DATING SCENE",
			"THE LOVE OF MY LIFE",
			"MILITARY SERVICE",
			"STARTING A FAMILY",
			"GRANDCHILDREN",
			"WORK AND CAREER",
			"SIGNIFICANT LIFE-CHANGING EVENTS IN MY LIFETIME",
			"FAVORITE PASSIONS AND PASTIMES",
			"PROUDEST MOMENTS AND ACCOMPLISHMENTS",
			"BUCKET LIST",
			"WORDS OF WISDOM",
			"ADDITIONAL THOUGHTS"
		 ]
		}

		chrome.storage.sync.set({"questions": items}, function() {
			console.log('Value is set to ', items);
		});

		setNewQuestion({"MY BIRTH": {
			"My given name is":{},
			"My date of birth":{},
			"Where I was born":{},
			"My nicknames throughout the years":{},
			"What my name means and why it was chosen":{},
			"Where I was born":{},
			"The US president when I was born":{},
			"A major news event from my birth year":{},
			"The latest advance in technology from my birth year":{}
		}});
		setNewQuestion({"CHILDHOOD FAVORITES": {
			"My earliest memory":{},
			"A story my parents used to tell me":{},
			"Favorite food song book game toy movie TV show activity":{},
			"A childhood experience that stands out":{}
		}});
		setNewQuestion({"FAMILY ROOTS": {
			"My mothers name, birthday, where she grew up":{},
			"My fathers name, birthday, where he grew up":{},
			"How my parents met":{},
			"A favorite story about my parents":{},
			"My brother and sister name birthday description":{},
			"My relationship with my siblings":{},
			"A story my parents never found out about":{},
			"A favorite adventure with my siblings":{}
		}});
		setNewQuestion({"EXTENDED FAMILY": {
			"Which relatives played major roles in my life and where they lived":{},
			"A favorite story about my relatives":{}
		}});
		setNewQuestion({"FAMILY GROWING UP": {
			"This was a signature family dish":{},
			"This was a family table conversation":{},
			"This was a family weekend pastimes":{},
			"This was a family memorable vacation":{},
			"This was a family political leanings":{},
			"This was a family religious observation":{},
			"This was a family hot button topics":{},
			"This was family running jokes":{},
			"This was a family best kept secrets":{}
		}});
		setNewQuestion({"GROWING UP": {
			"This was a family frequent guest":{},
			"Where I went to school elementary middle high school college":{},
			"A memory that sticks out":{},
			"A person or experience that was influential":{},
			"The best part of school":{},
			"The toughest part of school":{},
			"What they taught us that they dont teach now":{},
			"A class, teacher or subject that opened my eyes":{}
		}});
		setNewQuestion({"SCHOOL FRIENDS": {
			"My best friends":{},
			"What we did for fun and hangouts":{},
			"Teenage drama and trouble we got into":{},
			"A memory of a childhood crush":{},
			"Relationship’s that have continued changed or ended":{}
		}});
		setNewQuestion({"THINGS GOING ON IN THE WORLD": {
			"Cultural and world events when I was growing up":{},
			"How the world is different now":{},
			"Things I wish we still had or did":{},
			"Things I am glad that we have or do now":{}
		}});
		setNewQuestion({"FASHIONS OF THE DAY": {
			"Clothes I wore":{},
			"Music I liked":{},
			"Books and magazines I read":{},
			"Movies I saw":{},
			"TV shows I watched":{},
			"Hobbies interests sports I liked":{}
		}});
		setNewQuestion({"MILITARY SERVICE": {
			"I probably served in this branch and unit of the military":{},
			"The reason I chose this branch is":{},
			"Some of the locations that I served include":{},
			"My military duties included":{},
			"The names of some of my fellow service members are":{},
			"My favorite service stories include":{},
			"My most interesting memories are":{},
			"The most difficult memeories include":{}
		}});
		setNewQuestion({"THE DATING SCENE": {
			"My first real love":{},
			"What the dating scene was like":{},
			"A dating experience or heartbreak I experienced":{},
			"My funniest or most awkward dating experiences":{},
			"Her or his name is":{}
		}});
		setNewQuestion({"THE LOVE OF MY LIFE": {
			"When and where he or she was born":{},
			"When and where he or she grew up":{},
			"How we met?":{},
			"Our first date":{},
			"When and where we were married":{},
			"About our wedding and honeymoon":{},
			"Where we first lived":{},
			"What we did for fun":{},
			"A favorite story or memory about early marriage":{},
			"Where we have traveled":{},
			"Some thoughts on love and marriage":{},
			"How to keep the romance alive":{}
		}});
		setNewQuestion({"STARTING A FAMILY": {
			"My children names and where they were born":{},
			"How life changed when I became a parent":{},
			"People not related who have become part of the family":{},
			"My favorite family tradition":{},
			"My favorite holiday memory":{},
			"Fun things the family loved doing together":{},
			"What I learned from my parents about parenting":{},
			"What I tried to do differently from my parents":{},
			"What I hope my children learned from me":{},
			"My childrens milestones and things I am most proud ofd":{},
			"Memories of family outings vacations and places we went":{}
		}});
		setNewQuestion({"GRANDCHILDREN": {
			"Names and when and where they were born":{},
			"How life changed when I became a grandparent":{},
			"The best things about having grandchildren":{},
			"What I do differently with my grandchildren than with my children and why":{}
		}});
		setNewQuestion({"WORK AND CAREER": {
			"My first job ever":{},
			"Places I’ve worked":{},
			"When I was a kid what I wanted to do when I grew up":{},
			"My favorite job":{},
			"My least favorite job":{},
			"The worst boss I had":{},
			"Funniest work experiences":{},
			"If I could have any job I would do this":{},
			"Major choices or tuning points that shaped my career":{},
			"Some thoughts on work and what matters and what I would change":{},
			"My first job ever":{}
		}});
		setNewQuestion({"SIGNIFICANT LIFE-CHANGING EVENTS IN MY LIFETIME":{
			"Where I was and what I remember and how my outlook changed":{},
			"Great people I met and events I was a part of":{},
			"Significant tuning points that changed my life":{},
			"A positive impact I made or would like to make":{}
		}});
		setNewQuestion({"FAVORITE PASSIONS AND PASTIMES":{
			"Colors  indulgences  chores  foods  beverages":{},
			"Desserts   books  songs  TV shows, movies":{},
			"Indoor and outdoor activities   holidays   travel":{},
			"Sports teams   heroes   historical figures":{},
			"The best gift I ever received":{},
			"The person I would most like to meet":{},
			"A talent or skill I wish I had":{},
			"The quality I admire most in a person":{},
			"My greatest regret":{},
			"My idea of perfect happiness":{}
		}});
		setNewQuestion({"PROUDEST MOMENTS AND ACCOMPLISHMENTS":{
			"One of my most proud moments and  accomplishments":{}
		}});
		setNewQuestion({"BUCKET LIST": {
			"Things I still want to do":{}
		}});
		setNewQuestion({"WORDS OF WISDOM": {
			"An experience where I had to make a difficult decision and how it affected me":{},
			"A difficult funny or embarrassing situation that gave me new perspective":{},
			"An experience when life did not go my way and what I learned":{},
			"The most helpful advice I have received":{},
			"The advice I would give myself if I could go back in time":{}
		}});
		setNewQuestion({"ADDITIONAL THOUGHTS": {
			"I just want to say":{}
		}});
	}
}

let setNewQuestion = (headerObj) => {
	chrome.storage.sync.set(headerObj, function() {
		// console.log('Header w/ questions added: ', headerObj);
	});
}

let try30Period = () => {
	var d = new Date().getTime();
	if(d > items.beginDate && !items.unlocked){
		$('.ui.modal.locked')
		.modal({closable: false,
				onApprove : function() {
					if($('#code').val() != "Mark"){
						return false;
					} else {
						items.unlocked = true;
						chrome.storage.sync.set({"questions": items}, function() {
							//console.log('Value is set to ', items);
						});
						return true;
					}
				}
			})
		.modal('show');
	}
}

//Fill both Setup/Main Screen with questions
let firstChange = true;

let fillTemplate = (isMenu) => {
	var qhObj = isMenu ? "#question-header-setup" : "#question-header";
	var qhCont = isMenu ? "setupQH" : "questionSection";
	var qObj = isMenu ? "#question-setup" : "#question";
	var uObj = isMenu ? "#user-setup" : "#user";
	var uCont = isMenu ? "setupU" : "dropdown";

	console.log("filling template", isMenu);

	//Reset Nodes
	$('#'+qhCont).empty();
	$('#'+uCont).empty();
	if(isMenu){
		$("#setupQ").empty();
		
	}

	//Set Dropdown and correct section
	var dropdownlist = [];
	if (items.headers){
		items.headers.forEach(function(el){
			dropdownlist.push({"name": el,"value": el});
		});

		$('.setupdropdown').dropdown({
			values: dropdownlist,
			ignoreCase: true
		});
	}

	
	// console.log("users----", items.users);
	for(i in items.users){
		// if(isMenu){
			var q = document.importNode(document.querySelector(uObj).content, true);
			var s = q.querySelectorAll(".item");
			s[0].innerHTML = items.users[i]['name'];
			s[0].value = items.users[i]['name'];
			$('#' + uCont).append(q);

		// }
		if(!isMenu){
			$('.dropdown').dropdown({
				ignoreCase: true,
				action: 'activate',
				onChange: (value) => {
					if(!firstChange){
						console.log("OnChange",value);
						items.selectedUser = value;
						items.selectedUserI = i;
						chrome.storage.sync.set({"questions": items}, function() {
							console.log(items);
						});
						setupQuestionSelection();
						fillTemplate(false);//Not Menu
						fillTemplate(true);//Menu
					} else {
						firstChange = false;
					}
				}
			});
			$('.ui.dropdown').dropdown('set selected', items.selectedUser);
		}
	}

	// console.log("items----------", items);
	//Add Values
	for(i in items.headers){
		var qh = document.importNode(document.querySelector(qhObj).content, true);		
		var t = qh.querySelectorAll(".q-header");
		var s = qh.querySelectorAll(".cont");		
		t[0].innerHTML = items.headers[i];
		s[0].id = items.headers[i];
		// console.log(items.headers[i]);
		document.getElementById(qhCont).appendChild(qh);
		chrome.storage.sync.get(items.headers[i], function(result) {
			var resultArray = Object.entries(result);
			// console.log(resultArray);
			var qList = Object.entries(resultArray[0][1]);
			for(j in qList){
				var q = document.importNode(document.querySelector(qObj).content, true);
				var s = q.querySelectorAll(".q");
				s[0].innerHTML = qList[j][0];
				if(!isMenu){
					// console.log(items.selectedUser);
					if(qList[j][1] && qList[j][1][items.selectedUser]) {//Answered
						s[0].innerHTML = s[0].innerHTML + '<span> (' + items.selectedUser.charAt(0).toUpperCase() + items.selectedUser.slice(1) + ' Answered)</span';
					}
					document.getElementById(resultArray[0][0]).appendChild(q);

				} else {
					var u = q.querySelector('.smaller');
					u.innerText = resultArray[0][0];
					var d = q.querySelector('.delete-item');
					d.title = resultArray[0][0];
					//var qu = q.querySelector('.q');
					//qu.title = qList[j][0];
					document.getElementById("setupQ").appendChild(q);
				}
			}
			if(items.headers && items.headers.indexOf(resultArray[0][0]) == items.headers.length - 1){
				if(isMenu){
					setUpDeleteEvents();
				} 
				if(!isMenu){
					setupQuestionSelection();
					clickCounter();
				}	
			}
		});
	}
}

let setPrimaryDownloadData = () => {
	chrome.storage.sync.get(['downloadedVideo'], function(result) {
		downloads = result.downloadedVideo;
		// console.log('downloads', result.downloadedVideo);
		if(!downloads) {
			// console.log('dddddddddddddddddddd');
			chrome.storage.sync.set({"downloadedVideo": []}, function() {
				//console.log('Value is set to ', items);
			});
			chrome.storage.sync.set({"downloadedVideosTime": []}, function() {
				//console.log('Value is set to ', items);
			});
		}
	})
}

function setupQuestionSelection(){
	console.log("setupQuestionSelection called");
	$('.q').click(function(e){
		// console.log('q click', e);
		items.selectedQuestion = e.currentTarget.innerText.split(" (")[0];
		// console.log(items.selectedQuestion);
		items.selectedQHeader = e.currentTarget.parentElement.parentElement.id;
		// console.log(items.selectedQHeader);
		if(items.selectedQuestion && items.selectedQHeader) {
			$('div.q').removeClass('q-active');
			$(this).addClass('q-active');
			$('.big-q').html(items.selectedUser.charAt(0).toUpperCase() + items.selectedUser.slice(1) + ", " + items.selectedQuestion);
			$('.big-qh').html(items.selectedQHeader);			
		}
	});

	if(items.selectedQuestion && items.selectedQHeader) {
		$('div.q').removeClass('q-active');		
		$(this).addClass('q-active');
		$('.big-q').html(items.selectedUser.charAt(0).toUpperCase() + items.selectedUser.slice(1) + ", " + items.selectedQuestion);
		$('.big-qh').html(items.selectedQHeader);			
	} else if($('.q').length){
		items.selectedQuestion = $('.q')[0].innerText;
		items.selectedQHeader = $('.q')[0].parentElement.parentElement.id;
		$('.q')[0].classList = 'q q-active';
		$('.big-q').html(items.selectedUser.charAt(0).toUpperCase() + items.selectedUser.slice(1) + ", " + items.selectedQuestion);
		$('.big-qh').html(items.selectedQHeader);		
	}
}

function setUpDeleteEvents(){
	$('.delete-item').click(function(e){
		console.log(e);
		var type = e.currentTarget.parentElement.title;
		var value = e.currentTarget.parentElement.innerText;
		console.log(type,value);
		if(type == "user" && items.users){
			items.users.forEach(function(el, i){
				if(value.includes(el.name)){
					items.users.splice(i,1);
					items.selectedUser = "";
					items.selectedUserI = -1;
					if(items.users.length){
						items.selectedUser = items.users[0].name;
						items.selectedUserI = 0;
						resetSelected();
						$('.ui.dropdown').dropdown('set selected', items.selectedUser);
					}
				}
			});
			fillTemplate(true);
			fillTemplate(false);
		} else if(type == "question"){
			// console.log("e.currentTarget.title", e.currentTarget.title);
			chrome.storage.sync.get(e.currentTarget.title, function(result) {
				if(result[e.currentTarget.title]){
					delete result[e.currentTarget.title][e.currentTarget.previousElementSibling.previousElementSibling.innerText];
					chrome.storage.sync.set(result, function(){
						fillTemplate(true);
						fillTemplate(false);
					});
				}
			});
		} else if(type == "header" && items.headers){
			items.headers.forEach(function(el, i){
				console.log("h", el, value);
				if(value.includes(el)){
					console.log("a");
					items.headers.splice(i,1);
				}
			});
			fillTemplate(true);
			fillTemplate(false);
		}
		chrome.storage.sync.set({"questions": items}, function() {
			console.log('Value is set to ', items);
		});
	});
}

function resetSelected() {
	console.log("Reset text");
	items.selectedQuestion = "";
	items.selectedQHeader = "";
	$('.big-q')[0].innerText = "";
	$('.big-qh')[0].innerText = "";
}

// when you click the number, you can go to view screen
function clickCounter(){
	$('.counter').click(function(e){
		$('#questionSectionWatch').empty();
		$('.file_table_body').empty();
		$('#watch').addClass('content').removeClass('hidden');
		$('#record').addClass('hidden').removeClass('content');
		$('#recordtab').removeClass('active');
		$('#watchtab').addClass('active');
		$('div.q').removeClass('q-active');
		// console.log("this--------------", $(this));
		$(this).siblings('div.q').addClass('q-active');
		var category_txt = $(this).parent().parent().prev().html();
		// console.log($(this));
		$('.watch_guide span').html('VIEW ALL ' + category_txt + ' PHOTOS/VIDEOS');
		var category_name = $('<h3></h3>').addClass('ui block header')
											.css({"width": "90%", 'margin-top': '1rem', 'margin-left': '5%'})
											.html(category_txt);
		$('#questionSectionWatch').append(category_name);
		var question_div = $('<div></div>').addClass('q')
											.css({'margin-left': '5%'})
											.html($(this).siblings('div.q').html());
		var question_cont = $('<div></div').addClass('content').append(question_div);

		$('#questionSectionWatch').append(question_cont);

		$('.watchuserdropdown .text').html($('.selected_user .text').html());
		console.log("counter click----")

		for (var i = 0; i < downloads.length; i++) {
			let name_split = downloads[i].split('_');
			let temp = name_split[2].split('-');
			name_split[2] = temp.join(' ');
			// console.log("name_split2m----", name_split[2])
			// console.log("qeustion_div----", question_div.html())
			// console.log("comparison-----", name_split[2] == question_div.html().toLowerCase())
			if (name_split[2] == question_div.html().toLowerCase()) {

				
				let _d = name_split[3].split(' ');
				// let date = _d[1] + '/' + _d[2] + '/' + _d[3] + ' ' + _d[5] + ':' + _d[6] + ':' + _d[7] + ' ' + _d[8];
				let nodeD = $('<i></i>').attr('class', 'date-part').html(downloadTime[i]); //document.createElement("i");  
				let node = $('<div></div>').html(downloads[i])
											.attr({'class': 'q watchv', 'data-link': dPath + 'Downloads/videorecordmylife/' + downloads[i]});
				let new_table_row = $('<tr></tr>');
				let new_table_cell = $('<td></td>').append(node);
				new_table_row.append($('<td></td>').append(node));
				new_table_row.append($('<td></td>').append(nodeD));
				$('.file_table_body').append(new_table_row);
			}
			
		}

		// chrome.runtime.sendMessage({greeting: 'getvideos'}, function(response) {
		// 	console.log("getvidoes response------", response);
		// 	//Setup for next recording
		// 	$('.vjs-record').click();
		// 	clickWatchV();
		// });
		
	});
}

//set the public values downloads and downloadTime
let showDownloadedVideosCount = () => {
	console.log("showDownloadedVideosCount called");
	chrome.storage.sync.get(['downloadedVideo'], function(result) {
		downloads = result.downloadedVideo;				
		console.log("downloads---", downloads);
		for (var i = downloads.length - 1; i >= 0; i--) {
			increaseIndividualCounter(downloads[i]);
			// var name_split = downloads[i].split('_');
			// // console.log(name_split);
			// if(name_split.length > 1) {
			// 	for(var j = 0; j < name_split.length; j++){
			// 		name_split[j] = name_split[j].replace(/\W/g, ' ');
			// 	}
			// }
			// // console.log(name_split[2]);
			// let question_div = $('#questionSection').find('.q');
			// // console.log("question_div---", question_div.length);
			// for (var k = 0; k < question_div.length; k++) {
			// 	// console.log(question_div[k].innerHTML.toUpperCase().split('<')[0] == name_split[2].toUpperCase());
			//   	if(question_div[k].innerHTML.toUpperCase().split('<')[0] == name_split[2].toUpperCase()) {
			//   		let counter_span = question_div[k].previousElementSibling.getElementsByTagName('span')[0];
			// 		let num = parseInt(counter_span.innerHTML);
			// 		// console.log(num+1);
			// 		counter_span.innerHTML = (num + 1).toString();			  		
			//   	}
			// }
					
		}
		if(downloads == []) {
			console.log("downloads empty!")
			chrome.storage.sync.set({"downloadedVideo": []}, function() {
				console.log('Value is set to ', items);
			});
		}
	});

	chrome.storage.sync.get(['downloadedVideosTime'], function(result) {
		downloadTime = result.downloadedVideosTime;
		// console.log('downloadTime', downloadTime);
		if(!downloadTime) {
			chrome.storage.sync.set({"downloadedVideosTime": []}, function() {
				//console.log('Value is set to ', items);
			});
		}
	});
}

let increaseIndividualCounter = (downloadData) => {
	var name_split = downloadData.split('_');
	// console.log(name_split);
	if(name_split.length > 1) {
		for(var j = 0; j < name_split.length; j++){
			name_split[j] = name_split[j].replace(/\W/g, ' ');
		}
	}
	// console.log(name_split[2]);
	let question_div = $('#questionSection').find('.q');
	// console.log("question_div---", question_div.length);
	for (var k = 0; k < question_div.length; k++) {
		// console.log(question_div[k].innerHTML.toUpperCase().split('<')[0] == name_split[2].toUpperCase());
	  	if(question_div[k].innerHTML.toUpperCase().split('<')[0] == name_split[2].toUpperCase()) {
	  		let counter_span = question_div[k].previousElementSibling.getElementsByTagName('span')[0];
			let num = parseInt(counter_span.innerHTML);
			// console.log(num+1);
			counter_span.innerHTML = (num + 1).toString();			  		
	  	}
	}
}

let clickWatchV = () => {
	$('.watchv').click(function(e){
		console.log('watchv-clicked', e.target.dataset);
		console.log("dPath---", dPath);
		var pathV = e.target.dataset.link;
		if(pathV.indexOf('webm') != -1 || pathV.indexOf('mp4') != -1){
			$('#watchI').attr("src", '');
			$('#watchI').attr("class", '');
			var xhr = new XMLHttpRequest();
			xhr.responseType = "blob";
			xhr.onload = function () {
				//var json = JSON.parse(xhr.responseText);
				//console.log(json);
				var a = URL.createObjectURL(xhr.response);
				console.log('video', a)
				if(pathV.indexOf('webm') != -1) {
					wplayer.src({type:"video/webm", src: a});
				} else if(pathV.indexOf('mp4') != -1){
					wplayer.src({type:"video/mp4", src: a});
				}

			}
			xhr.open("GET", 'file://' + pathV);
			xhr.send();
		} else if(pathV.indexOf('png') != -1) {
			$('#watchI').attr("src", 'file://' + pathV); 
			$('#watchI').attr("class", 'show');
		}
	})
}



















