const _ = require('lodash');
const dataParser = require('./dataParser');
const conf = require('../config.json');
const color = require('./randomColor');

module.exports.pausedAlert = function pausedAlert(newData) {

    newData = JSON.parse(newData);
    newData = dataFilter(newData);

    var fields = [];

    _.forEach(newData, (e) => {
        var arr =[];
        _.forEach(e.remarks, (x) => {
            arr.push({
                "value": `Station is ${x.station}, Due to ${x.Remarks}`,
                "short": false
            });
        });
        var temp = {
            "pretext": `Token Number ${e.Token} is Paused`,
            "color": color.color(),
            "fields": [
                {
                    "value": `Guide is ${e.guide}`,
                    "short": true
                }
            ]
        };
        arr.length > 0 ? arr.map(y=>{temp.fields.push(y)}) : null ;
        fields.push(temp);
    });
    //console.log(fields);
    if (fields.length > 0) {
        postToSlack(fields, conf[0].pausedChannel);
    }
}

function dataFilter(data) {
    var updatedData = [];
    _.forEach(data, (patient) => {
        if (patient.patient.isPaused) {
            var temp = [];
            _.forEach(patient.patient.stations, (station) => {
                if (station.remarks !== null) {
                    var remarks = {
                        "Remarks": station.remarks,
                        "station": station.code
                    }
                    temp.push(remarks);
                }
            });
            var newFilteredData = {
                "Token": patient.patient.tokenNumber,
                "guide": patient.patient.guide,
                "remarks": temp
            };
            updatedData.push(newFilteredData);
        }
    });

    return updatedData;
}

function postToSlack(temp, channel) {

    result = {
        "channel": `${channel}`,
        "text": `Patients Paused in the Queue`,
        "username": "KG Bot",
        "attachments": temp
    };

    dataParser.postToSlack(result);

}