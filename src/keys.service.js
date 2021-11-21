function KeysService($rootScope) {
    var KeysService = {};
    
     /*KeysService.init = function(context, gain) {
    
     };*/
     
     KeysService.loadPreset = function(offset){
         //console.log('off');
            ////console.log('PresetsService.curStateOb'+PresetsService.getCurState());
            //PresetsService.getCurState().global.keyboard_offset = curTop;
            TweenLite.to(".keys_inner", .5, {x:offset});
        }

    return KeysService;
}


angular
    .module('droneSynthApp')
    .factory('KeysService', KeysService);