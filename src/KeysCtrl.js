//angular.module('droneSynthApp').controller('KeysCtrl', function KeysCtrl($scope) {
(function() {
   // angular.module('droneSynthApp', []);

    function KeysCtrl($scope, NotesService, PresetsService,KeysService) {


        //console.log('keys');
       /* var firstNote = 24;
        var lastNote = 119;
        var keysnames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        $scope.keys = [];
        var ind = 0;
        for (var i = firstNote; i <= lastNote; i++) {
            $scope.keys.push({
                name: keysnames[ind % 12] + Math.floor(i / 12),
                num: i
            });
            ind += 1;
        }*/
        $scope.keys = NotesService.getNotesAr();
        $scope.getColor = function(index) {
            ////console.log('index%12'+index%12);
            if (index % 12 == 1 || index % 12 == 3 || index % 12 == 6 || index % 12 == 8 || index % 12 == 10) {
                return "black"
            }
            else {
                return "white"
            }
        }
        
        
        //---------------------------draggable-------
        
        var itemHeight = (25+1)*12;
        //$scope.curItem = 0;
        var curTop = -624//0;
        TweenLite.to(".keys_inner", 0.5, {x:curTop});
        
        $scope.date = new Date();
        $scope.isActive = function(expr) {
            return (new RegExp(expr)).test($location.path())
        };
        var isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        if(!isMobile){
        Draggable.create(".keys_inner", {
            type: "x",
            edgeResistance: 0.5,
            bounds: ".keys_outer",
            throwProps: true,
            lockAxis: true,
            onDragEnd: function(){
                curTop = (Math.floor(this.x/itemHeight))*itemHeight+itemHeight;
                //console.log('curTop '+curTop );
                if(curTop>0){
                    curTop = 0;
                }
                $scope.setOffsetToPresets();
                //PresetsService.curStateOb.global.keyboard_offset = curTop;
            },
            onThrowUpdate: function(){
                curTop = (Math.floor(this.x/itemHeight))*itemHeight+itemHeight;
                //console.log('curTop '+curTop );
                if(curTop>0){
                    curTop = 0;
                }
                $scope.setOffsetToPresets();
            }
        });
        }

        

        //for repeat:
        //$scope.number = 14;
       /* $scope.getNumber = function(num) {
            return new Array(num);
        }*/
        
        $scope.moveDown = function(){
            curTop = (Math.floor(curTop/itemHeight))*itemHeight
            //if(curTop <= -itemHeight){
                if(curTop + itemHeight <=0){
            curTop += itemHeight;
            }
            TweenLite.to(".keys_inner", .5, {x:curTop});
            $scope.setOffsetToPresets();
        }
        
        $scope.moveUp = function(){
            curTop = (Math.floor(curTop/itemHeight))*itemHeight
            //if(curTop >= -itemHeight*($scope.number-2)){
            if(curTop - itemHeight >= -$(".keys_inner").outerWidth()+ $(".keys_outer").outerWidth()){
            curTop -= itemHeight;
            }else{
                curTop = -$(".keys_inner").outerWidth()+ $(".keys_outer").outerWidth();
            }
            TweenLite.to(".keys_inner", .5, {x:curTop});
            $scope.setOffsetToPresets();
        }
        
        /*$scope.getOffset = function(){
            return curTop;
        }*/
        
        $scope.setOffsetToPresets = function(){
            //console.log('PresetsService.curStateOb'+PresetsService.getCurState());
            PresetsService.getCurState().global.keyboard_offset = curTop;
        }
        
        
        
        
    }
//});

angular
    .module('droneSynthApp')
    .controller('KeysCtrl', KeysCtrl);
    
    KeysCtrl.$inject = ['$scope', "NotesService", "PresetsService", "KeysService"]
    
})();