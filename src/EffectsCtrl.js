(function() {
    function EffectsCtrl($scope, EffectsService, $rootScope) {
        //console.log('keys');
       
       $scope.getIRs = function(){
            return EffectsService.getIRs();
        }
        $scope.changeInpulseResp = function(index){
            EffectsService.changeInpulseResp(index);
            $rootScope.$broadcast('convolverChange', {
                   // index: attrs.index
                });
        }
        $scope.getInpulseResp = function(){
            return EffectsService.getInpulseResp();
        }
        $scope.changeOverDriveType = function(index){
            EffectsService.changeOverDriveType(index);
        }
        $scope.getOverDriveType = function(){
            return EffectsService.getOverDriveType();
        }
       /* $scope.toggleBypass = function(num){
             EffectsService.toggleBypass(num);
        }*/
        $scope.toggleBypass = function(name){
             EffectsService.toggleBypass(EffectsService.getEffectsList().indexOf(name));
        }
        $scope.getNodeByName = function(name){
            var num = EffectsService.getEffectsList().indexOf(name)
             return EffectsService.getNodesList()[num];
        }
        $scope.getNodesList = function(){
             return EffectsService.getNodesList();
        }
        $scope.getCurState = function(){
             return EffectsService.getCurState();
        }
        $scope.getNodeExistece = function(name){
            ////console.log('EffectsService.getNodesList().indexOf("tremolo")'+EffectsService.getNodesList().indexOf("tremolo"))
            return EffectsService.getEffectsList().indexOf(name) != -1;
        }
    }

angular
    .module('droneSynthApp')
    .controller('EffectsCtrl', EffectsCtrl);
    
    EffectsCtrl.$inject = ['$scope', "EffectsService", "$rootScope"]
    
})();