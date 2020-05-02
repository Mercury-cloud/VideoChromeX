

let options = {
	controls: true,
	width: 600,
	height: 420,
	fluid: false,
	
	plugins: {
		record: {
			audio: true,
			video: true,
			maxLength: 7200,
			audioEngine: 'recordrtc',
			videoMimeType:"video/webm;codecs=H264",
			debug: true
		}
	}
};

let optionsSmall = {
	controls: true,
	width: 280,
	height: 140,
	fluid: false,
	controlBar: {
		volumePanel: false
	},
	plugins: {
		record: {
			audio: false,
			video: true,
			frameWidth: 1280,
			frameHeight: 720,
			maxLength: 7200,
			videoMimeType:"video/webm;codecs=H264",
			debug: true
		}
	}
};

let watchoptions = {
	controls: true,
	autoplay: true,
	width: 600,
	height: 420,
	controlBar: {
		volumePanel: false,
		fullscreenToggle: false
	},
};


let optionsCamera = {
	controls: true,
	width: 960,
	height: 630,
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

let picture = videojs("myPicture", optionsCamera, function(){
	console.log("initilized picture taker");
});

let player = videojs('myVideo', options, function() {
    // print version information at startup
    let msg = 'Using video.js ' + videojs.VERSION +
        ' with videojs-record ' + videojs.getPluginVersion('record') +
        ' and recordrtc ' + RecordRTC.version;
    videojs.log(msg);
});

let playerSmall = videojs("myVideoSmall", optionsSmall, function(){
	// print version information at startup
	let msg = 'Using video.js ' + videojs.VERSION +
			' with videojs-record ' + videojs.getPluginVersion('record') +
			' and recordrtc ' + RecordRTC.version;
	videojs.log(msg);
});

let wplayer = videojs("myWatchVideo", watchoptions, () => {

});


let initial = () => {
	if(cameraDetectVal) return;
	$('#myPicture button.vjs-record').click();
    $('#myVideo button.vjs-record').click();
    $('#myVideoSmall button.vjs-record').click();
}



let items = {};
let downloads = [];
let downloadTime = [];
let firstChange = true;
let headerChange = true;
let headerChanged = false;
let questionChange = true;
let call_clicked = false;
let cameraDetectVal = false;


// functionality changed by Bishoy
// When the document is ready, start!
$(() => {
	
	initial();
		
	cameraDetect();
	
	chrome.storage.sync.get(['questions'], function(result) {

		items = result.questions;
		// console.log("result------", result.questions);
		setPrimaryQuestion();

		// recordquestionSetting();
		//------Trial 30 Day period------
		try30Period();
		//-------Fill Interface--------
		fillTemplate(true); //Menu
		fillTemplate(false); //Not Menu
		setPrimaryDownloadData() //set downloads
		recordqHeaderSetting();

		// ----------Camera functions------
		imageCaptureCallbacks();
		videoRecordCallbacks();

		setTimeout(function() {
			// -------Show DownloadsCount-------
			showDownloadedVideosCount('record');
		}, 1000);
		
	});


	settingCallback();
	reminderCallback();
	callfunctionality();

	imagechangeCallbacks();
	addItemCallback();
	switchTabFunctions();
	clickWatchGuide();

});

//click call button
let callfunctionality = () => {

	$('#call').click(() => {
		if(call_clicked) return;
		// $(this).addClass('red').removeClass('green').html('end');
		document.getElementById('myVideoSmall').className = 'video-js vjs-default-skin';
		call_clicked = true;
	});

	$('#end').click(() => {
		document.getElementById('myVideoSmall').className = 'hiddenVideo';
		$('.coll div input').val('');
		call_clicked = false;
	});

}

// switch record and watch button
let switchTabFunctions = () => {

	$('#recordtab').click(() => {
		// $('div.q')[0].className = 'q q-active';
		document.getElementById('watch').classList = 'hidden';
		document.getElementById('record').classList = 'content';
		document.getElementById('recordtab').classList = 'active';
		document.getElementById('watchtab').classList = '';
	});

	$('#watchtab').click(() => {
		tabChangeFunction();
	});
}

//click setup button
let settingCallback = () => {

	$("#settings").click(function() {
	  $('.ui.modal.settings')
	  .modal('show');
	});
}

//click reminder link
let reminderCallback = () => {

	$("#reminder").click(function() {
		$('.ui.modal.reminder')
		.modal('show');
	 });
}

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
		if(!cameraDetectVal) {
			window.confirm("Hello, Camera is not connected!");
			return;
		}
		$('.vjs-camera-button')[2].click();
	});
	picture.on('finishRecord', function() {
		
		var user = items.selectedUser ? items.selectedUser.replace(/[\W_]+/g, '-').toLowerCase() : "user";
		var header = items.selectedQHeader ? items.selectedQHeader.replace(/[\W_]+/g, '-').toLowerCase() : "header";

		var question;
		console.log("selectedQuestion----", items.selectedQuestion);
		if(items.selectedQuestion) {
			// console.log('a ', items.selectedQuestion);
			var a = items.selectedQuestion.split(' (');
			question = a[0].replace(/[\W_]+/g, '-').toLowerCase();
			// console.log(question);
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
			console.log(downloads, downloadTime);
			downloads.push(filenameValid + '_.png');
			downloadTime.push(new Date().toLocaleString());
			

			increaseIndividualCounter(filenameValid + '_.png', 'record');
			player.record().stop();
			// console.log("downloads---", downloads);
			chrome.storage.sync.set({"downloadedVideo": downloads}, function() {
				//console.log('Value is set to ', items);
				filltable();				
			});
			chrome.storage.sync.set({"downloadedVideosTime": downloadTime}, function() {
				//console.log('Value is set to ', items);
			});

		});
		
	});
}

