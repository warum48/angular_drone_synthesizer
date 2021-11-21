 angular.module('droneSynthApp').directive('drag2dim', function($rootScope, EffectsService, NotesService, $timeout) {
         return {
             link: function($scope, element, attrs) {
                 var $vertline = $(element).find(".vertline");
                 var $horline = $(element).find(".horline");
                 var $outer = $(element).find(".outer");
                 var $inner = $(element).find(".inner");
                 var x_inner_perc = 0;
                 var y_inner_perc = 0;
                 var y_outer_perc = 0;
                 
                 $scope.noteName = "A4";
                 $scope.effectNum = 1;
                //$scope.noteName = NotesService.getNoteName(attrs.index);
                 
                // $scope.effectcheck = 0;
                 //$scope.local = {effectcheck:$scope.effectcheck};
                 // var index = $scope.$parent.$index;
                 // //////console.log('$par'+$parent.scale.length);
                 Draggable.create($inner, {
                     type: "x,y",
                     edgeResistance: 1,
                     bounds: $outer,
                     throwProps: false,
                     onDrag: function() {
                         //////console.log(this.x + '_' + this.y);
                         x_inner_perc = this.x / ($outer.outerWidth() - $inner.outerWidth());
                         y_inner_perc = this.y / ($outer.outerHeight() - $inner.outerHeight());
                         $scope.$emit('innerDrag', {
                             x: this.x,
                             y: this.y,
                             x_perc: x_inner_perc,
                             y_perc: y_inner_perc,
                             index: attrs.index
                         });
                         TweenLite.set($horline, {
                             y: this.y
                         });
                         TweenLite.set($vertline, {
                             x: this.x
                         });
                     },
                     onDragStart: function() {
                         parentDrag[0].disable();
                     },
                     onDragEnd: function() {
                         parentDrag[0].enable();
                         TweenLite.set($horline, {
                             y: this.y
                         });
                         TweenLite.set($vertline, {
                             x: this.x
                         });
                     }
                 });
                 var parentDrag = Draggable.create($outer, {
                     type: "y",
                     edgeResistance: 1,
                     bounds: element,
                     throwProps: false,
                     onDrag: function() {
                         //////console.log(this.x + '_' + this.y);
                         y_outer_perc = this.y / (element.innerHeight() - $outer.innerHeight());
                         $scope.$emit('outerDrag', {
                             x: this.x,
                             y: this.y,
                             // x_perc: this.x/$outer.innerWidth(),
                             y_perc: y_outer_perc,
                             index: attrs.index
                         });
                     }
                 });
                 /*$scope.mute = function() {
                     $scope.$emit('mute', {
                         index: attrs.index
                     });
                 }
                 $scope.unmute = function() {
                     $scope.$emit('unmute', {
                         index: attrs.index
                     });
                 }*/
                 $scope.deactivate = function() {
                         ////console.log('deativate_rootScope_broadcast');
                         $rootScope.$broadcast('keydeactivate', {
                             index: attrs.index
                         });
                 }

                 function correctionInner() {
                     var new_x = x_inner_perc * ($outer.outerWidth() - $inner.outerWidth());
                     var new_y = y_inner_perc * ($outer.outerHeight() - $inner.outerHeight());
                     TweenLite.set($inner, {
                         x: new_x,
                         y: new_y
                     });
                     TweenLite.set($vertline, {
                         x: new_x
                     });
                     TweenLite.set($horline, {
                         y: new_y
                     });
                 }

                 function correctionOuter() {
                     //var new_x = x_inner_perc * ($outer.outerWidth() -$inner.outerWidth());
                     var new_y = y_outer_perc * (element.innerHeight() - $outer.innerHeight());
                     TweenLite.set($outer, {
                         y: new_y
                     });
                 }

                 function updateView() {
                     correctionInner();
                     correctionOuter();
                 }


                 $scope.$watch(function() {
                     return element.attr('style');
                 }, function(newValue) {
                     //////console.log('change');
                     updateView();
                 });
                 
                 $rootScope.$on('keydeactivate', function(event, data) { 
                    ////console.log('deativate_rootScope_on');
                    if(data.index == attrs.index){
                        x_inner_perc = 0;
                        y_inner_perc = 0;
                        y_outer_perc = 0;
                    }
                 });
                 
                 $rootScope.$on('keyactivate', function(event, data) { 
                 $scope.noteName = NotesService.getNoteName(attrs.index);
                 });
                 
                 $rootScope.$on('loadPreset', function(event, data) { 
                    ////console.log('load_rootScope_on');
                    if(data.index == attrs.index){
                        x_inner_perc = data.x_inner_perc;
                        y_inner_perc = data.y_inner_perc;
                        y_outer_perc = data.y_outer_perc;
                       /* for (var prop in data.obj) {
            this[prop] = obj[prop];
        }*/
                        ////console.log('y_outer_perc'+y_outer_perc);
                        //console.log('data.input_node'+data.input_node);
                        //console.log('data'+JSON.stringify(data));
                        if(data.input_node){
                        $scope.setOutput(data.input_node);
                        }
                        updateView();
                    }
                    
                 });
                 
                $scope.connectToMain = function(){
                     $rootScope.$broadcast('connectToMain', {
                             index: attrs.index
                         });
                         //console.log('ERROR-connectToMain deprecated')
                 }
                 
                 $scope.getEffectsList = function(){
                     return EffectsService.getEffectsList();
                 }
                 $scope.setOutput = function(num){
                     //console.log('index'+num);
                     $scope.effectNum = num;
                     $rootScope.$broadcast('connectToNode', {
                             index: attrs.index,
                             nodeNum: num
                         });
                         TweenLite.to(element, .5, {
                         opacity:.9999
                     });
                         /*$timeout(function(){
                             try{$scope.$apply();
                             }catch(e){}
                             }, 500);*/
                        // $scope.$apply();
                        //БЕСИТ!! КЛАСС НЕ АПДЕЙТИСЯ САМ!!
                        /*for(var i=num; i<element.find(".option-group").length; i++){
                            element.find(".option-group").removeClass("disabled");
                            element.find(".option-group").eq(i).addClass("disabled");
                        }*/
                        //option-group
                 }
                 
                /* $scope.getStyleClass = function($index)  {   
                      return "'disabled': $index > effectNum";  
                 }
                 $scope.getStyleClass = function($index)  {   
                     // return "'disabled': $index > effectNum";  
                     if($index > $scope.effectNum){
                        return 'disabled' ;
                     }
                 }*/
                 
                 window.addEventListener('resize', function() {
                     updateView();
                 });

             }
         }
     }

 );