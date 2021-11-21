var NoiseGenerator = (function() {
     //seconds
    
   // this.context = null
        // this.selector = $(this.mc).find(".scene");

    function NoiseGenerator(params) {
        this.node = null;
    this.type = "loop";
    this.loopLength = 4;//seconds
        for (var prop in params) {
            this[prop] = params[prop];
        }
        this.generate();
    }
    NoiseGenerator.prototype.generate = function() {
        ////console.log('this.type'+this.type);
        if (this.type = "loop") {
            this.generateLoop(this.loopLength);
        }
        else {
            this.generateEndlessRandom();
        }
    }
    NoiseGenerator.prototype.generateEndlessRandom = function() {
        this.node = DS.context.createScriptProcessor(bufferLen, 1, 2);
        this.node.onaudioprocess = function(e) {
            var outBufferL = e.outputBuffer.getChannelData(0);
            var outBufferR = e.outputBuffer.getChannelData(1);
            for (var i = 0; i < bufferLen; i++) {
                outBufferL[i] = outBufferR[i] = Math.random() * 2 - 1; //
                //////console.log('outBufferL[i]'+outBufferL[i]);
            }
        };
    }
    function onEnded() {
    //isFinished = true;
    console.log('playback finished');
    }
    
    NoiseGenerator.prototype.generateLoop = function(loopLength) {
        ////console.log('loopLength'+loopLength)
        var bufferSize = loopLength * DS.context.sampleRate,
            noiseBuffer = DS.context.createBuffer(1, bufferSize, DS.context.sampleRate),
            output = noiseBuffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        this.node = DS.context.createBufferSource();
        this.node.buffer = noiseBuffer;
        this.node.loop = true;
        this.node.start(0);
        
       // this.node.onended = onEnded;
       var th_ = this;
       this.node.onended = function(){console.log('end');
       //th_.node.start(0);
           
       };
    }
    NoiseGenerator.prototype.regenerateLoop = function(num){
        this.node.stop();
        this.generateLoop(num); 
    }
    
    
    /*NoiseGenerator.prototype.disable = function() {
        ////console.log('disable_gen');
        this.node.stop();
    }
    NoiseGenerator.prototype.enable = function() {
        ////console.log('enable_gen');
        this.node.start(0);
    }*/
    function consoleLogObj(obj) {
           var output =  JSON.stringify(obj, null, 4);
            //console.log(output);
        }

    return NoiseGenerator;
})();