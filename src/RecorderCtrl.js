/*$('#StartRec').click(recorder.record);
  $('#StopRec').click(recorder.stop);
  $('#Export').click(function() {
    recorder.exportWAV(function(blob) {
      Recorder.forceDownload(blob);
    });
  });*/
(function() {

    function RecorderCtrl($scope, $timeout) {
        $scope.state = "wait";//recording //prerecording
        $scope.isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        var to;
        var recorder = new Recorder(DS.mgain);

        $scope.startRecord = function() {
            recorder.record();
            $scope.state = "recording";
            console.log('start');
            to = $timeout(function(){
                console.log("recTO");
                $scope.doRecord();
            }, 120000)
        }
        
        $scope.prerecord = function(){
            if($scope.state== "wait" ){
            $scope.state = "prerecording";
            }
            if($scope.state== "recording"){
                $scope.doRecord();
            }
        }

        $scope.stopRecord = function() {
            recorder.stop();
            $scope.state = "wait";
            console.log('wait');
            $timeout.cancel(to);
        }

        $scope.exportRecord = function() {
            console.log('exp');
            recorder.exportWAV(function(blob) {
                Recorder.forceDownload(blob);
            });
        }
        
        $scope.doRecord = function(){
            if($scope.state== "wait" || $scope.state== "prerecording"){
                $scope.startRecord();
            }else{
                $scope.stopRecord();
                $scope.exportRecord();
            }
        }
        
        $scope.closeRecAlert = function(){
            $scope.state = "wait";
        }
    }


    angular
        .module('droneSynthApp')
        .controller('RecorderCtrl', RecorderCtrl);

    RecorderCtrl.$inject = ['$scope', '$timeout'];

})();