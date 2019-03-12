const _ = require('lodash');
const conf = require('../config.json');
const moment = require('moment');
const color = require('./randomColor');
const dataParser = require('./dataParser');

module.exports.compare = function compare(newData) {

    newData = JSON.parse(newData);
    newData = dataFilter(newData);

    var fields = [];

    _.forEach(newData, (e) => {
        if (e.Tokens.length > 0) {
            var longWaitingTokens = "";
            _.forEach(e.Tokens, (x) => {
                longWaitingTokens += x.Token + ", ";
            });
            var temp = {
                "title": `${e.StationData}`,
                "color": color.color(),
                "fields": [
                    {
                        "title": `${longWaitingTokens.substring(0, longWaitingTokens.length - 2)}`,
                        "short": false
                    }
                ]
            };
            fields.push(temp);
        }
    });

    if (fields.length > 0) {
        postToSlack(fields, conf[0].delayedChannel);
    }
}

function postToSlack(temp, channel) {

    result = {
        "channel": `${channel}`,
        "text": `Patients waiting in the Queue for more than *${conf[0].waitingTimeDelay} mins*`,
        "username": "KG Bot",
        "attachments": temp
    };

    dataParser.postToSlack(result);
    
}

function dataFilter(data) {

    console.log(moment().utc().format("HH:mm"));
    var newFilteredData = [];

    _.forEach(data, (e) => {
        var template = {
            "StationData": e.code,
            "Tokens": []
        };
        _.forEach(e.patients, (x) => {
            _.forEach(x.stations, (y) => {
                if (y.code === e.code && y.assignment !== null) {
                    var temp = {
                        "Token": x.tokenNumber,
                        "assignmentLocal": moment.utc(y.assignment).local().format('HH:mm'),
                        "assignment": moment.utc(y.assignment).format('HH:mm'),
                        "difference": parseInt((moment.utc(y.assignment).format('HH:mm') > moment().utc().format("HH:mm")) ? "0" : moment.utc(moment(moment().utc().format("HH:mm"), "HH:mm").diff(moment(moment.utc(y.assignment).format('HH:mm'), "HH:mm"))).format("mm"))
                    };

                    if (temp.difference > conf[0].waitingTimeDelay)
                        template.Tokens.push(temp);
                    //console.log(y);
                }
            });
        });
        newFilteredData.push(template);
    });

    return newFilteredData;
}