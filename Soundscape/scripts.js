var activeVisualizer = null; // Stores the audio element currently being visualized

// ============================================
// Initialization & Core Features
// ============================================
document.addEventListener("DOMContentLoaded", function() {
  // Hide welcome modal on click
  const modal = document.getElementById("modal");
  modal.addEventListener("click", function() {
    modal.style.display = "none";
  });

  // Dark Mode Toggle
  document.getElementById("darkModeToggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
  });

  // Meditation Timer
  let timerInterval;
  document.getElementById('startTimer').addEventListener('click', function() {
    const minutes = parseInt(document.getElementById('timerInput').value);
    if (isNaN(minutes) || minutes <= 0) return;
    let timeLeft = minutes * 60;
    const display = document.getElementById('timerDisplay');
    clearInterval(timerInterval);
    timerInterval = setInterval(function() {
      const m = Math.floor(timeLeft / 60);
      const s = timeLeft % 60;
      display.textContent = m + "m " + s + "s remaining";
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        stopAll();
        display.textContent = "Time's up!";
      }
      timeLeft--;
    }, 1000);
  });
});

// ============================================
// Soundscape Functions (Forest, Ocean, Rain)
// ============================================
function toggleSound(soundId) {
  var audio = document.getElementById('audio-' + soundId);
  var container = document.getElementById('sound-' + soundId);
  var button = container.getElementsByTagName('button')[0];

  if (audio.paused) {
    // Play the audio
    audio.play().then(() => {
      button.textContent = '❚❚ Pause';
      container.classList.add('playing');

      // If this audio isn't already the active visualizer, hook it up.
      if (activeVisualizer !== audio) {
        activeVisualizer = audio;
        // Start the visualizer for this audio element.
        audioChangeMethod(audio, visualize);
      }
    }).catch((e) => {
      console.error("Audio play error:", e);
    });
  } else {
    // Pause the audio and clear visualizer if this audio is active
    audio.pause();
    button.textContent = '► Play';
    container.classList.remove('playing');
    if (activeVisualizer === audio) {
      activeVisualizer = null;
      removeAll();
    }
  }
}

function setVolume(soundId, volume) {
  var audio = document.getElementById('audio-' + soundId);
  audio.volume = volume;
}

function stopAll() {
  var sounds = document.querySelectorAll('.sound');
  sounds.forEach(function(soundDiv) {
    var soundId = soundDiv.id.replace('sound-', '');
    var audio = document.getElementById('audio-' + soundId);
    audio.pause();
    audio.currentTime = 0;
    var button = soundDiv.getElementsByTagName('button')[0];
    button.textContent = '► Play';
    soundDiv.classList.remove('playing');
  });
  activeVisualizer = null;
  removeAll();
}

// ============================================
// Audio Visualizer Code (Tutorial Integration)
// ============================================

// Get the canvas and its context
var canvas = document.getElementById("audioCanvas");
var ctx = canvas.getContext("2d");

// Helper functions for canvas drawing
function getWidth() {
  return canvas.width;
}

function getHeight() {
  return canvas.height;
}

// Clears the canvas
function removeAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Draws a rectangle (bar) on the canvas
function add(rect) {
  ctx.fillStyle = rect.color;
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
}

// "Class" for a rectangle (visualization bar)
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.x = 0;
  this.y = 0;
  this.color = "#000";
}
Rectangle.prototype.setPosition = function(x, y) {
  this.x = x;
  this.y = y;
};
Rectangle.prototype.setColor = function(colorObj) {
  this.color = colorObj.toString();
};

// "Class" for an RGB color
function Color(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
}
Color.prototype.toString = function() {
  return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
};

// audioChangeMethod: sets up an AudioContext and Analyser to call a callback with frame data
function audioChangeMethod(audio, callback) {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  var source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  var dataArray = new Uint8Array(analyser.frequencyBinCount);

  function draw() {
    analyser.getByteFrequencyData(dataArray);
    callback(dataArray);
    requestAnimationFrame(draw);
  }
  draw();
}

// Constants
var GAP = 2;
var MAX_COLOR_VAL = 255;

/**
 * Visualizes the current audio frame by drawing vertical bars.
 * Each bar's height corresponds to the loudness at that frequency.
 */
function visualize(frame) {
  removeAll();
  var barWidth = (getWidth() - GAP) / frame.length - GAP;
  
  // Loop through each number in the frame array and draw a bar
  for (var i = 0; i < frame.length; i++) {
    var barHeight = frame[i];
    var bar = new Rectangle(barWidth, barHeight);
    var x = GAP + (barWidth + GAP) * i;
    var y = getHeight() - barHeight; // Align bars at the bottom of the canvas
    var color = getColor(barHeight);
    bar.setPosition(x, y);
    bar.setColor(color);
    add(bar);
  }
}

/**
 * Returns a new Color object based on the bar height.
 * Larger bar heights result in a more blue color; smaller values lean red.
 */
function getColor(barHeight) {
  var maxValue = 255;
  var red = maxValue - barHeight;
  var blue = barHeight;
  var green = maxValue;
  return new Color(red, blue, green);
}
