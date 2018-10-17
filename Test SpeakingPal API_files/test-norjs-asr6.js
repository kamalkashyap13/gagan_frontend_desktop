(function (global) {

 callbackStatus = "";
var speakingPal = new SpApi();

function testAPI() {
	//speakingPal.initialize("test1@fake.com",fakeAuthToken(),initComplete, micCallback, "localhost");
	speakingPal.initialize("test1@fake.com",fakeAuthToken(),initComplete, micCallback, "asr7.speakingpal.com");
}

function fakeAuthToken() {
	var token = "52324020003007:52324020003007:2018-12-01T10:36:26";
	var eduKey = "Edu$aulty pepper";
	var hash = md5(token,eduKey);
	token = token + ':' + hash;
	console.log('Auth token set to: ' + token);
	return(token);
}


function initComplete(evt){
	console.log('InitComplete: got event msg=' + evt.msg);
	callbackStatus = "InitComplete: "+evt.msg;
	document.getElementById("callback").innerHTML = callbackStatus;
	// alert(12332);
	if (callbackStatus=="InitComplete: Success"){
		startWS()
			}
}

function micCallback(evt){
	callbackStatus = callbackStatus + " Mic: "+evt.msg;
	document.getElementById("callback").innerHTML = callbackStatus;
	// alert(23321);

}


var recLevelCount = 0;

function actualCallback(recLevel){
	var i;
	var recLevelString = "";
	var normRecLevel = Math.round(recLevel / 0.05);

	for(i=0; i<10; i++){
		if(normRecLevel > i){
			recLevelString+="*";
		} else {
			recLevelString+="_";
		}
	}
	document.getElementById("rec_level").innerText = recLevelString;
}

function extractSpScore(numStr){
	return Math.round((parseFloat(numStr) - Math.round(parseFloat(numStr)))*100);
}

function extractSpConfidence(numStr){
	return Math.round(parseFloat(numStr));
}

function processResult(resultXml){
	//alert(resultXml);
	alala = resultXml;
	resultXml = resultXml.replace(/\n/g, "");
	resultXml = resultXml.replace("</instance><input>","</instance><abba>");
	resultXml = resultXml.replace("</input></interpretation>","</abba></interpretation>");

	console.log("Changed XML: " + resultXml);

	parser = new DOMParser();
	xmlDoc = parser.parseFromString(resultXml,"text/xml");

	var spCombinedScore = xmlDoc.getElementsByTagName("interpretation")[0].getAttribute('score');
	var textToDisplay = "The sentence: '"
	+ xmlDoc.getElementsByTagName("instance")[0].childNodes[0].textContent
	+ "' score: " +  spCombinedScore
	+ "\n";

	x = xmlDoc.getElementsByTagName("input");
    for (i = 0; i < x.length; i++) {
		spCombinedScore = x[i].getAttribute('score');
        textToDisplay += "word #" + (i+1) + ": '"
			+ x[i].childNodes[0].nodeValue
			+ "' score: " +	spCombinedScore
			+ "\n";
    }


		$(".speakingpal_stuff").hide();
		$(".resultloud").show();

		$(".next_speaking").hide();
		$("#next_button").show();

		$("#resultloud_left1").show();
	  $("#resultloud_left2").hide();
		show_feedback(alala);
	return textToDisplay;
}

function testCallback2(evt){
	if(evt.err == 0) {
		var resultText = processResult(evt.data);
		//callbackStatus = "Recognition Result:\n" + evt.data + "\n";
		//alert(resultText);
		callbackStatus = "Recognition Result:\n" + resultText
			+ "\n\nScore Explanation:\n"
			+ "6 Perfect / Native speaker level\n"
			+ "5 Good / Correct pronunciation\n"
			+ "4 Decent / Minor mistakes or local accent\n"
			+ "3 Fair / Obvious mistakes, may be not recognized\n"
			+ "2 Poor / Incorrect pronunciation. Can be hardly recognized\n"
			+ "1 Bad / Try to improve\n";



		console.log('testcallback2: recresult text:' + resultText);
	} else {
		callbackStatus = "Recognition Result: Error " + evt.err + ":" + evt.msg + "\n";
	}
	console.log(callbackStatus);
	document.getElementById("callback").innerText = callbackStatus;
	document.getElementById("recimg").src = "record-button-off.gif";
	document.getElementById("rec_level").innerText = "__________";

	//startWS();
}

function testCallback3(){
	document.getElementById("recimg").src = "record-button.gif";
}


function openSockComplete(evt){
	callbackStatus = "\nOpenSocket: " + evt.data + "\n";
	document.getElementById("callback").innerText = callbackStatus;
	//alert(23321);
	document.getElementById("callback").innerText = 'start';
	//$("#result_option2").show();
	//recgnise_button
	$('.recgnise_button').attr('id', 'result_option2');
	$('.recgnise_button').css('background-color', '#00be67');
	$('.recgnise_button').css('cursor', 'pointer');
	$("#resultloud_left2").show();
	$("#resultloud_left0").hide();
}


function testRec(){
	var theSentence = document.getElementsByName("asr_sentence")[0].value;
	var theSentenceId = document.getElementById("sentence_id").innerText;
	var firstChar = theSentence.charAt(0);
	if(firstChar != '['){
		// assume one sentence with no grammar structure, wrap with grammar brackets
		theSentence = "[(" + theSentence + ")]";
	}
	console.log("Entered testRec, asr_sentence: " + theSentence);
	document.getElementById("callback").innerText = "";
	//speakingPal.recognize("[(hi i come here every year)]","123",actualCallback,testCallback2);
	//alert(theSentence,theSentenceId,firstChar)
	speakingPal.recognize(theSentence,theSentenceId,actualCallback,testCallback2,testCallback3,20000);
	//document.getElementById("recimg").src = "record-button.gif";

}

function startWS(){
	console.log("Entered startWS");
	// alert("Entered startWS");
	speakingPal.prepare(openSockComplete);

	var dateObj = new Date(Date.now());
	var timeNow = dateObj.getHours() + "_" + dateObj.getMinutes() + "_" + dateObj.getSeconds();
	document.getElementById("sentence_id").innerText = "rec_" + timeNow + ".pcm";
}

function destroyAPI(){
	console.log("Entered destroyAPI");
	speakingPal.destroy();
}

function saveAudio(){
	console.log("Entered saveAudio");
	speakingPal.saveRecordedAudio();
}

function stopAPI(){
	console.log("Entered stop");
	speakingPal.stop();
}

global["testAPI"] = testAPI;
global["testRec"] = testRec;
global["startWS"] = startWS;
global["stopAPI"] = stopAPI;
global["destroyAPI"] = destroyAPI;
global["saveAudio"] = saveAudio;

}(this));
