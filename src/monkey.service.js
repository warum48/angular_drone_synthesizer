function MonkeyService() {
  var MonkeyService = {};

  /*var _webkitAC = window.hasOwnProperty('webkitAudioContext');
    var _AC = window.hasOwnProperty('AudioContext');

    if (!_webkitAC && !_AC) {
        throw new Error('Error: Web Audio API is not supported on your browser.');
    }
    else {
        if (_webkitAC && !_AC) {
            window.AudioContext = window.webkitAudioContext;
        }
    }

    if (typeof AudioContext.prototype.createGain !== "function") {
        AudioContext.prototype.createGain = AudioContext.prototype.createGainNode;
    }
    if (typeof AudioContext.prototype.createDelay !== "function") {
        AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode;
    }
    if (typeof AudioContext.prototype.createPeriodicWave !== "function") {
        AudioContext.prototype.createPeriodicWave = AudioContext.prototype.createWaveTable;
    }
    if (typeof AudioBufferSourceNode.prototype.start !== "function") {
        AudioBufferSourceNode.prototype.start = AudioBufferSourceNode.prototype.noteGrainOn;
    }
    if (typeof AudioBufferSourceNode.prototype.stop !== "function") {
        AudioBufferSourceNode.prototype.stop = AudioBufferSourceNode.prototype.noteOff;
    }
    if (typeof OscillatorNode.prototype.start !== "function") {
        OscillatorNode.prototype.start = OscillatorNode.prototype.noteOn;
    }
    if (typeof OscillatorNode.prototype.stop !== "function") {
        OscillatorNode.prototype.stop = OscillatorNode.prototype.noteOff;
    }
    if (typeof OscillatorNode.prototype.setPeriodicWave !== "function") {
        OscillatorNode.prototype.setPeriodicWave = OscillatorNode.prototype.setWaveTable;
    }*/

  function fixSetTarget(param) {
    if (!param) // if NYI, just return
      return;
    if (!param.setTargetValueAtTime)
      param.setTargetValueAtTime = param.setTargetAtTime;
  }

  if (window.hasOwnProperty('AudioContext') /*&& !window.hasOwnProperty('webkitAudioContext') */ ) {
    window.webkitAudioContext = AudioContext;

    if (!AudioContext.prototype.hasOwnProperty('internal_createGain')) {
      AudioContext.prototype.internal_createGain = AudioContext.prototype.createGain;
      AudioContext.prototype.createGain = function() {
        var node = this.internal_createGain();
        fixSetTarget(node.gain);
        return node;
      };
    }

    if (!AudioContext.prototype.hasOwnProperty('internal_createDelay')) {
      AudioContext.prototype.internal_createDelay = AudioContext.prototype.createDelay;
      AudioContext.prototype.createDelay = function() {
        var node = this.internal_createDelay();
        fixSetTarget(node.delayTime);
        return node;
      };
    }

    if (!AudioContext.prototype.hasOwnProperty('internal_createBufferSource')) {
      AudioContext.prototype.internal_createBufferSource = AudioContext.prototype.createBufferSource;
      AudioContext.prototype.createBufferSource = function() {
        var node = this.internal_createBufferSource();
        if (!node.noteOn)
          node.noteOn = node.start;
        if (!node.noteGrainOn)
          node.noteGrainOn = node.start;
        if (!node.noteOff)
          node.noteOff = node.stop;
        fixSetTarget(node.playbackRate);
        return node;
      };
    }

    if (!AudioContext.prototype.hasOwnProperty('internal_createDynamicsCompressor')) {
      AudioContext.prototype.internal_createDynamicsCompressor = AudioContext.prototype.createDynamicsCompressor;
      AudioContext.prototype.createDynamicsCompressor = function() {
        var node = this.internal_createDynamicsCompressor();
        fixSetTarget(node.threshold);
        fixSetTarget(node.knee);
        fixSetTarget(node.ratio);
        fixSetTarget(node.reduction);
        fixSetTarget(node.attack);
        fixSetTarget(node.release);
        return node;
      };
    }

    if (!AudioContext.prototype.hasOwnProperty('internal_createBiquadFilter')) {
      AudioContext.prototype.internal_createBiquadFilter = AudioContext.prototype.createBiquadFilter;
      AudioContext.prototype.createBiquadFilter = function() {
        var node = this.internal_createBiquadFilter();
        fixSetTarget(node.frequency);
        fixSetTarget(node.detune);
        fixSetTarget(node.Q);
        fixSetTarget(node.gain);
        var enumValues = ['LOWPASS', 'HIGHPASS', 'BANDPASS', 'LOWSHELF', 'HIGHSHELF', 'PEAKING', 'NOTCH', 'ALLPASS'];
        for (var i = 0; i < enumValues.length; ++i) {
          var enumValue = enumValues[i];
          var newEnumValue = enumValue.toLowerCase();
          if (!node.hasOwnProperty(enumValue)) {
            node[enumValue] = newEnumValue;
          }
        }
        return node;
      };
    }

    if (!AudioContext.prototype.hasOwnProperty('internal_createOscillator') &&
      AudioContext.prototype.hasOwnProperty('createOscillator')) {
      AudioContext.prototype.internal_createOscillator = AudioContext.prototype.createOscillator;
      AudioContext.prototype.createOscillator = function() {
        var node = this.internal_createOscillator();
        if (!node.noteOn)
          node.noteOn = node.start;
        if (!node.noteOff)
          node.noteOff = node.stop;
        fixSetTarget(node.frequency);
        fixSetTarget(node.detune);
        var enumValues = ['SINE', 'SQUARE', 'SAWTOOTH', 'TRIANGLE', 'CUSTOM'];
        for (var i = 0; i < enumValues.length; ++i) {
          var enumValue = enumValues[i];
          var newEnumValue = enumValue.toLowerCase();
          if (!node.hasOwnProperty(enumValue)) {
            node[enumValue] = newEnumValue;
          }
        }
        if (!node.hasOwnProperty('setWaveTable')) {
          node.setWaveTable = node.setPeriodicTable;
        }
        return node;
      };
    }

    if (!AudioContext.prototype.hasOwnProperty('internal_createPanner')) {
      AudioContext.prototype.internal_createPanner = AudioContext.prototype.createPanner;
      AudioContext.prototype.createPanner = function() {
        var node = this.internal_createPanner();
        var enumValues = {
          'EQUALPOWER': 'equalpower',
          'HRTF': 'HRTF',
          'LINEAR_DISTANCE': 'linear',
          'INVERSE_DISTANCE': 'inverse',
          'EXPONENTIAL_DISTANCE': 'exponential',
        };
        for (var enumValue in enumValues) {
          var newEnumValue = enumValues[enumValue];
          if (!node.hasOwnProperty(enumValue)) {
            node[enumValue] = newEnumValue;
          }
        }
        return node;
      };
    }

    if (!AudioContext.prototype.hasOwnProperty('createGainNode'))
      AudioContext.prototype.createGainNode = AudioContext.prototype.createGain;
    if (!AudioContext.prototype.hasOwnProperty('createDelayNode'))
      AudioContext.prototype.createDelayNode = AudioContext.prototype.createDelay;
    if (!AudioContext.prototype.hasOwnProperty('createJavaScriptNode'))
      AudioContext.prototype.createJavaScriptNode = AudioContext.prototype.createScriptProcessor;
    if (!AudioContext.prototype.hasOwnProperty('createWaveTable'))
      AudioContext.prototype.createWaveTable = AudioContext.prototype.createPeriodicWave;
  }

  if (window.hasOwnProperty('OfflineAudioContext')
    /*&& !window.hasOwnProperty('webkitOfflineAudioContext') */
  ) {
    window.webkitOfflineAudioContext = OfflineAudioContext;
  }
  
  
  

  return MonkeyService;
}


angular
  .module('droneSynthApp')
  .factory('MonkeyService', MonkeyService);