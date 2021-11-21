function EffectsService($rootScope, $location) {
  var EffectsService = {};
  var context;
  var gain;
  var tuna;

  var convolver = null;
  var overdrive = null;
  var tremolo = null;
  var moog = null;

  //BE LIKE GOD! https://69lt1.csb.app/#?godmode=true
  console.log("hash" + $location.search().godmode);

  //var isGodMode = true;
  var isGodMode = false;
  console.log("GOOOOOOD", $location.search().godmode);
  if ($location.search().godmode == "true") {
    isGodMode = true;
  }

  var curStateOb = {
    overdrive: {
      algorithmIndex: 0,
      knob_level: 50,
      curveAmount: 0.5,
      bypass: 0
    },
    convolver: {
      IRindex: 0,
      wetLevel: 0.05,
      dryLevel: 0.95,
      knob_level: 5,
      bypass: 0
    },
    tremolo: {},
    moog: {}
  };

  /* var effects = [
         {name:
         ]*/
  var testPreset = {
    overdrive: {
      algorithmIndex: 2
    },
    convolver: {
      wetLevel: 0.42,
      dryLevel: 0.5800000000000001,
      knob_level: 42
    },
    tremolo: {
      intensity: 0.48,
      knob_intensity: 48,
      rate: 3.84,
      knob_rate: 48
    },
    moog: {
      resonance: 2.04,
      knob_resonance: 51
    }
  };

  var effectsList = ["main"];
  /*["main","reverb",
        "tremolo",
        "overdrive"];*/
  var nodesList = [];

  var impulsesAr = [
    {
      file: "src/impulses/impulse_rev.wav",
      name: "Tuna"
    },
    {
      file: "src/impulses/960-BigEmptyChurch.mp3",
      name: "BigChurch"
    },
    {
      file: "src/impulses/SPX990-Reflections.mp3",
      name: "Reflections"
    },
    {
      file: "src/impulses/H3000-ReverseGate.mp3",
      name: "ReverseGate"
    },
    {
      file: "src/impulses/H3000-MetalVerb.mp3",
      name: "MetalVerb"
    } /*{
        file: 'impulses/zoot.wav',
        name: "Zoot"
    }, {
        file: 'impulses/zing-long-stereo.wav',
        name: "ZingLong"
    }, {
        file: 'impulses/spatialized1.wav',
        name: "Spatialized1"
    }, {
        file: 'impulses/sifter.wav',
        name: "Sifted"
    }, {
        file: 'impulses/peculiar-backwards.wav',
        name: "Peculiar"
    }*/,
    {
      file: "src/impulses/960-BriteStage.mp3",
      name: "BriteStage"
    },
    {
      file: "src/impulses/960-LargeBrightRoom.mp3",
      name: "BrightRoom"
    },
    {
      file: "src/impulses/960-LargePlate.mp3",
      name: "LargePlate"
    },
    {
      file: "src/impulses/SPX990-ElecSNRPlate.mp3",
      name: "ElecSNRPlate"
    },
    {
      file: "src/impulses/UAD140-AcousticAmbience.mp3",
      name: "AcousticAmbience"
    },
    {
      file: "src/impulses/UAD140-MasterPlate.mp3",
      name: "MasterPlate"
    }
  ];

  // DS.noiseGenInput = tremolo;

  EffectsService.init = function (context, gain) {
    this.gain = gain;
    context = context;
    tuna = new Tuna(context);

    nodesList.push(gain);

    //-----------------REVERB_______________________

    convolver = new tuna.Convolver({
      highCut: 22050, //20 to 22050
      lowCut: 20, //20 to 22050
      dryLevel: 1, //0 to 1+
      wetLevel: 0.2, //0 to 1+
      level: 1, //0 to 1+, adjusts total output of both wet and dry
      impulse: "impulses/impulse_rev.wav", //the path to your impulse response
      bypass: 0
    });
    convolver.IRindex = 0;
    //console.log('EFFINITED');
    //gain.connect(chorus);

    convolver.connect(gain);
    nodesList.push(convolver);
    effectsList.push("reverb");

    //----------------MOOG__________________________
    if (isGodMode) {
      moog = new tuna.MoogFilter({
        cutoff: 0.065, //0 to 1
        resonance: 3.5, //0 to 4
        bufferSize: 4096, //256 to 16384
        bypass: 1
      });

      //moog.connect(convolver); //
      moog.connect(nodesList[nodesList.length - 1]); // 1
      nodesList.push(moog);
      effectsList.push("moog");

      //-----------------TREMOLO_____________________

      tremolo = new tuna.Tremolo({
        intensity: 0.3, //0 to 1
        rate: 1, //0.001 to 8
        stereoPhase: 0, //0 to 180
        bypass: 1
      });
      // tremolo.connect(convolver);
      tremolo.connect(nodesList[nodesList.length - 1]);

      nodesList.push(tremolo);
      effectsList.push("tremolo");

      // overdrive.connect(tremolo);
    }
    /*else{
                    overdrive.connect(convolver);
                }*/

    //-----------------OVERDRIVE____________________

    overdrive = new tuna.Overdrive({
      outputGain: 0.001, //0 to 1+
      drive: 0.9, //0 to 1
      curveAmount: 0.7, //0 to 1
      algorithmIndex: 0, //0 to 5, selects one of our drive algorithms
      bypass: 0
    });

    /*defs:
        outputGain: 0.5,         //0 to 1+
    drive: 0.7,              //0 to 1
    curveAmount: 1*/

    overdrive.connect(nodesList[nodesList.length - 1]);

    nodesList.push(overdrive);
    effectsList.push("overdrive");

    /*effectsList = ["main","reverb",
    "tremolo",
    "overdrive"];*/

    ////console.log('gain' + gain);
  };

  EffectsService.toggleBypass = function (num) {
    if (nodesList[num].bypass == 0) {
      nodesList[num].bypass = 1;
    } else {
      nodesList[num].bypass = 0;
    }
    curStateOb.overdrive.bypass = nodesList[0].bypass;
    curStateOb.convolver.bypass = nodesList[1].bypass;
  };

  EffectsService.getInputNode = function (context, gain) {
    //return tremolo;
    //return overdrive;
    return convolver;
  };
  EffectsService.getSkipTremoloInputNode = function (context, gain) {
    return convolver;
  };
  EffectsService.changeInpulseResp = function (index) {
    //console.log('index' + index)
    /* // //////console.log('convolver'+convolver);
         convolver.impulse = impulsesAr[index];
         convolver.disconnect();
         ////console.log('gain'+this.gain);
         convolver.connect(this.gain);
         ////console.log('impulsesAr'+impulsesAr);*/
    convolver.disconnect();
    convolver = new tuna.Convolver({
      highCut: 22050, //20 to 22050
      lowCut: 20, //20 to 22050
      dryLevel: 0, //0 to 1+
      wetLevel: 1, //0 to 1+
      level: 1, //0 to 1+, adjusts total output of both wet and dry
      impulse: impulsesAr[index].file, //the path to your impulse response
      bypass: 0
    });
    curStateOb.convolver.IRindex = index;
    /* convolver.connect(this.gain);
        tremolo.connect(convolver);
        overdrive.connect(tremolo);*/
    nodesList[1] = convolver;
    for (var i = 1; i < nodesList.length; i++) {
      nodesList[i].connect(nodesList[i - 1]);
    }
  };
  EffectsService.getInpulseResp = function (index) {
    return curStateOb.convolver.IRindex;
  };
  EffectsService.getIRs = function () {
    return impulsesAr;
  };
  EffectsService.getEffectsList = function () {
    ////console.log('effectsList' + effectsList);
    return effectsList;
  };
  EffectsService.getNodesList = function () {
    //////console.log('effectsList'+effectsList);
    return nodesList;
  };
  EffectsService.changeOverDriveType = function (index) {
    overdrive.algorithmIndex = index;
    curStateOb.overdrive.algorithmIndex = index;
    ////console.log('odind' + index);
    $("#overdrive_amount").trigger("configure", {
      readOnly: true
    });
  };
  EffectsService.getOverDriveType = function () {
    ////console.log('curStateOb.overdrive.algorithmIndex'+curStateOb.overdrive.algorithmIndex);
    return curStateOb.overdrive.algorithmIndex;
  };
  EffectsService.getCurState = function () {
    /* var effectsObj = {
            overdrive:{
                algorithmIndex:overdrive.algorithmIndex
            },
            convolver:{
                impulse:convolver.impulse,
                dryLevel:convolver.dryLevel, //0 to 1+
                wetLevel:convolver.wetLevel,
                IRindex:convolver.IRindex
            }
        };
        ////console.log(angular.fromJson(effectsObj));
        return effectsObj;*/
    return curStateOb;
  };

  EffectsService.parsePreset = function (obj) {
    //console.log('obj.overdrive.algorithmIndex'+obj.overdrive.algorithmIndex);
    //console.log('obj.convolver.IRindex'+obj.convolver.IRindex)
    EffectsService.changeOverDriveType(obj.overdrive.algorithmIndex);
    // setTimeout(function(){
    EffectsService.changeInpulseResp(Number(obj.convolver.IRindex));
    $rootScope.$broadcast("convolverChange", {
      // index: attrs.index
    });
    // //console.log('obj.convolver.IRindex'+obj.convolver.IRindex);
    // }, 5000);
    //console.log('obj.convolver.wetLevel'+obj.convolver.wetLevel);
    //console.log('obj.convolver.dryLevel'+obj.convolver.dryLevel);
    convolver.wetLevel = obj.convolver.wetLevel;
    convolver.dryLevel = obj.convolver.dryLevel;

    overdrive.bypass = obj.overdrive.bypass;
    convolver.bypass = obj.convolver.bypass;

    $("#overdrive_amount").val(obj.overdrive.knob_level).trigger("change");
    $("#reverb_wetdry").val(obj.convolver.knob_level).trigger("change");

    if (isGodMode) {
      tremolo.intensity = obj.tremolo.intensity;
      tremolo.rate = obj.tremolo.rate;

      moog.resonance = obj.moog.resonance;

      moog.bypass = obj.moog.bypass;
      tremolo.bypass = obj.tremolo.bypass;

      $("#tremolo_rate").val(obj.tremolo.knob_rate).trigger("change");
      $("#tremolo_intensity").val(obj.tremolo.knob_intensity).trigger("change");

      $("#moog_resonance").val(obj.moog.knob_resonance).trigger("change");
    }

    curStateOb = obj;

    //console.log('obj'+obj);
  };

  /* $(function() {
         $(".dial").knob();
     });*/
  $(function () {
    $("#reverb_wetdry").knob({
      change: function (v) {
        convolver.wetLevel = v / 100;
        convolver.dryLevel = 1 - v / 100;

        curStateOb.convolver.wetLevel = v / 100;
        curStateOb.convolver.dryLevel = 1 - v / 100;
        curStateOb.convolver.knob_level = v;
      }
    });
    $("#overdrive_amount").knob({
      change: function (v) {
        overdrive.curveAmount = v / 100;
        curStateOb.overdrive.curveAmount = v / 100;
        curStateOb.overdrive.knob_level = v;
        //console.log(' v/10'+ v/100);
      },
      release: function (v) {
        overdrive.curveAmount = v / 100;
        curStateOb.overdrive.curveAmount = v / 100;
        curStateOb.overdrive.knob_level = v;
        //console.log(' v/10'+ v/100);
      }
    });
    $("#tremolo_rate").knob({
      change: function (v) {
        tremolo.rate = (v * 8) / 100;
        curStateOb.tremolo.rate = (v * 8) / 100;
        curStateOb.tremolo.knob_rate = v;
      }
    });
    $("#tremolo_intensity").knob({
      change: function (v) {
        tremolo.intensity = v / 100;
        curStateOb.tremolo.intensity = v / 100;
        curStateOb.tremolo.knob_intensity = v;
      }
    });

    $("#moog_resonance").knob({
      change: function (v) {
        // moog.cutoff = .1+( v)/90;
        moog.resonance = (v * 4) / 100;
        curStateOb.moog.resonance = (v * 4) / 100;
        curStateOb.moog.knob_resonance = v;
      }
    });
    $("#global_volume").knob({
      //parsing preset in mainController
      change: function (v) {
        DS.mgain.gain.value = v / 50;
      }
    });

    $(".blocker").on("DOMMouseScroll mousewheel", function (event) {
      if (
        event.originalEvent.detail > 0 ||
        event.originalEvent.wheelDelta < 0
      ) {
        //alternative options for wheelData: wheelDeltaX & wheelDeltaY
        //scroll down
        ////console.log('Down');
      } else {
        //scroll up
        ////console.log('Up');
      }
      //prevent page fom scrolling
      return false;
    });
  });

  return EffectsService;
}

angular.module("droneSynthApp").factory("EffectsService", EffectsService);

EffectsService.$inject = ["$rootScope", "$location"];