let successCallback = () => {
	// console.log("camera detected");
	initial();
	cameraDetectVal = true;
	cameraDetect();

}

let errorCallback = () => {
	cameraDetectVal = false;
	// console.log("camera error");
	cameraDetect();
}

let cameraDetect = () => {

	setTimeout(function() {
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
	  	if (navigator.getUserMedia){
	    	navigator.getUserMedia({video: true}, successCallback, errorCallback);
		}		
	}, 1000);
	
}

// the callbacks while video recording
let videoRecordCallbacks = () => {

	// console.log(player)
	
	$('#play').click(() => {
		// console.log("camera---", navigator.getUserMedia);
		if(!cameraDetectVal) {
			window.confirm("Hello, Camera is not connected!");
			return;
		}
		if(player.record().isRecording()) {
			player.record().resume();
		} else {
			player.record().start();
			console.log('started--------');
		}
		$("#eighthundred").attr('class', 'eighthundred');
		$('#play').attr('class', 'hidden');
		$('#stop').attr('class', '');
		$('#pause').attr('class', '');
	});

	$('#stop').click(() => {
		player.record().stop();		
		// player.play().stop();
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
		console.warn('device error:', player.deviceErrorCode);
	});

	// user clicked the record button and started recording
	player.on('startRecord', function() {
		console.log('started recording!');
	});


	// user completed recording and stream is available
	player.on('finishRecord', function() {
		var user = items.selectedUser ? items.selectedUser.replace(/[\W_]+/g, '-').toLowerCase() : "user";
		var header = items.selectedQHeader ? items.selectedQHeader.replace(/[\W_]+/g, '-').toLowerCase() : "header";
		var question;
		if(items.selectedQuestion) {
			console.log('a ', items.selectedQuestion);
			var a = items.selectedQuestion.split(' (');
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
			// console.log(downloads, downloadTime);

			downloads.push(filenameValid + '_.webm');
			
			downloadTime.push(new Date().toLocaleString());

			increaseIndividualCounter(filenameValid + '_.webm', 'record');

			chrome.storage.sync.set({"downloadedVideo": downloads}, function() {
				//console.log('Value is set to ', items);				
				filltable();
			});
			chrome.storage.sync.set({"downloadedVideosTime": downloadTime}, function() {
				//console.log('Value is set to ', items);
			});
		});
	});

}

//add item(+ button) click on the set up modal
let addItemCallback = () => {
	$('.add-item').click(function(e){
		console.log(e);
		var type = e.currentTarget.parentElement.parentElement.id;
		var newValue = e.currentTarget.parentElement.childNodes[1].value;
		console.log(type, newValue);
		if(type == "users" && newValue){
			if(items["users"]){
				items["users"].push({"name": newValue});
			} else {
				items["users"] = [{'name': newValue}];
			}
			fillTemplate(true);
			fillTemplate(false);
			showDownloadedVideosCount("record");

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
					showDownloadedVideosCount("record");

				});
			});
		} else if(type == "qHeaders" && newValue){
			if(items["headers"]){
				items["headers"].push(newValue);
			} else {
				items["headers"] = [newValue];
			}
			// console.log('headers--', items['headers']);
			chrome.storage.sync.set({newValue: {}}, function(){
				fillTemplate(true);
				fillTemplate(false);
				showDownloadedVideosCount("record");

			});
		}
		// console.log("items", items);
		e.currentTarget.parentElement.childNodes[1].value = "";

		chrome.storage.sync.set({"questions": items}, function() {
			console.log('Value is set to ' + items);
		});
	});
}

//set primary questions => items
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

