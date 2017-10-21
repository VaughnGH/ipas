var context = new (window.AudioContext || window.webkitAudioContext)();
var osc = context.createOscillator(); // instantiate an oscillator
var types = ['sine', 'square', 'sawtooth', 'triangle']
osc.type = 'sine'; // this is the default - also square, sawtooth, triangle
osc.frequency.value = 440; // Hz
osc.connect(context.destination); // connect it to the destination

function reinitOsc() {
  osc = context.createOscillator(); // instantiate an oscillator
  osc.connect(context.destination); // connect it to the destination
  osc_running = false;
}

const socket = getWebSocket();
socket.addEventListener('message', function (event) {
  console.log('message received: ', event.data);
});

// Source http://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html
function resizeCanvas() {
  var canvas = document.getElementById("main");
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight * 0.9;
  console.log("canvas size changed");
}
window.onload = resizeCanvas;
var canvas = document.getElementById("main");
var ctx = canvas.getContext("2d");

var playing = false;
var osc_running = false;
var mousePos = { x:0, y:0 };

function audioLoop() {
  setTimeout( function () {
    var coords = getRelativeCoords();
    augmentAudio(coords.x, coords.y);
    audioLoop();
  }, 25);
}
function submissionLoop() {
  setTimeout( function () {
    var coords = getRelativeCoords(1);
    if (!(socket.readyState === socket.CLOSING || socket.readyState === socket.CLOSED)) {
      socket.send(JSON.stringify(coords));
      submissionLoop(1);
    }

  }, 10);
}
audioLoop();
setTimeout(submissionLoop, 1000);
function getRelativeCoords(verbose=false) {
  var x_pos = 1 - mousePos.x/canvas.clientWidth;
  var y_pos = 1 - mousePos.y/canvas.clientHeight;
  if (verbose) {
    console.log("(%s, %s)", x_pos, y_pos);
  }
  augmentAudio(x_pos, y_pos);

  return {
    x : x_pos,
    y : y_pos
  }
}
function augmentAudio(x_pos, y_pos) {
  if (playing) {
    if (!osc_running) {
      osc_running = true;
      try {
        osc.start(); // start the oscillator
      } catch (e) {
        reinitOsc();
      }
    }
    osc.frequency.value = 800 * y_pos + 1; // Hz
    osc.type = types[Math.round(3*x_pos)];
  } else {
    if (osc_running) {
      osc_running = false;
      try {
        osc.stop(); // stop the oscillator
      } catch (e) {
       reinitOsc(); 
      }
    }
  }
}
canvas.addEventListener("mousedown", function (e) {
  playing = true;
  mousePos = getMousePos(canvas, e);
  //console.log("MD : (%s,%s)", mousePos.x, mousePos.y);
}, false);
canvas.addEventListener("mouseup", function (e) {
  playing = false;
  //console.log("MU");
}, false);
canvas.addEventListener("mousemove", function (e) {
  if (playing) {
    mousePos = getMousePos(canvas, e);
    //console.log("MM : (%s,%s)", mousePos.x, mousePos.y);
  }
}, false);

// Get the position of the mouse relative to the canvas
function getMousePos(canvasDom, mouseEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: mouseEvent.clientX - rect.left,
    y: mouseEvent.clientY - rect.top
  };
}

canvas.addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(canvas, e);
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchend", function (e) {
  var mouseEvent = new MouseEvent("mouseup", {});
  canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchmove", function (e) {
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}, false);

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}

// Prevent scrolling when touching the canvas
document.body.addEventListener("touchstart", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchend", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchmove", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
