(function() {
    angular.module('droneSynthApp');

    function MainCtrl($scope, $rootScope, NotesService, PresetsService, MonkeyService, EffectsService, KeysService) {
        
        var _webkitAC = window.hasOwnProperty('webkitAudioContext');
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
    }
        
        $scope.isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
           
        window.DS = {};
        
        $scope.language = "en";//ru

        $scope.notesAr = NotesService.getNotesAr();
        $scope.activeNotesAr = NotesService.getActiveOnlyAr();

        DS.context = new AudioContext();

        DS.mgain = DS.context.createGain();
        DS.mgain.gain.value = 1 //35 for bypass;
        DS.mgain.connect(DS.context.destination);
        DS.recorder = new Recorder(DS.mgain);

        var noiseGens = [];
        //$scope.noiseGens = [];//noiseGens;
        //$scope.activeGens = NotesService.getActiveOnlyAr();
        var noiseNodes = [];
        var bufferLen = 4096 //1024//4096;
        var gainAr = [];

        var curStateOb = {};
        
        $scope.curPreset = ""; //savepreset tf
        
        //$scope.saving_preset=false; 
        //$scope.loading_preset=false;

        EffectsService.init(DS.context, DS.mgain);
        DS.noiseGenInput = EffectsService.getInputNode();
        
        $scope.getActiveOnlyAr = function(){
            return NotesService.getActiveOnlyAr();
        }

        function createNoiseGen(freq, num) {
            var noiseOsc = new NoiseOscillator({
                freq: freq,
                num: num //,
                    //knob: knob
            });
            noiseGens.push(noiseOsc);
            noiseNodes.push(noiseOsc.node)
        }

        $scope.generate = function() {
            for (var i = 0; i < $scope.notesAr.length; i++) {
                var degree = i;
                var freq = mtof($scope.notesAr[i].num);
                freq += Math.random() * 4 - 2;
                var noiseGen = createNoiseGen(freq, i, $('.panknob:eq(' + i + ')'));

            }
        }

        function mtof(m) {
            return Math.pow(2, (m - 69) / 12) * 440;
        }

        function consoleLogObj(obj) {
            var output = JSON.stringify(obj, null, 4);
            ////console.log(output);
        }

        $scope.$on('innerDrag', function(event, data) {
            var filter_q = 100 - (data.y_perc + 0.5) * 100; //100 is too much, causes feedback;
            var pan_lr = data.x_perc * 2;
            // noiseGens[data.index].setFilterQ(filter_q);
            // noiseGens[data.index].setLR(pan_lr);

            var paramsObj = {
                filter_q: filter_q,
                filter_q_visperc: data.y_perc,
                pan_lr: pan_lr,
                pan_lr_visperc: data.x_perc
            };
            noiseGens[data.index].updateParams(paramsObj);

            /* PresetsService.updateActive(data.index, {
                 filter_q: filter_q,
                 pan_lr: pan_lr,
                 x_inner_perc: data.x_perc,
                 y_inner_perc: data.y_perc
             });*/
        });

        $scope.$on('outerDrag', function(event, data) {
            var vol = -data.y_perc;
            var paramsObj = {
                vol: vol,
                vol_visperc: data.y_perc
            };
            noiseGens[data.index].updateParams(paramsObj);
        });

        $scope.$on('mute', function(event, data) {
            noiseGens[data.index].mute();
        });
        $scope.$on('unmute', function(event, data) {
            noiseGens[data.index].unmute();
        });

        $rootScope.$on('keyactivate', function(event, data) {
            NotesService.setActive(data.index);
            noiseGens[data.index].unmute();
            noiseGens[data.index].connectTo(EffectsService.getNodesList()[1], 1);
            //PresetsService.addActive(data.index);
        });
        $rootScope.$on('keydeactivate', function(event, data) {
            NotesService.removeActive(data.index);
            noiseGens[data.index].mute();
        });

       /* $rootScope.$on('connectToMain', function(event, data) {
            noiseGens[data.index].connectTo(EffectsService.getSkipTremoloInputNode());
            //////console.log('connectTo');
        });*/
        
       /* $scope.getEffectsList = function(){
                     return EffectsService.getEffectsList();
                 }*/
        
        $rootScope.$on('connectToNode', function(event, data) {
            noiseGens[data.index].connectTo(EffectsService.getNodesList()[data.nodeNum], data.nodeNum);
           // noiseGens[data.index].nodeNum = data.nodeNum;
            //////console.log('connectTo');
            var paramsObj = {
            input_node: data.nodeNum
            }
            noiseGens[data.index].updateParams(paramsObj);
        });
        
        $rootScope.$on('convolverChange', function(event, data) {
            //noiseGens[data.index].connectTo(EffectsService.getNodesList()[data.nodeNum]);
            //////console.log('connectTo');
            var activeNodesAr =  NotesService.getActiveOnlyAr();
            for(var i=0;i<activeNodesAr.length; i++){
                ////console.log('activeNodesAr[i].num'+activeNodesAr[i].num);
                ////console.log('noiseGens[activeNodesAr[i].num].nodeNum'+noiseGens[activeNodesAr[i].ind].nodeNum);
                //noiseGens[activeNodesAr[i].num].updateGainInput();
                if(noiseGens[activeNodesAr[i].ind].nodeNum == 1){
                    noiseGens[activeNodesAr[i].ind].connectTo(EffectsService.getNodesList()[1], 1);
                }
            }
        });

        $scope.getGenStyle = function() {
            //var width = ((window.innerWidth / NotesService.getActiveOnlyAr().length) + 'px');
            var width = (($('.full_container').width() / NotesService.getActiveOnlyAr().length) + 'px');
            var style = {
                'width': width
            };
            return style;
        }
        
        $scope.deactivateAll = function(){
            var activeNodesAr =  NotesService.getActiveOnlyAr();
            //////console.log('NotesService.getActiveOnlyAr().length'+NotesService.getActiveOnlyAr().length);
            for(var i=0; i< activeNodesAr.length; i++){
                ////console.log('i'+i);
           // NotesService.removeActive(activeNodesAr[i].ind);
           // noiseGens[activeNodesAr[i].ind].mute();
           $rootScope.$broadcast('keydeactivate', {
                             index: activeNodesAr[i].ind
                         });
            }
        }
        
        $scope.fullReset = function(){
            $scope.deactivateAll();
        }
        
        /*$scope.showPresetSaver = function(){
            
        }*/

        $scope.savePreset = function() {
            var saveObj = {}
            var notesAr = NotesService.getNotesAr();
            PresetsService.reset();
            //console.log('resetonsave');
            for (var i = 0; i < notesAr.length; i++) {
                if (notesAr[i].active == true) {
                   // ////console.log('i-act' + i);
                    PresetsService.addActive(i); // --shit?
                    console.log('save');
                    PresetsService.updateActive(i, noiseGens[i].getStateOb());
                }
            }
            ////console.log('__________SAVE PRESET'+PresetsService.getCurState());
            //consoleLogObj(PresetsService.getCurState());
            
            angular.extend(saveObj, PresetsService.getCurState());
            angular.extend(saveObj.effects, EffectsService.getCurState());
            saveObj.global.volume = $("#global_volume").val();
            
            consoleLogObj(saveObj);
            //return JSON.stringify(saveObj, null, 4);
           // return JSON.parse(saveObj);--shit
           $scope.saving_preset=true
           $scope.curPreset = JSON.stringify(saveObj, null, 4);
            
        }
        
       $scope.getPresetsAr = function(){
            return PresetsService.getPresetsAr();
        }
        
        $scope.loadPreset = function(num) {
            $scope.fullReset();
            //setTimeout(function(){$scope.loadPresetTimeOut(num) }, 500);
            setTimeout(function(){$scope.loadPresetObject(PresetsService.getPresetsAr()[num])}, 500);
        }

        $scope.loadPresetTimeOut = function(num) {
            //$scope.fullReset();
            var preset = PresetsService.getPresetsAr()[num].keys;
            consoleLogObj(preset);
            for (var prop in preset) {  //prop == keynum
                ////console.log('prop' + prop);
                ////console.log('prop.vol' + preset[prop].vol);
                /*$rootScope.$broadcast('keydeactivate', {
                    index: prop
                });*/
                $rootScope.$broadcast('keyactivate', {
                    index: prop
                });
                ////console.log('prop-aftact' + prop);

                var paramsObj = {
                    /*vol: preset[prop].vol,
                    vol_visperc: preset[prop].y_outer_perc,
                    filter_q: preset[prop].filter_q,
                    filter_q_visperc: preset[prop].y_inner_perc,
                    pan_lr: preset[prop].pan_lr,
                    pan_lr_visperc: preset[prop].x_inner_perc*/
                    vol: preset[prop].vol,
                    vol_visperc: preset[prop].vol_visperc, //neobyazat??
                    filter_q: preset[prop].filter_q,
                    filter_q_visperc: preset[prop].filter_q_visperc,
                    pan_lr: preset[prop].pan_lr,
                    pan_lr_visperc: preset[prop].pan_lr_visperc,
                    input_node:preset[prop].input_node  //!!neobyazatelno??, dubl na 4 stroki nizhe
                };
                consoleLogObj(paramsObj);
                noiseGens[prop].updateParams(paramsObj);
                ////console.log('preset[prop].input_node'+preset[prop].input_node);
                if(preset[prop].input_node){
               // noiseGens[prop].connectTo(EffectsService.getNodesList()[preset[prop].input_node], preset[prop].input_node);
                }

                $rootScope.$broadcast('loadPreset', {
                    index: prop,
                   /* x_inner_perc: preset[prop].x_inner_perc || 0,
                    y_inner_perc: preset[prop].y_inner_perc || 0,
                    y_outer_perc: preset[prop].y_outer_perc || 0*/
                     x_inner_perc: preset[prop].pan_lr_visperc || 0,
                    y_inner_perc: preset[prop].filter_q_visperc || 0,
                    y_outer_perc: preset[prop].vol_visperc || 0,
                    input_node:preset[prop].input_node || 1
                });
            }
            // PresetsService.loadPreset(num);
            ////console.log('EFFECTS');
            consoleLogObj(PresetsService.getPresetsAr()[num].effects)
            EffectsService.parsePreset(PresetsService.getPresetsAr()[num].effects)
            ////console.log('KeysService'+KeysService);
            KeysService.loadPreset(PresetsService.getPresetsAr()[num].global.keyboard_offset);
            $scope.generateLoop(PresetsService.getPresetsAr()[num].global.loopLength);
            
            $("#global_volume").val(PresetsService.getPresetsAr()[num].global.volume).trigger('change');
            DS.mgain.gain.value = PresetsService.getPresetsAr()[num].global.volume/50;
            
            $scope.$apply();
        }
        
        $scope.loadPresetObject = function(presetOb){
            //var preset = PresetsService.getPresetsAr()[num].keys;
            //var preset = keysOb;
            //consoleLogObj(preset);
            var keysOb = presetOb.keys;
            for (var prop in keysOb) {  //prop == keynum
                ////console.log('prop' + prop);
                ////console.log('prop.vol' + keysOb[prop].vol);
                /*$rootScope.$broadcast('keydeactivate', {
                    index: prop
                });*/
                $rootScope.$broadcast('keyactivate', {
                    index: prop
                });
                ////console.log('prop-aftact' + prop);

                var paramsObj = {
                    /*vol: preset[prop].vol,
                    vol_visperc: preset[prop].y_outer_perc,
                    filter_q: preset[prop].filter_q,
                    filter_q_visperc: preset[prop].y_inner_perc,
                    pan_lr: preset[prop].pan_lr,
                    pan_lr_visperc: preset[prop].x_inner_perc*/
                    vol: keysOb[prop].vol,
                    vol_visperc: keysOb[prop].vol_visperc, //neobyazat??
                    filter_q: keysOb[prop].filter_q,
                    filter_q_visperc: keysOb[prop].filter_q_visperc,
                    pan_lr: keysOb[prop].pan_lr,
                    pan_lr_visperc: keysOb[prop].pan_lr_visperc,
                    input_node:keysOb[prop].input_node  //!!neobyazatelno??, dubl na 4 stroki nizhe
                };
                consoleLogObj(paramsObj);
                noiseGens[prop].updateParams(paramsObj);
                //////console.log('preset[prop].input_node'+preset[prop].input_node);
               /* if(keysOb[prop].input_node){
               // noiseGens[prop].connectTo(EffectsService.getNodesList()[preset[prop].input_node], preset[prop].input_node);
                }*/

                $rootScope.$broadcast('loadPreset', {
                    index: prop,
                   /* x_inner_perc: preset[prop].x_inner_perc || 0,
                    y_inner_perc: preset[prop].y_inner_perc || 0,
                    y_outer_perc: preset[prop].y_outer_perc || 0*/
                     x_inner_perc: keysOb[prop].pan_lr_visperc || 0,
                    y_inner_perc: keysOb[prop].filter_q_visperc || 0,
                    y_outer_perc: keysOb[prop].vol_visperc || 0,
                    input_node:keysOb[prop].input_node || 1
                });
            }
            // PresetsService.loadPreset(num);
            //////console.log('EFFECTS');
            consoleLogObj(presetOb.effects)
            EffectsService.parsePreset(presetOb.effects)
            //////console.log('KeysService'+KeysService);
            KeysService.loadPreset(presetOb.global.keyboard_offset);
            $scope.generateLoop(presetOb.global.loopLength);
            
            $("#global_volume").val(presetOb.global.volume).trigger('change');
            DS.mgain.gain.value = presetOb.global.volume/50;
            
            $scope.$apply();
        }
        
        $scope.loadTextPreset = function(){
            var preset = JSON.parse(angular.element("#presetinput").val());
           //////console.log('QQqQQQQQQQQQ');
           //////console.log('angular.element("#presetinput").val'+angular.element("#presetinput").val());
           //////console.log('angular.element("#presetinput").text'+angular.element("#presetinput").text());
            
            $scope.fullReset();

            setTimeout(function(){$scope.loadPresetObject(preset); angular.element("#presetinput").val(""); /*$scope.saving_preset=false; $scope.loading_preset=false*/}, 500);
        }

        $scope.generateLoop = function(num) {
            //console.log('genloop');
            for (var i = 0; i < noiseGens.length; i++) {
                if (noiseGens[i].noiseGen != null) {
                    noiseGens[i].noiseGen.regenerateLoop(num);
                    noiseGens[i].reconect();
                }
                else {
                    noiseGens[i].loopLength = num;
                }
            }
            PresetsService.setLoopLength(num);
        }
        $scope.curLoopLength = function(){
            //console.log('PresetsService.getLoopLength()'+PresetsService.getLoopLength());
            return PresetsService.getLoopLength();
        }
        
        $scope.onResize = function() {
            $scope.getGenStyle();
        }
        
        $scope.setLanguage = function(lang){
            $scope.language = lang;
        }

        $scope.getDefaults = function() {
                //////console.log('def$'+PresetsService.getDefaults().noise.noiseLoopLength)
                return PresetsService.getDefaults();
            }
            //angular.element($window).bind('resize', function() {
        window.addEventListener('resize', function() {
            $scope.onResize();
            $scope.$apply();
        });
        
        $(document).bind('touchmove', false);

        $scope.generate();

    }

    angular
        .module('droneSynthApp')
        .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['$scope', "$rootScope", "NotesService", "PresetsService", "MonkeyService", "EffectsService", "KeysService"]

})();
