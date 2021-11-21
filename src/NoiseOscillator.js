var NoiseOscillator = (function() {
    
   // var pan_z = 1;

    function NoiseOscillator(params) {
        this.node = null;
    this.freq = 440;
    this.gain = null;
    this.noiseGen = null;
    this.knob = null;
    this.num = 0;
    this.panner = null;
    this.pan_x = 1;
    this.pan_y = -15;
    this.pan_z = -15;
    this.filter = null;
    this.panNode = null;
    this.loopLength = 4;
    
    //this.curInputNode = null;
    this.nodeNum = 3;
    
    this.stateOb = {
        vol:0,//[0,1]
        vol_visperc:0, //[0,-1]
        pan_lr:0, //[-1;1]
        pan_lr_visperc:0,//[-.5, .5]
        filter_q:50,//[0,100]
        filter_q_visperc:0,//[-.5,.5],
        input_node:1 //[0,1,2]
    };
    
    this.generated = false;
    
    ////console.log('this_pan_z'+this.pan_z);
        for (var prop in params) {
            this[prop] = params[prop];
        }
       // this.generate();
    }
    NoiseOscillator.prototype.generate = function() {
        this.generated = true;
        this.gain = DS.context.createGain();
        //this.gain.connect(DS.mgain);
       //  this.gain.connect(DS.convolver);
       this.gain.connect(DS.noiseGenInput);
        this.panner = DS.context.createPanner();
        this.panner.setPosition(this.pan_x, this.pan_y, this.pan_z);
        this.panner.connect(this.gain);//disable this to skip panner
        
        
        
       //!! this.panNode = DS.context.createStereoPanner();
       //!! this.panNode.connect(this.panner);
       //this.panNode.connect(this.gain);//enable this to skip panner

        this.filter = DS.context.createBiquadFilter();
        this.filter.type = 'lowpass';
        this.filter.frequency.value = this.freq;
        this.filter.Q.value = 40; //50
        
        if(AudioContext.prototype.hasOwnProperty("createStereoPanner")){
            this.panNode = DS.context.createStereoPanner();
            this.panNode.connect(this.panner);
            this.filter.connect(this.panNode);
        }else{
        this.filter.connect(this.panner);
        }
       // this.filter.connect(this.panNode);

        this.noiseGen = new NoiseGenerator({loopLength:this.loopLength});

       // this.noiseGen.node.connect(this.filter);
        this.node = this.noiseGen.node;
    }
    
    
    NoiseOscillator.prototype.setPan = function(pos){
       // var x,y,z;
        if(pos.x != undefined){
            this.pan_x = pos.x;
        }
        if(pos.y != undefined){
            this.pan_y = pos.y;
        }
        if(pos.z != undefined){
            this.pan_z = pos.z;
        }
       // ////console.log('this.x'+this.pan_x);
       // ////console.log('this.y'+this.pan_y);
       // ////console.log('this.z'+this.pan_z);
        
        this.panner.setPosition(this.pan_x, this.pan_y, this.pan_z);
    }
    NoiseOscillator.prototype.setLR = function(val){
        try{
         this.panNode.pan.value = val;
        }catch(e){}
    }
    
    NoiseOscillator.prototype.setVol = function(val){
        this.gain.gain.value = val;
    }
    
    NoiseOscillator.prototype.setFilterQ = function(val){
        this.filter.Q.value = val;
    }
    NoiseOscillator.prototype.mute = function(){
       // this.filter.Q.value = val;
       this.gain.gain.value = 0;
       var __this = this
       setTimeout(function(){
           __this.noiseGen.node.disconnect();
       }, 200);
      // this.noiseGen.node.disconnect();
       //this.noiseGen.disable();
    }
    NoiseOscillator.prototype.unmute = function(){
       // this.filter.Q.value = val;
      // this.gain.gain.value = 0;
      
      if(!this.generated){
          this.generate();
      }
      this.gain.gain.value = 0;
       this.noiseGen.node.connect(this.filter);
       
       //this.noiseGen.enable();
    }
     NoiseOscillator.prototype.reconect = function(){
         this.noiseGen.node.connect(this.filter);
     }
     
     NoiseOscillator.prototype.connectTo = function(input, num){
         this.gain.disconnect();
         this.gain.connect(input);
         
        // this.curInputNode = input;
         this.nodeNum = num;
         ////console.log('this.nodeNum'+this.nodeNum);
         ////console.log('num'+this.num);
     }
     /*NoiseOscillator.prototype.updateGainInput = function(){
         this.gain.disconnect();
        // this.gain.connect(this.curInputNode);
     }*/
     
     NoiseOscillator.prototype.getStateOb = function(){
         return this.stateOb;
     }
     
     NoiseOscillator.prototype.updateParams = function(obj){
         for (var prop in obj) {
            this.stateOb[prop] = obj[prop];
        }
        if(obj.pan_lr!= undefined){
            this.setLR(obj.pan_lr);
        }
        ////console.log('obj.vol'+obj.vol)
        if(obj.vol != undefined){
            ////console.log('obj.vol-if'+obj.vol)
            this.setVol(obj.vol);
        }
        if(obj.filter_q != undefined){
            this.setFilterQ(obj.filter_q);
        }
       /* if(obj.input_node != undefined){
            this.setFilterQ(obj.input_node);
        }*/
        consoleLogObj(this.stateOb);
     }

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }
    function consoleLogObj(obj) {
           var output =  JSON.stringify(obj, null, 4);
            console.log(output);
        }
    return NoiseOscillator;
})();