//save question to storage
let setNewQuestion = (headerObj) => {
	chrome.storage.sync.set(headerObj, function() {
		// console.log('Header w/ questions added: ', headerObj);
	});
}

// try30period function
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
			$('.selected_user').dropdown({
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
						fillTemplate(false);//Not Menu
						fillTemplate(true);//Menu
						questionSelect();
						showDownloadedVideosCount("record");
					} else {
						firstChange = false;
					}
				}
			});
			$('.ui.selected_user').dropdown('set selected', items.selectedUser);
		}
	}	
	//Add Values
	for(i in items.headers){
		var qh = document.importNode(document.querySelector(qhObj).content, true);		
		var t = qh.querySelectorAll(".q-header");
		var s = qh.querySelectorAll(".cont");	
		// console.log(items);	
		t[0].innerHTML = items.headers[i];
		s[0].id = items.headers[i];
		document.getElementById(qhCont).appendChild(qh);
		chrome.storage.sync.get(items.headers[i], function(result) {
			var resultArray = Object.entries(result);
			var qList = Object.entries(resultArray[0][1]);
			for(j in qList){
				var q = document.importNode(document.querySelector(qObj).content, true);
				var s = q.querySelectorAll(".q");
				s[0].innerHTML = qList[j][0];
				if(!isMenu){
					if(qList[j][1] && qList[j][1][items.selectedUser]) {//Answered

						s[0].innerHTML = s[0].innerHTML + '<span> (' + items.selectedUser.charAt(0).toUpperCase() + items.selectedUser.slice(1) + ' Answered)</span';
					}
					document.getElementById(resultArray[0][0]).appendChild(q);

				} else {
					var u = q.querySelector('.smaller');
					u.innerText = resultArray[0][0];
					var d = q.querySelector('.delete-item');
					d.title = resultArray[0][0];
					document.getElementById("setupQ").appendChild(q);
				}
			}
			
			if(items.headers && items.headers.indexOf(resultArray[0][0]) == items.headers.length - 1){
				if(isMenu){
					setUpDeleteEvents();
				} 
				if(!isMenu){
					// resetSelected();
					questionClickCallback();
					// clickCounter();
				}	
			}
		});
	}
	// $('#questionWrapper').scr0ollTop('100px');
	// $('#questionSection').animate({ scrollTop: '100px' });
		// document.getElementById('questionWrapper').scrollTop = '100px';
			// console.log("height----------", $('#questionSection').outerHeight());
}

// set the public variable downloads
let setPrimaryDownloadData = () => {
	chrome.storage.sync.get(['downloadedVideo'], function(result) {
		downloads = result.downloadedVideo;
		if(!downloads) {
			downloads = [];
			chrome.storage.sync.set({"downloadedVideo": []}, function() {
				//console.log('Value is set to ', items);
			});
		}
	});
	chrome.storage.sync.get(['downloadedVideosTime'], function(result) {
		downloadTime = result.downloadedVideosTime;
		if(!downloadTime) {
			downloadTime = [];
			chrome.storage.sync.set({"downloadedVideosTime": []}, function() {
				//console.log('Value is set to ', items);
			});
		}
	})
}

let questionClickCallback = () => {
	$('.q').click(function(e){
		items.selectedQuestion = e.currentTarget.innerText.split(" (")[0];
		items.selectedQHeader = e.currentTarget.parentElement.parentElement.id;
		questionSelect();
	});
}

// set up question selection(active) 
function questionSelect(){
	console.log("questionSelect called", items.selectedQHeader);
	console.log("questionSelect called", items.selectedQuestion);

	if(items.selectedQuestion && items.selectedQHeader) {
		// console.log("select--")
		$('div.q').removeClass('q-active');	
		// console.log("len------", $('div.q').length);	
		for(let i in $('div.q')){
			// console.log($('div.q')[i].innerHTML, items.selectedQuestion);
			if($('div.q')[i].innerHTML == items.selectedQuestion){
				$('div.q')[i].className = 'q q-active';
			} 
		}
		$('.big-q').html(items.selectedUser.charAt(0).toUpperCase() + items.selectedUser.slice(1) + ", " + items.selectedQuestion);
		$('.big-qh').html(items.selectedQHeader);			
	} else if($('.q').length){
		items.selectedQuestion = $('.q')[0].innerText;
		items.selectedQHeader = $('.q')[0].parentElement.parentElement.id;
		$('.q')[0].classList = 'q q-active';
		$('.big-q').html(items.selectedUser.charAt(0).toUpperCase() + items.selectedUser.slice(1) + ", " + items.selectedQuestion);
		$('.big-qh').html(items.selectedQHeader);		
	}
	filltable();
}

