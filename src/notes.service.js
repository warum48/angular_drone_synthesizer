function NotesService() {
    var NotesService = {};

    var firstNote = 24;
    var lastNote = 119;
    var keysnames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    var keys = [];
    var ind = 0;
    for (var i = firstNote; i <= lastNote; i++) {
        keys.push({
            name: keysnames[ind % 12] + Math.floor(i / 12),
            num: i,
            active: false,
            ind:ind

        });
        ind += 1;
    }
    //console.log('NotesService.keys' + keys);

    /*function privat(name) {
      return  name;
    }*/

    NotesService.getNotesAr = function() {
        return keys;
    };

    NotesService.setActive = function(index) {
        keys[index].active = true;
        //console.log('keys[index].active' + keys[index].active);
    }

    NotesService.removeActive = function(index) {
        keys[index].active = false;
    }

    function isActive(value) {
        return value.active == true;
    }
    
    NotesService.getNoteName = function(index) {
        //console.log('keys[index]'+keys[index]);
        return keys[index].name;
    }

    NotesService.getActiveOnlyAr = function() {
            var filtered = this.getNotesAr().filter(isActive);
            return filtered;
        }
        //var filtered = [12, 5, 8, 130, 44].filter(isBigEnough);



    return NotesService;
}


angular
    .module('droneSynthApp')
    .factory('NotesService', NotesService);