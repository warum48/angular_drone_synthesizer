function PresetsService(EffectsService) {
    var PresetsService = {};

    var curStateOb = {
        global: {
            loopLength: 4,
            keyboard_offset: 0,
            volume: 50
        },
        keys: {},
        effects: {}
    };

    var defaultsOb = {
        noise: {
            noiseLoopLength: [.1, .2, .5, .8, 1, 1.5, 2, 2.5, 3, 4, 6, 8, 10, 12, 16, 20, 40, 60],
            defaultLength: 4
        }
    }

    var presetsAr = [

        {
            "global": {
                "name": "bass",
                "loopLength": 4,
                "keyboard_offset": 0,
                "volume": "50"
            },
            "keys": {
                "0": {
                    "vol": 0.42939481268011526,
                    "vol_visperc": -0.42939481268011526,
                    "pan_lr": -0.007077140835102618,
                    "pan_lr_visperc": -0.003538570417551309,
                    "filter_q": 81.2,
                    "filter_q_visperc": -0.312,
                    "input_node": 2
                },
                "12": {
                    "vol": 0.1844380403458213,
                    "vol_visperc": -0.1844380403458213,
                    "pan_lr": 0.01729106628242075,
                    "pan_lr_visperc": 0.008645533141210375,
                    "filter_q": 50,
                    "filter_q_visperc": 0,
                    "input_node": 2
                }
            },
            "effects": {
                "overdrive": {
                    "algorithmIndex": 0,
                    "knob_level": 95,
                    "curveAmount": 0.95,
                    "bypass": 0
                },
                "convolver": {
                    "IRindex": 0,
                    "wetLevel": 0.05,
                    "dryLevel": 0.95,
                    "knob_level": 5,
                    "bypass": 0
                }
            }
        },

        {
            "global": {
                "name": "dry",
                "loopLength": 2,
                "keyboard_offset": -624,
                "volume": 50
            },
            "keys": {
                "26": {
                    "vol": 0.3689839572192513,
                    "vol_visperc": -0.3689839572192513,
                    "pan_lr": 0,
                    "pan_lr_visperc": 0,
                    "filter_q": 50,
                    "filter_q_visperc": 0
                },
                "40": {
                    "vol": 0.45187165775401067,
                    "vol_visperc": -0.45187165775401067,
                    "pan_lr": 0,
                    "pan_lr_visperc": 0,
                    "filter_q": 50,
                    "filter_q_visperc": 0
                },
                "45": {
                    "vol": 0.5401069518716578,
                    "vol_visperc": -0.5401069518716578
                },
                "50": {
                    "vol": 0.3723404255319149,
                    "vol_visperc": -0.3723404255319149
                },
                "53": {
                    "vol": 0.22340425531914893,
                    "vol_visperc": -0.22340425531914893,
                    "pan_lr": 0.022988505747126436,
                    "pan_lr_visperc": 0.011494252873563218,
                    "filter_q": 47.945205479452056,
                    "filter_q_visperc": 0.02054794520547945
                },
                "65": {
                    "vol": 0.045454545454545456,
                    "vol_visperc": -0.045454545454545456,
                    "pan_lr": 0,
                    "pan_lr_visperc": 0,
                    "filter_q": 50,
                    "filter_q_visperc": 0
                }
            },
            "effects": {
                "overdrive": {
                    "algorithmIndex": 0,
                    "knob_level": 50,
                    "curveAmount": 0.5
                },
                "convolver": {
                    "IRindex": 3,
                    "wetLevel": 0.028721209645523667,
                    "dryLevel": 0.9712787903544763,
                    "knob_level": 2.8721209645523667
                }
                /*,
                        "tremolo": {},
                        "moog": {}*/
            }
        }

        , {
            "global": {
                "name": "crystal",
                "loopLength": 4,
                "keyboard_offset": -624,
                "volume": 84
            },
            "keys": {
                "18": {
                    "vol": 0.17379679144385027,
                    "vol_visperc": -0.17379679144385027,
                    "pan_lr": -0.010582010582010581,
                    "pan_lr_visperc": -0.005291005291005291,
                    "filter_q": 65.44117647058823,
                    "filter_q_visperc": -0.15441176470588236
                },
                "33": {
                    "vol": 0.11229946524064172,
                    "vol_visperc": -0.11229946524064172,
                    "pan_lr": 0,
                    "pan_lr_visperc": 0,
                    "filter_q": 75,
                    "filter_q_visperc": -0.25
                },
                "37": {
                    "vol": 0.24064171122994651,
                    "vol_visperc": -0.24064171122994651,
                    "pan_lr": 0.20105820105820105,
                    "pan_lr_visperc": 0.10052910052910052,
                    "filter_q": 83.08823529411765,
                    "filter_q_visperc": -0.33088235294117646
                },
                "40": {
                    "vol": 0.12834224598930483,
                    "vol_visperc": -0.12834224598930483,
                    "pan_lr": -0.4973544973544973,
                    "pan_lr_visperc": -0.24867724867724866,
                    "filter_q": 69.85294117647058,
                    "filter_q_visperc": -0.19852941176470587
                },
                "47": {
                    "vol": 0.026737967914438502,
                    "vol_visperc": -0.026737967914438502,
                    "pan_lr": 0.5537190082644629,
                    "pan_lr_visperc": 0.2768595041322314,
                    "filter_q": 76.47058823529412,
                    "filter_q_visperc": -0.2647058823529412
                }
            },
            "effects": {
                "overdrive": {
                    "algorithmIndex": 0,
                    "knob_level": 50,
                    "curveAmount": 0.5
                },
                "convolver": {
                    "IRindex": 0,
                    "wetLevel": 0.49549119173544764,
                    "dryLevel": 0.5045088082645524,
                    "knob_level": 49.54911917354477
                }
                /*,
                        "tremolo": {},
                        "moog": {}*/
            }
        },

        {
            "global": {
                "name": "electricity",
                "loopLength": 6,
                "keyboard_offset": -624,
                "volume": 25
            },
            "keys": {
                "23": {
                    "vol": 0.30213903743315507,
                    "vol_visperc": -0.30213903743315507,
                    "pan_lr": -0.8271251193887297,
                    "pan_lr_visperc": -0.41356255969436484,
                    "filter_q": 38.970588235294116,
                    "filter_q_visperc": 0.11029411764705882,
                    "input_node": 2
                },
                "26": {
                    "vol": 0.2967914438502674,
                    "vol_visperc": -0.2967914438502674,
                    "pan_lr": 0.7279843444227005,
                    "pan_lr_visperc": 0.3639921722113503,
                    "filter_q": 40.44117647058824,
                    "filter_q_visperc": 0.09558823529411764,
                    "input_node": 2
                },
                "42": {
                    "vol": 0.3850267379679144,
                    "vol_visperc": -0.3850267379679144,
                    "pan_lr": 0.03305785123966942,
                    "pan_lr_visperc": 0.01652892561983471,
                    "filter_q": 45.58823529411765,
                    "filter_q_visperc": 0.04411764705882353,
                    "input_node": 1
                },
                "54": {
                    "vol": 0.029411764705882353,
                    "vol_visperc": -0.029411764705882353,
                    "pan_lr": 0.03305785123966942,
                    "pan_lr_visperc": 0.01652892561983471,
                    "filter_q": 61.76470588235294,
                    "filter_q_visperc": -0.11764705882352941,
                    "input_node": 2
                }
            },
            "effects": {
                "overdrive": {
                    "algorithmIndex": 1,
                    "knob_level": 50,
                    "curveAmount": 0.5,
                    "bypass": 0
                },
                "convolver": {
                    "IRindex": 0,
                    "wetLevel": 0.9971380383146734,
                    "dryLevel": 0.0028619616853265972,
                    "knob_level": 99.71380383146735,
                    "bypass": 0
                }
                /*,
                        "tremolo": {},
                        "moog": {}*/
            }
        },



        {
            "global": {
                "name": "drive",
                "loopLength": 4,
                "keyboard_offset": -624,
                "volume": 17
            },
            "keys": {
                "7": {
                    "vol": 0.553475935828877,
                    "vol_visperc": -0.553475935828877,
                    "pan_lr": 0,
                    "pan_lr_visperc": 0,
                    "filter_q": 52.94117647058824,
                    "filter_q_visperc": -0.029411764705882353,
                    "input_node": 2
                },
                "33": {
                    "vol": 0.5641711229946524,
                    "vol_visperc": -0.5641711229946524,
                    "pan_lr": 0,
                    "pan_lr_visperc": 0,
                    "filter_q": 53.67647058823529,
                    "filter_q_visperc": -0.03676470588235294,
                    "input_node": 2
                },
                "38": {
                    "vol": 0.4839572192513369,
                    "vol_visperc": -0.4839572192513369,
                    "pan_lr": -0.05555555555555555,
                    "pan_lr_visperc": -0.027777777777777776,
                    "filter_q": 58.82352941176471,
                    "filter_q_visperc": -0.08823529411764706,
                    "input_node": 2
                },
                "41": {
                    "vol": 0.5347593582887701,
                    "vol_visperc": -0.5347593582887701,
                    "pan_lr": 0,
                    "pan_lr_visperc": 0,
                    "filter_q": 69.11764705882354,
                    "filter_q_visperc": -0.19117647058823528,
                    "input_node": 2
                },
                "45": {
                    "vol": 0.4358288770053476,
                    "vol_visperc": -0.4358288770053476,
                    "pan_lr": 0,
                    "pan_lr_visperc": 0,
                    "filter_q": 71.32352941176471,
                    "filter_q_visperc": -0.21323529411764705,
                    "input_node": 2
                },
                "50": {
                    "vol": 0.49732620320855614,
                    "vol_visperc": -0.49732620320855614,
                    "pan_lr": -0.05555555555555555,
                    "pan_lr_visperc": -0.027777777777777776,
                    "filter_q": 64.70588235294119,
                    "filter_q_visperc": -0.14705882352941177,
                    "input_node": 2
                },
                "52": {
                    "vol": 0.5053475935828877,
                    "vol_visperc": -0.5053475935828877,
                    "pan_lr": 0.5185185185185185,
                    "pan_lr_visperc": 0.25925925925925924,
                    "filter_q": 59.55882352941176,
                    "filter_q_visperc": -0.09558823529411764,
                    "input_node": 2
                }
            },
            "effects": {
                "overdrive": {
                    "algorithmIndex": 2,
                    "knob_level": 82,
                    "curveAmount": 0.82
                },
                "convolver": {
                    "IRindex": 0,
                    "wetLevel": 0.9534384188183845,
                    "dryLevel": 0.04656158118161546,
                    "knob_level": 95.34384188183846
                }
                /*,
                        "tremolo": {},
                        "moog": {}*/
            }
        },

        {
            "global": {
                "name": "drive-p2",
                "loopLength": 4,
                "keyboard_offset": -624,
                "volume": 17
            },
            "keys": {
                "7": {
                    "vol": 0.553475935828877,
                    "vol_visperc": -0.553475935828877,
                    "pan_lr": 0,
                    "pan_lr_visperc": 0,
                    "filter_q": 52.94117647058824,
                    "filter_q_visperc": -0.029411764705882353,
                    "input_node": 2
                },
                "33": {
                    "vol": 0,
                    "vol_visperc": 0,
                    "pan_lr": 0,
                    "pan_lr_visperc": 0,
                    "filter_q": 53.67647058823529,
                    "filter_q_visperc": -0.03676470588235294,
                    "input_node": 2
                },
                "38": {
                    "vol": 0,
                    "vol_visperc": 0,
                    "pan_lr": -0.05555555555555555,
                    "pan_lr_visperc": -0.027777777777777776,
                    "filter_q": 58.82352941176471,
                    "filter_q_visperc": -0.08823529411764706,
                    "input_node": 2
                },
                "41": {
                    "vol": 0.20588235294117646,
                    "vol_visperc": -0.20588235294117646,
                    "pan_lr": 0,
                    "pan_lr_visperc": 0,
                    "filter_q": 69.11764705882354,
                    "filter_q_visperc": -0.19117647058823528,
                    "input_node": 2
                },
                "45": {
                    "vol": 0,
                    "vol_visperc": 0,
                    "pan_lr": 0,
                    "pan_lr_visperc": 0,
                    "filter_q": 71.32352941176471,
                    "filter_q_visperc": -0.21323529411764705,
                    "input_node": 2
                },
                "50": {
                    "vol": 0.5561497326203209,
                    "vol_visperc": -0.5561497326203209,
                    "pan_lr": -0.05555555555555555,
                    "pan_lr_visperc": -0.027777777777777776,
                    "filter_q": 64.70588235294119,
                    "filter_q_visperc": -0.14705882352941177,
                    "input_node": 2
                },
                "52": {
                    "vol": 0.20855614973262032,
                    "vol_visperc": -0.20855614973262032,
                    "pan_lr": 0.5185185185185185,
                    "pan_lr_visperc": 0.25925925925925924,
                    "filter_q": 59.55882352941176,
                    "filter_q_visperc": -0.09558823529411764,
                    "input_node": 2
                }
            },
            "effects": {
                "overdrive": {
                    "algorithmIndex": 2,
                    "knob_level": 82,
                    "curveAmount": 0.82
                },
                "convolver": {
                    "IRindex": 0,
                    "wetLevel": 0.9534384188183845,
                    "dryLevel": 0.04656158118161546,
                    "knob_level": 95.34384188183846
                }
                /*,
                        "tremolo": {},
                        "moog": {}*/
            }
        } //,
        //{ "global": { "name":"crystal", "loopLength": 4, "keyboard_offset": 0, "volume": "84" }, "keys": { "18": { "vol": 0.39325842696629215, "vol_visperc": -0.39325842696629215, "pan_lr": -0.010582010582010581, "pan_lr_visperc": -0.005291005291005291, "filter_q": 65.44117647058823, "filter_q_visperc": -0.15441176470588236 }, "33": { "vol": 0.31741573033707865, "vol_visperc": -0.31741573033707865, "pan_lr": 0, "pan_lr_visperc": 0, "filter_q": 75, "filter_q_visperc": -0.25 }, "37": { "vol": 0.5280898876404494, "vol_visperc": -0.5280898876404494, "pan_lr": 0.20105820105820105, "pan_lr_visperc": 0.10052910052910052, "filter_q": 83.08823529411765, "filter_q_visperc": -0.33088235294117646 }, "40": { "vol": 0.3539325842696629, "vol_visperc": -0.3539325842696629, "pan_lr": -0.4973544973544973, "pan_lr_visperc": -0.24867724867724866, "filter_q": 69.85294117647058, "filter_q_visperc": -0.19852941176470587 }, "47": { "vol": 0.23595505617977527, "vol_visperc": -0.23595505617977527, "pan_lr": 0.5537190082644629, "pan_lr_visperc": 0.2768595041322314, "filter_q": 76.47058823529412, "filter_q_visperc": -0.2647058823529412 } }, "effects": { "overdrive": { "algorithmIndex": 0, "knob_level": 50, "curveAmount": 0.5 }, "convolver": { "IRindex": 0, "wetLevel": 0.49549119173544764, "dryLevel": 0.5045088082645524, "knob_level": 49.54911917354477 } } }

    ]

    PresetsService.getDefaults = function() {
        //////console.log('defob');
        return defaultsOb;

    };

    PresetsService.getPresetsAr = function() {
        //////console.log('-------EF' + EffectsService.getOverDriveType());
        return presetsAr;
    };

    PresetsService.getCurState = function() {
        return curStateOb;
    };

    PresetsService.loadPreset = function(num) {
        //////console.log('-num' + num);
        curStateOb = presetsAr[num]; //copy
        //////console.log('-------EF' + EffectsService.getOverDriveType());
    }

    PresetsService.addActive = function(index) {
        curStateOb.keys[index] = {};
    };

    PresetsService.updateActive = function(index, params) {
        for (var prop in params) {
            curStateOb.keys[index][prop] = params[prop];
        }
        consoleLogObj(curStateOb)
    }
    PresetsService.setLoopLength = function(num) {
        curStateOb.global.loopLength = num;
        //console.log('SETcurStateOb.global.loopLength'+curStateOb.global.loopLength);
    };
    PresetsService.getLoopLength = function() {
        //console.log('GETcurStateOb.global.loopLength'+curStateOb.global.loopLength);
        return curStateOb.global.loopLength;
    };

    PresetsService.reset = function() {
        //console.log('reset');
        /*curStateOb = {
        global: {
            loopLength: 4,
            keyboard_offset:0,
            volume:50
        },*/
        curStateOb.keys = {},
            curStateOb.effects = {}
            //};
    };

    function consoleLogObj(obj) {
        var output = JSON.stringify(obj, null, 4);
        console.log(output);
    }

    return PresetsService;
}


angular
    .module('droneSynthApp')
    .factory('PresetsService', PresetsService);

PresetsService.$inject = ["EffectsService"]