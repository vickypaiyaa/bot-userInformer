const _ = require('lodash');
const dataParser = require('./dataParser');
const conf = require('../config.json');
const color = require('./randomColor');

module.exports.checker = function checker(newData) {

    var stationCount = 0;
    newData = JSON.parse(newData);
    stationCount = newData.length;
    newData = dataFilter(newData);
    if (newData.length > 0 && stationCount !== newData.length + 1 ) {
        var str = newData.join("\n");
        var temp = [{
            "title": `${str}`,
            "color": color.color()
        }];
        //console.log(temp);
        postToSlack(temp, conf[0].stationChannel);
    }
}

function dataFilter(data) {

    var updatedData = [];

    _.forEach(data, (station) => {
        if (!station.isEnabled) {
            updatedData.push(station.code);
        }
    });

    return updatedData;
}

function postToSlack(temp, channel) {

    result = {
        "channel": `${channel}`,
        "text": `Closed Stations are,`,
        "username": "KG Bot",
        "attachments": temp
    };
    //console.log(result);
    dataParser.postToSlack(result);
}