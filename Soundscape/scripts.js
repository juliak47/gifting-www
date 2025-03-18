// ============================================
// Global Variables for Audio Context & Visualizer 
// (reference: https://developer.mozilla.org/en-US/docs/Web/API/AudioContext , 
// https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode)
// ============================================
var audioCtx, analyser, mixer, dataArray;

function initializeAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    mixer = audioCtx.createGain();
    mixer.gain.value = 1;
    mixer.connect(analyser);
    analyser.connect(audioCtx.destination);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    drawVisualizer();
  }
}

// Continuously fetch frequency data and update the visualizer.
function drawVisualizer() {
  analyser.getByteFrequencyData(dataArray);
  visualize(dataArray);
  requestAnimationFrame(drawVisualizer);
}

// ============================================
// Initialization & Core Features
// ============================================
document.addEventListener("DOMContentLoaded", function() {
  initializeAudioContext();

  // Hide welcome modal on click.
  const modal = document.getElementById("modal");
  modal.addEventListener("click", function() {
    modal.style.display = "none";
  });

  // Dark Mode Toggle.
  document.getElementById("darkModeToggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
  });

  // Meditation Timer.
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
        console.log("Timer ended, calling stopAll()");
        stopAll();
        display.textContent = "Time's up!";
      }
      timeLeft--;
    }, 1000);
  });
  updateBackground();
});

// ============================================
// Soundscape Functions (Forest, Ocean, Rain)
// ============================================
function toggleSound(soundId) {
  var audio = document.getElementById('audio-' + soundId);
  var container = document.getElementById('sound-' + soundId);
  var button = container.getElementsByTagName('button')[0];

  if (audio.paused) {
    // Resume the AudioContext if needed.
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    // Play the audio.
    audio.play().then(() => {
      button.textContent = '❚❚ Pause';
      container.classList.add('playing');
      // If not already connected, create a MediaElementSource and connect it to the mixer.
      if (!audio._source) {
         audio._source = audioCtx.createMediaElementSource(audio);
         audio._source.connect(mixer);
      }
    }).catch((e) => {
      console.error("Audio play error:", e);
    });
  } else {
    // Pause the audio.
    audio.pause();
    button.textContent = '► Play';
    container.classList.remove('playing');
  }
}

function setVolume(soundId, volume) {
  var audio = document.getElementById('audio-' + soundId);
  audio.volume = volume;
}

function stopAll() {
    console.log("stopAll() called");
    var audios = document.querySelectorAll("audio");
    audios.forEach(function(audio) {
      audio.pause();
      audio.currentTime = 0;
    });
    var buttons = document.querySelectorAll(".sound-button");
    buttons.forEach(function(button) {
      button.textContent = '► Play';
    });
    removeAll();
  }
  
  

// ============================================
// Audio Visualizer Code (Reference: https://codehs.com/tutorial/calvin/Visualizing_Music_with_JavaScript)
// ============================================

var canvas = document.getElementById("audioCanvas");
var ctx = canvas.getContext("2d");

// Helper functions for canvas drawing.
function getWidth() {
  return canvas.width;
}
function getHeight() {
  return canvas.height;
}
function removeAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function add(rect) {
  ctx.fillStyle = rect.color;
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
}

// "Class" for a rectangle (visualization bar).
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

// "Class" for an RGB color.
function Color(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
}
Color.prototype.toString = function() {
  return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
};

// Constants pulled from tutorial.
var GAP = 2;
var MAX_COLOR_VAL = 255;

// Visualizes the current audio frame by drawing vertical bars.
function visualize(frame) {
  removeAll();
  var barWidth = (getWidth() - GAP) / frame.length - GAP;
  for (var i = 0; i < frame.length; i++) {
    var barHeight = frame[i];
    var bar = new Rectangle(barWidth, barHeight);
    var x = GAP + (barWidth + GAP) * i;
    var y = getHeight() - barHeight; // Align bars at the bottom.
    var color = getColor(barHeight);
    bar.setPosition(x, y);
    bar.setColor(color);
    add(bar);
  }
}

// Returns a new Color object based on the bar height.
function getColor(barHeight) {
  var maxValue = 255;
  var blue = maxValue - barHeight;
  var green = barHeight;
  var red = 10;
  return new Color(red, blue, green);
}


// ============================================
// Background Update Function for Main Page
// ============================================
function updateBackground() {
    var hour = new Date().getHours();
    var bgImage;
    if (hour >= 6 && hour < 12) {
      bgImage = "url('morning.jpg')";
    } else if (hour >= 12 && hour < 18) {
      bgImage = "url('day.jpg')";
    } else if (hour >= 18 && hour < 20) {
      bgImage = "url('evening.jpg')";
    } else {
      bgImage = "url('night.jpg')";
    }
    document.body.style.backgroundImage = bgImage;
  }