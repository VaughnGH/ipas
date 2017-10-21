var playing = 0; //boolean
var instrument = 0, note = 0;
var sustain = 0, arpeggio = 0;

var NUM_INSTRUMENTS = 4, MIN_NOTE = 0, MAX_NOTE = 127; // Max 8 instruments

var canvas = document.getElementById("main");
var ctx = canvas.getContext("2d");
var mousePos = { x:0, y:0 };

const socket = getWebSocket();
socket.addEventListener('message', function (event) {
  console.log('message received: ', event.data);
});

// Source http://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html
function resizeCanvas() {
  var canvas = document.getElementById("main");
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight; // * 0.9;
  console.log("canvas size changed");
}
window.onload = resizeCanvas;

function submissionLoop(verbose=false) {
  setTimeout( function () {
    updateNote(verbose);
    updateInstrument(verbose);
    var result = 0;
    result |= playing << 15;
    result |= note << 8;
    result |= instrument << 5;
    result |= sustain << 2;
    result |= arpeggio;
    if (verbose) {
      console.log(result);
    }

    if (!(socket.readyState === socket.CLOSING || socket.readyState === socket.CLOSED)) {
      socket.send(result);
      submissionLoop(verbose);
    }

  }, 10);
}
setTimeout(submissionLoop, 1000, 1);

function updateNote(verbose=false) {
  //var x_pos = mousePos.x/canvas.width; //insrument
  var y_pos = 1 - mousePos.y/canvas.height;
  note = Math.max(MIN_NOTE, Math.round(MAX_NOTE * y_pos));
  if (verbose) {
    console.log("Note: %s", note);
  }
}
function updateInstrument(verbose=false) {
  var x_pos = mousePos.x/canvas.width; //insrument
  instrument = Math.round((NUM_INSTRUMENTS - 1) * x_pos);
  if (verbose) {
    console.log("Instrument: %s", instrument);
  }
}

canvas.addEventListener("mousedown", function (e) {
  playing = 1;
  mousePos = getMousePos(canvas, e);
}, false);
canvas.addEventListener("mouseup", function (e) {
  playing = 0;
}, false);
canvas.addEventListener("mousemove", function (e) {
    mousePos = getMousePos(canvas, e);
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
