const _ = require('lodash');
const dataParser = require('./dataParser');
const conf = require('../config.json');
const color = require('./randomColor');
const moment = require('moment');

module.exports.jumpAlert = function jumpAlert(newData) {

    newData = JSON.parse(newData);
    newData = dataFilter(newData);

    //console.log(JSON.stringify(newData));
    var fields = [];

    _.forEach(newData, (e) => {

        var stations;
        var tokens;
        var data = "";
        _.forEach(e, (x) => {
            _.forEach(x.jumpedStation, (y) => {
                stations = "";
                tokens = "#";
                tokens += x.Token;
                stations += y.code + ", ";
                data += tokens + "\t=> " + stations + `\t=> InTime : ${moment.utc(y.InTime).local().format('HH:mm')} \t=> OutTime: ${moment.utc(y.OutTime).local().format('HH:mm')} \n\n`
            });
        });

        var temp = {
            "pretext": `Guide is ${e[0].guide}`,
            "color": color.color(),
            "fields": [
                {
                    "value": `${data}`,
                    "short": true
                }
            ]
        };

        fields.push(temp);
    });
    if (fields.length > 0) {
        postToSlack(fields, conf[0].exceptionsChannel);
    }
}

function dataFilter(data) {

    var updatedData = [];

    _.forEach(data, (patient) => {
        _.forEach(patient.patient.stations, (station) => {
            if (station.assignment === null && (station.checkin !== null || station.checkout !== null) && station.visitName !== "PD" && station.visitName !== "PP") {
                var newFilteredData = {
                    "Token": patient.patient.tokenNumber,
                    "guide": patient.patient.guide,
                    "jumpedStation": []
                };
                //console.log(station.checkout);
                newFilteredData.jumpedStation.push({ "code": station.code, "InTime": station.checkin, "OutTime": station.checkout });
                updatedData.push(newFilteredData);
            }

        });
    });
    updatedData = _.groupBy(updatedData, 'guide')
    return updatedData;
}

function postToSlack(temp, channel) {

    result = {
        "channel": `${channel}`,
        "text": `Patients Jumped in the Queue`,
        "username": "KG Bot",
        "attachments": temp
    };

    //console.log(JSON.stringify(result));
    dataParser.postToSlack(result);
}

