const _ = require('lodash');
var data = require('../dataold.json');
var moment = require('moment');

var fs = require("fs");
var path = "datata.json";


module.exports.abc = function abc() {
    var datas = [];
    _.forEach(data, function (e) {
        console.log(e.patient.tokenNumber);
        var template = {
            "tokenNumber": e.patient.tokenNumber,
            "Station": []
        };
        _.forEach(e.patient.stations, function (y) {
            if (y.code === "XRAY" ) {

                var temp = {
                    "station": y.code,
                    "AssignTime" : moment.utc(y.assignment).local().format('YYYY-MM-DD HH:mm:ss'),
                    "checkIn": moment.utc(y.checkin).local().format('YYYY-MM-DD HH:mm:ss'),
                    "checkOut": moment.utc(y.checkout).local().format('YYYY-MM-DD HH:mm:ss')
                }
                template.Station.push(temp);
            }
        });
        datas.push(template);
    });

    fs.writeFile(path, JSON.stringify(datas), function (error) {
        if (error) {
            console.error("write error:  " + error.message);
        } else {
            console.log("Successful Write to " + path);
        }
    });
    //console.log(JSON.stringify(datas));
}