//delete callback on setup modal
function setUpDeleteEvents(){
	$('.delete-item').click(function(e){
		// console.log(e);
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

// refresh selected variable and header
function resetSelected() {
	console.log("Reset text");
	items.selectedQuestion = "";
	items.selectedQHeader = "";
	$('.big-q')[0].innerText = "";
	$('.big-qh')[0].innerText = "";
}

// when you click the number, you can go to view screen
// function clickCounter(){
// 	$('.video_count').click(function(e){
// 		CommonClickFunction(this, 'videos');
// 	});
// 	$('.photo_count').click(function(e){
// 		// console.log(downloads, downloadTime);
// 		CommonClickFunction(this, 'photos');
// 	});
// }

// watch downloaded files for selected question
let tabChangeFunction = () => {
	// if($(counterObj).children('span').html() == '0'){
	// 	window.confirm("Hello, You haven't recorded any " + flag + '!');
	// 	return;	
	// } 	
	chrome.storage.sync.get(['downloadedVideo'], function(result) {
		downloads = result.downloadedVideo;
		if(!downloads) {
			downloads = [];
			chrome.storage.sync.set({"downloadedVideo": []}, function() {
				window.confirm("Hello, You haven't recorded any datas!");
			});
		}
	});
	// $('.file_table_body').empty();
	$('.vjs-control-bar').css('display', 'none');
	$('#watch').addClass('content').removeClass('hidden');
	$('#record').addClass('hidden').removeClass('content');
	$('#recordtab').removeClass('active');
	$('#watchtab').addClass('active');
	// $('div.q').removeClass('q-active');
	// $(counterObj).siblings('div.q').addClass('q-active');
	// items.selectedQuestion = $(counterObj).siblings('div.q').html();
	// items.selectedQHeader = $(counterObj)[0].parentElement.parentElement.id;
	// var category_txt = $(counterObj).parent().parent().prev().html();
	// $('.watch_guide span').html('VIEW ALL ' + category_txt + ' PHOTOS/VIDEOS');
	// let question_txt = $(counterObj).siblings('div.q').html();
	// questionSectionSet();
	
	$('.watchuserdropdown .text').html($('.selected_user .text').html());
	// console.log("counter click----", items);

	
}

// let questionSectionSet = () => {	
// 	// $('#questionSection').empty();
// 	// for (var i = 0; i < items.headers.length; i++) {
// 	// 	chrome.storage.sync.get(items.headers[i], function(result) {
// 	// 		var resultArray = Object.entries(result);
// 	// 		var qList = Object.entries(resultArray[0][1]);

// 	// 		var category_name = $('<h3></h3>').addClass('ui block header')
// 	// 									.css({"width": "90%", 'margin-top': '1rem', 'margin-left': '5%'})
// 	// 									.html(resultArray[0][0]);
// 	// 		$('#questionSection').append(category_name);
// 	// 		$('#questionSection').append($('<div class="cont"></div>').attr('id', "watch_" + resultArray[0][0]));

// 	// 		for(j in qList){
// 	// 			var q = document.importNode(document.querySelector('#question').content, true);
// 	// 			var s = q.querySelectorAll(".q");
// 	// 			s[0].innerHTML = qList[j][0];
// 	// 			if(qList[j][0] == items.selectedQuestion) s[0].classList = 'q q-active';
// 	// 			document.getElementById('watch_' + resultArray[0][0]).appendChild(q);

// 	// 		}
// 	// 		questionSelect();			
// 	// 	});
// 	// }
// 	// console.log("count called---");
// 	// showDownloadedVideosCount("watch");
	
// 	console.log("count called---", items.selectedQuestion);

// 	filltable(items.selectedQuestion);
// 	$("#questionSection .q").click(function(e){
// 		console.log('question clicked-------------------------', items.selectedQuestion);
// 		filltable(items.selectedQuestion);
// 	})
// }

let filltable = () => {
	console.log('------------------------------------', items.selectedQuestion)
	chrome.runtime.sendMessage({greeting: 'getdirectoryPath'}, function(response) {
		let linkPath = response.greeting;
		console.log('ddddd-----', linkPath)
		$('.file_table_body').empty();
		listFunction(true, linkPath, items.selectedQuestion);
		listFunction(false, linkPath, items.selectedQuestion);
		clickWatchV();
	});
}


let recordqHeaderSetting = () => {
	
	//Set recordqheadersdropdown and correct section
	var dropdownlist = [];
	if (items.headers){
		items.headers.forEach(function(el){
			dropdownlist.push({"name": el,"value": el});
		});

		$('.recordqheadersdropdown').dropdown({
			values: dropdownlist,
			ignoreCase: true
		});
	}

	$('.recordqheadersdropdown').dropdown({
		ignoreCase: true,
		action: 'activate',
		onChange: (value) => {
			if(!headerChange){
				console.log("OnChange",value);
				items.selectedQHeader = value;
				$('.watch_guide span').html('VIEW ALL ' + value + ' PHOTOS/VIDEOS');
				// $('#questionSectionWatch h3').html(value);
				chrome.storage.sync.set({"questions": items}, function() {
					// console.log(items);
				});		
				headerChanged = true;
				console.log('header changed!------------')
				// fillTemplate(false);	
				recordquestionSetting();			
				// questionSelect();
				
				// showDownloadedVideosCount("record");
			} else {
				headerChange = false;
			}
		}
	});
	items.selectedQHeader = items.headers[0];
	$('.ui.recordqheadersdropdown').dropdown('set selected', items.selectedQHeader);
	$('.watch_guide span').html('VIEW ALL ' + items.selectedQHeader + ' PHOTOS/VIDEOS');
	headerChanged = true;
	recordquestionSetting();
}

let recordquestionSetting = () => {
	chrome.storage.sync.get(items.selectedQHeader, function(result) {
		let resultArray = Object.entries(result);
		let qList = Object.entries(resultArray[0][1]);

		let dropdownlist = [];
		if (qList){
			qList.forEach(function(el){
				dropdownlist.push({"name": el[0],"value": el[0]});
			});

			$('.recordquestionsdropdown').dropdown({
				values: dropdownlist,
				ignoreCase: true
			});
		}
		if(headerChanged) {
			items.selectedQuestion = qList[0][0];
		}
		console.log("recordquestionSetting----")
		questionSelect();
		$('.recordquestionsdropdown .text').html(qList[0][0]).removeClass('default');
		$('.recordquestionsdropdown').dropdown({
			ignoreCase: true,
			action: 'activate',
			onChange: (value) => {
				if(!questionChange){
					items.selectedQuestion = value;
					chrome.storage.sync.set({"questions": items}, function() {
						// console.log(items);
					});		
					questionSelect();
				} else {
					questionChange = false;
				}
			}
		});
		$('.ui.recordquestionsdropdown').dropdown('set selected', items.selectedQuestion);
		
	});
	
}

// let watchqHeaderSetting = () => {
	
// 	//Set watchqheadersdropdown and correct section
// 	var dropdownlist = [];
// 	if (items.headers){
// 		items.headers.forEach(function(el){
// 			dropdownlist.push({"name": el,"value": el});
// 		});

// 		$('.watchqheadersdropdown').dropdown({
// 			values: dropdownlist,
// 			ignoreCase: true
// 		});
// 	}

// 	$('.watchqheadersdropdown').dropdown({
// 		ignoreCase: true,
// 		action: 'activate',
// 		onChange: (value) => {
// 			if(!headerChange){
// 				console.log("OnChange",value);
// 				items.selectedQHeader = value;
// 				$('.watch_guide span').html('VIEW ALL ' + value + ' PHOTOS/VIDEOS');
// 				// $('#questionSectionWatch h3').html(value);
// 				chrome.storage.sync.set({"questions": items}, function() {
// 					// console.log(items);
// 				});		
// 				headerChanged = true;
// 				watchquestionSetting();				
// 				questionSelect();
// 				// showDownloadedVideosCount();
// 			} else {
// 				headerChange = false;
// 			}
// 		}
// 	});
// 	$('.ui.watchqheadersdropdown').dropdown('set selected', items.selectedQHeader);
// 	headerChanged = false;
// 	watchquestionSetting();

// }

// let watchquestionSetting = () => {
// 	chrome.storage.sync.get(items.selectedQHeader, function(result) {
// 		let resultArray = Object.entries(result);
// 		let qList = Object.entries(resultArray[0][1]);
// 		let dropdownlist = [];
// 		if (qList){
// 			qList.forEach(function(el){
// 				// console.log(el);
// 				dropdownlist.push({"name": el[0],"value": el[0]});
// 			});

// 			$('.watchquestionsdropdown').dropdown({
// 				values: dropdownlist,
// 				ignoreCase: true
// 			});
// 		}
// 		// $('.watchquestionsdropdown').val(qList[0][0]);
// 		// $('#questionSectionWatch div div.q').html(qList[0][0]);
// 		// if(headerChanged) {
// 		// 	items.selectedQuestion = qList[0][0];
// 		// 	questionSectionSet(items.selectedQHeader, items.selectedQuestion);
// 		// }
// 		// else{
// 		// 	questionSectionSet(items.selectedQHeader, $('.q-active').html());
// 		// }
// 		$('.watchquestionsdropdown .text').html(qList[0][0]).removeClass('default');
// 		// console.log($('.watchquestionsdropdown').val());
// 		$('.watchquestionsdropdown').dropdown({
// 			ignoreCase: true,
// 			action: 'activate',
// 			onChange: (value) => {
// 				if(!questionChange){
// 					console.log("OnChange",value);
// 					items.selectedQuestion = value;
// 					// $('#questionSectionWatch div div.q').html(value);
// 					questionSectionSet(items.selectedQHeader, value);
// 					chrome.storage.sync.set({"questions": items}, function() {
// 						// console.log(items);
// 					});		
// 					// watchquestionSetting();				
// 					questionSelect();
// 					// showDownloadedVideosCount();
// 				} else {
// 					questionChange = false;
// 				}
// 			}
// 		});
// 		$('.ui.watchquestionsdropdown').dropdown('set selected', items.selectedQuestion);
		
// 	});
	
// }

let listFunction = (imageList, linkPath, question_txt) => {
	
	let fileExt = imageList? ".png": ".webm";
	// console.log("downloads in listfunction---", downloads);
	for (var i = 0; i < downloads.length; i++) {				
		let name_split = downloads[i].split('_');
		// if(imageList) console.log('name_split---', name_split[4] != fileExt);
		if(name_split[4] != fileExt) continue;
		// console.log(downloads[i], downloadTime[i]);
		// console.log(name_split[0], items.selectedUser);
		if(name_split[0] != items.selectedUser.toLowerCase()) continue;
		let temp = name_split[2].split('-');
		name_split[2] = temp.join(' ');
		if (name_split[2] == question_txt.toLowerCase()) {
			// let d = name_split[3].split('-');
			// console.log("table fill ----------");
			let nodeD = $('<i></i>').attr('class', 'date-part').html(downloadTime[i]); //document.createElement("i");  
			console.log("linkPath---", linkPath);
			console.log("downloads[i]---", downloads[i]);
			let node = $('<div></div>').html(downloads[i])
									  	.attr({'class': 'q watchv', 'data-link': linkPath + downloads[i]});
			let new_table_row = $('<tr></tr>');					
			new_table_row.append($('<td></td>').append(node));
			new_table_row.append($('<td></td>').append(nodeD));
			$('.file_table_body').append(new_table_row);
		}
	}	
}



//set the public values downloads and downloadTime
let showDownloadedVideosCount = (status) => {
	console.log("showDownloadedVideosCount called");
	chrome.storage.sync.get(['downloadedVideo'], function(result) {
		downloads = result.downloadedVideo;	
		// console.log("downloadedVideo", downloads != undefined);		
		if(downloads != undefined) {
			for (var i = downloads.length - 1; i >= 0; i--) {
				increaseIndividualCounter(downloads[i], status);			
			}
		}
		else 
		{
			chrome.storage.sync.set({"downloadedVideo": []}, function() {
				//console.log('Value is set to ', items);
			});
		}
	});
	
}

//increase video or photo counts whenever you download
let increaseIndividualCounter = (downloadData, status) => {
	var name_split = downloadData.split('_');
	// console.log("split----", name_split);
	// console.log("user---", items.selectedUser);
	if(name_split[0] != items.selectedUser.toLowerCase()) return;
	if(name_split.length > 1) {
		for(var j = 0; j < name_split.length; j++){
			name_split[j] = name_split[j].replace(/\W/g, ' ');
		}
	}
	let question_div;
	if(status == "both" || status == "record"){
		question_div = $('#questionSection').find('.q');
		for (var k = 0; k < question_div.length; k++) {
		  	if(question_div[k].innerHTML.toUpperCase().split('<')[0] == name_split[2].toUpperCase()) {
		  		let counter_span;
		  		if(name_split[4] == ' png'){
			  		counter_span = question_div[k].previousElementSibling.getElementsByTagName('span')[0];
		  		}
			  	else{
			  		counter_span = question_div[k].previousElementSibling.previousElementSibling.getElementsByTagName('span')[0];
			  	}
				let num = parseInt(counter_span.innerHTML);
				counter_span.innerHTML = (num + 1).toString();			  		
		  	}
		}
	}
	// if(status == "both" || status == "watch"){
	// 	question_div = $('#questionSectionWatch').find('.q');
	// 	for (var k = 0; k < question_div.length; k++) {
	// 	  	if(question_div[k].innerHTML.toUpperCase().split('<')[0] == name_split[2].toUpperCase()) {
	// 	  		let counter_span;
	// 	  		if(name_split[4] == ' png'){
	// 		  		counter_span = question_div[k].previousElementSibling.getElementsByTagName('span')[0];
	// 	  		}
	// 		  	else{
	// 		  		counter_span = question_div[k].previousElementSibling.previousElementSibling.getElementsByTagName('span')[0];
	// 		  	}
	// 			let num = parseInt(counter_span.innerHTML);
	// 			counter_span.innerHTML = (num + 1).toString();			  		
	// 	  	}
	// 	}

	// }
}

//table cell click on watch page
let clickWatchV = () => {
	$('.watchv').click(function(e){
		let pathV = e.target.dataset.link;
		console.log('path---', pathV);
		if(pathV.indexOf('webm') != -1 || pathV.indexOf('mp4') != -1){
			$('#myWatchVideo').css('display', 'block');
			$('#watchI').css('display', 'none');
			// $('#watchI').attr("src", '');
			// $('#watchI').attr("class", '');
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
			path = pathV.substring(0, pathV.length - 4) + 'mkv';
			xhr.open("GET", 'file://' + path, true);
			xhr.send();
		} else if(pathV.indexOf('png') != -1) {
			wplayer.pause();
			$('#myWatchVideo').css('display', 'none');
			$('#watchI').css('display', 'block');
			$('#watchI').attr("src", 'file://' + pathV); 
			$('#watchI').attr("class", 'show');
		}
	})
}

//veiw all files for topic on watch page.
let clickWatchGuide = () => {
	$('#show_all').click((e) => {
		// console.log($('#questionSectionWatch h3').html());
		// $('#questionSectionWatch div').empty();
		// $('.file_table_body').empty();
		console.log('clickWatchGuide------');
		
		onceShowed = false;
		showAllMedias();
	});
}

let onceShowed = false;
let mediaCounter = 0;
let showAllMedias = () => {
	if(onceShowed == true) return;
	if(mediaCounter + 1 > $('.watchv').length){
		mediaCounter = 0;
		onceShowed = true;
		return;
	} 
	// console.log("counter--------", mediaCounter);
	let pathV = $('.watchv')[mediaCounter].dataset.link;
	console.log("--------", pathV);
	if(pathV.indexOf('webm') != -1 || pathV.indexOf('mp4') != -1){
		$('#myWatchVideo').css('display', 'block');
		$('#watchI').css('display', 'none');
		// $('#watchI').attr("src", '');
		// $('#watchI').attr("class", '');
		var xhr = new XMLHttpRequest();
		xhr.responseType = "blob";
		xhr.onload = function () {
			//var json = JSON.parse(xhr.responseText);
			//console.log(json);
			var a = URL.createObjectURL(xhr.response);
			// console.log('video', a)
			if(pathV.indexOf('webm') != -1) {
				wplayer.src({type:"video/webm", src: a});
			} else if(pathV.indexOf('mp4') != -1){
				wplayer.src({type:"video/mp4", src: a});
			}

		}
		path = pathV.substring(0, pathV.length - 4) + 'mkv';
		xhr.open("GET", 'file://' + path, true);
		xhr.send();
		wplayer.on('ended', function() {
			setTimeout(function(){ 
				// console.log("ended", mediaCounter);
				showAllMedias(++mediaCounter); 
			}, 1000);
		});
	} else if(pathV.indexOf('png') != -1) {
		$('#myWatchVideo').css('display', 'none');
		$('#watchI').css('display', 'block');
		$('#watchI').attr("src", 'file://' + pathV); 
		$('#watchI').attr("class", 'show');
		setTimeout(function(){ 
			// console.log("ended", mediaCounter);
			showAllMedias(++mediaCounter); 
		}, 5000);
	}
}





//this is a converting algorithm to convert webm to mp4 but it doesn't work.

// var workerPath = 'https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js';
// if(document.domain == 'localhost') {
//     workerPath = location.href.replace(location.href.split('/').pop(), '') + 'ffmpeg_asm.js';
// }

// function processInWebWorker() {
//     var blob = URL.createObjectURL(new Blob(['importScripts("' + workerPath + '");var now = Date.now;function print(text) {postMessage({"type" : "stdout","data" : text});};onmessage = function(event) {var message = event.data;if (message.type === "command") {var Module = {print: print,printErr: print,files: message.files || [],arguments: message.arguments || [],TOTAL_MEMORY: message.TOTAL_MEMORY || false};postMessage({"type" : "start","data" : Module.arguments.join(" ")});postMessage({"type" : "stdout","data" : "Received command: " +Module.arguments.join(" ") +((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")});var time = now();var result = ffmpeg_run(Module);var totalTime = now() - time;postMessage({"type" : "stdout","data" : "Finished processing (took " + totalTime + "ms)"});postMessage({"type" : "done","data" : result,"time" : totalTime});}};postMessage({"type" : "ready"});'], {
//         type: 'application/javascript'
//     }));

//     var worker = new Worker(blob);
//     URL.revokeObjectURL(blob);
//     return worker;
// }

// var worker;

// function convertStreams(videoBlob) {
//     var aab;
//     var buffersReady;
//     var workerReady;
//     var posted;
//     // let dataBlob;
//     console.log("videoBlob---", videoBlob);
//     // dataBlob = new Blob([typedArray.buffer], {type: mimeType})
//     var fileReader = new FileReader();
//     fileReader.onload = function() {
//         aab = this.result;
//         console.log("aab---", aab);
//         postMessage();
//     };
//     fileReader.readAsArrayBuffer(videoBlob);

//     if (!worker) {
//         worker = processInWebWorker();
//         // worker = new Worker('ffmpeg_asm.js');
//     }

//     worker.onmessage = function(event) {
//         var message = event.data;
//         console.log('message----', message);
//         if (message.type == "ready") {

//             workerReady = true;
//             if (buffersReady)
//                 postMessage();
//         } else if (message.type == "stdout") {
//             console.log(message.data);
//         } else if (message.type == "start") {
//         } else if (message.type == "done") {
//             // console.log(JSON.stringify(message));

//             var result = message.data[0];
//             console.log("result---", result);

//             var blob = new File([result.data], 'test.mp4', {
//                 type: 'video/mp4'
//             });

//             console.log("blob--", blob);
//             PostBlob(blob);
//         }
//     };
//     var postMessage = function() {
//         posted = true;
//         console.log('worker--', worker);
//         worker.postMessage({
// 	    type: 'command',
// 	    arguments: [
// 	       '-i', 'audiovideo.webm',
// 	       '-c:v', 'mpeg4',
// 	       '-c:a', 'aac', // or vorbis
// 	       '-b:v', '6400k',  // video bitrate
// 	       '-b:a', '4800k',  // audio bitrate
// 	       '-strict', 'experimental', 'audiovideo.mp4'
// 	     ],
// 	    files: [
// 	        {
// 	            data: new Uint8Array(aab),
// 	            name: 'audiovideo.webm'
// 	        }
// 	     ]
// 	    });

        
//     };
// }

// function PostBlob(blob) {
// 	console.log("blob created");
// 	var video = document.getElementById('myWatchVideo');
//     video.controls = true;

//     var source = document.createElement('source');
//     source.src = URL.createObjectURL(blob);
//     source.type = 'video/mp4; codecs=mpeg4';
//     video.appendChild(source);


// 	var user = items.selectedUser ? items.selectedUser.replace(/[\W_]+/g, '-').toLowerCase() : "user";
// 	var header = items.selectedQHeader ? items.selectedQHeader.replace(/[\W_]+/g, '-').toLowerCase() : "header";
// 	var question;
// 	if(items.selectedQuestion) {
// 		console.log('a ', items.selectedQuestion);
// 		var a = items.selectedQuestion.split(' (');
// 		question = a[0].replace(/[\W_]+/g, '-').toLowerCase();
// 		console.log(question);
// 	} else {
// 		question = 'question';
// 	}
// 	var dataURL = URL.createObjectURL(blob);

// 	var filename = user + "_" + header + "_" + question;
// 	var filenameValid = filename.replace(/\W/g, '-');
// 	var increment = "1";
// 	chrome.storage.sync.get(items.selectedQHeader, function(result) {
// 		console.log("Check user increment", result);
// 		if(result[items.selectedQHeader] && result[items.selectedQHeader][items.selectedQuestion] && result[items.selectedQHeader][items.selectedQuestion][items.selectedUser]){
// 			console.log("have one");
// 			increment = result[items.selectedQHeader][items.selectedQuestion][items.selectedUser];
// 		}

// 		filenameValid = filenameValid + '_Video-' + new Date().toLocaleString().replace(/\W/g, '-');


// 		chrome.runtime.sendMessage({greeting: {"data": dataURL, "name": filenameValid + "_.mp4"}}, function(response) {
// 			console.log('first-response----------', response);
// 			//Setup for next recording
// 			$('.vjs-record').click();
// 		});
// 		console.log(downloads, downloadTime);

// 		downloads.push(filenameValid + '_.mp4');
		
// 		downloadTime.push(new Date().toLocaleString());

// 		increaseIndividualCounter(filenameValid + '_.mp4');
// 		chrome.storage.sync.set({"downloadedVideo": downloads}, function() {
// 			//console.log('Value is set to ', items);				
// 		});
// 		chrome.storage.sync.set({"downloadedVideosTime": downloadTime}, function() {
// 			//console.log('Value is set to ', items);
// 		});
// 	});
    
// }






