<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>Eye Detector</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <html>
  <head>

    <meta charset="utf-8">
    <meta http-equiv="Cache-control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    <title>Eye Detector</title>

    <script src="https://cdn.jsdelivr.net/npm/p5@1.8.0/lib/p5.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/p5@latest/lib/addons/p5.dom.min.js"></script>
    <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet">
    <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script>

    <script language="javascript" type="text/javascript" src="https://cdn.jsdelivr.net/npm/p5.serialserver@0.0.28/lib/p5.serialport.js"></script>

  </head>
  <body>

    <div id="liveView" class="videoView">
      <!-- BUTTON -->
      <button id="webcamButton" class="mdc-button mdc-button--raised">
        <span class="mdc-button__ripple"></span>
        <span class="mdc-button__label">ENABLE WEBCAM</span>
      </button>
      <!-- CAMERA OUTPUT -->
      <div style="position: relative;">
        <video id="webcam" style="position: abso" autoplay playsinline></video>
        <canvas class="output_canvas" id="output_canvas" style="position: absolute; left: 0px; top: 0px;"></canvas>
      </div>
    </div>

    <audio id="intro" src="audio/first.wav"></audio>
    <audio id="repeat" src="audio/repeat.wav"></audio>

    <!-- LANDMARKERS -->
    <div class="blend-shapes">
      <ul class="blend-shapes-list" id="video-blend-shapes"></ul>
    </div>

    <button onclick="myFunction()">Click me</button>

  </body>
  
  <script type="module" src="script.js"></script>
  <script type="text/javascript">
    
    let serial;
    let outByte = "";
    let data;
    let categoryName3;
    let categoryName9;
    let categoryName10;
    let score3;
    let score9;
    let score10;
    let running = false;
    let overrideKey = null;
    let consecutiveCCount = 0;
    let initialCloseInterval;
    let lastSendTime = 0;
    const sendInterval = 1000;
    let intervalRunning = true;

    const audio = document.getElementById("intro");

    function setup() {
      createCanvas(320, 260);
      serial = new p5.SerialPort();
      serial.open('/dev/tty.usbmodem101');
      serial.on('connected', serverConnected);
      serial.on('list', gotList);
      serial.on('data', gotData);
      serial.on('error', gotError);
      serial.on('open', gotOpen);
      serial.on('close', gotClose);
    }

    function gotList(thelist) {
      print("List of Serial Ports:");
      for (let i = 0; i < thelist.length; i++) {
        print(i + " " + thelist[i]);
      }
    }

    function gotClose() {
      print("Serial Port is Closed");
      latestData = "Serial Port is Closed";
    }

    function gotData() {
      let currentString = serial.readLine();
      trim(currentString);
      if (!currentString) return;
      console.log(currentString);
      latestData = currentString;
    }

    function gotOpen() {
      print("Serial Port is Open");
    }

    function gotError(theerror) {
      print(theerror);
    }

    function serverConnected() {
      print("Connected to Server");
    }

    function myFunction() {
      // serial.write('T');
      audio.currentTime = 198;
      console.log("my function");
    }

// MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN
// MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN

let curtainsOpened = false;
let eyeStateValue = '';
let prelude_running = false;
let intro_ran = false;
let sendEyeState = false;
let stageFrontState = "Theatre";

function drawBlendShapes(el, blendShapes) {
  if (!blendShapes || blendShapes.length < 1) {
    // send("X");
    document.body.style.backgroundColor = "black";
    if (running) {reset();}
    return;
  } else {run();}

  data = blendShapes[0];
  categoryName3 = data.categories[3].categoryName;
  categoryName9 = data.categories[9].categoryName;
  categoryName10 = data.categories[10].categoryName;
  score3 = data.categories[3].score;
  score9 = data.categories[9].score;
  score10 = data.categories[10].score;
}

function eyeState() {
  if (score9 > 0.5 || score10 > 0.5) {
    eyeStateValue = 'C';
    if(audio.paused){
      audio.play();
      repeat.pause();
    }
    if(sendEyeState == true){serial.write(eyeStateValue);}
    console.log(eyeStateValue);
    document.body.style.backgroundColor = "green";
  } else {
    eyeStateValue = 'O';
    if(repeat.paused){
      audio.pause();
      repeat.currentTime = 0;
      repeat.play(); 
    }
    if(sendEyeState == true){serial.write(eyeStateValue);}
    console.log(eyeStateValue);
    document.body.style.backgroundColor = "white";
  }
}

function run() {
  document.body.style.backgroundColor = "white";
  running = true;
  console.log(audio.currentTime);

  if(intro_ran == false){
    if (audio.paused) {audio.play();}

    if (audio.currentTime > 19) { //ANNOUCEMENT FINISHED
      audio.pause();
      repeat.loop = true;
      if(repeat.paused) {repeat.play();}
      
      eyeState();

      if(prelude_running == false){
        if (eyeStateValue === 'C') {setTimeout(() => {
          if (eyeStateValue === 'C') {
            setInterval(eyeState, 300);
            prelude();
          }}, 2000);}}
    }
  }

  if (audio.currentTime > 200) {
    console.log("CHANGE STAGEFRONT");
    serial.write('U');
    stageFrontState = "Universe";
  }

  if (audio.currentTime > 237) {
    console.log("FIN");
    reset();
  }
}

function prelude(){
  console.log('ENTERED PRELUDE')
  intro_ran = true;
  prelude_running = true;
  repeat.pause();
  audio.play();

  setTimeout(() => {
    if(curtainsOpened == false){
      serial.write('1');
      console.log("OPEN CURTAINS");
      curtainsOpened = true;
      sendEyeState = true;
    }}, 29000);
}


function reset() {
  console.log("RESET");
  audio.pause();
  repeat.pause();
  audio.currentTime = 0;
  repeat.currentTime = 0;
  running = false;
  sendEyeState = false;

  if(curtainsOpened == true){
    serial.write('2');
    console.log("CLOSE CURTAINS");
    curtainsOpened = false;
  }

  if(stageFrontState == "Universe"){
    serial.write('T');
    console.log("Theatre");
    stageFrontState = "Theatre";
  }

}

  </script>
</body>
</html>