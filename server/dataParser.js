const request = require('request');
const conf = require('../config.json');

module.exports.postToSlack = function postToSlack(temp) {

    request({
        url: conf[0].webhookUrl, //URL to hit
        method: 'POST',
        body: result,
        json: true
    }, function (error, response, body) {
        if (error) {
            console.log(error);
            return;
        }
        console.log(response.body);
    });
}

