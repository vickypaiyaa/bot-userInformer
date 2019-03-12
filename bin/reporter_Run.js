'use strict';

const service = require('../server/service');
const http = require('http');
const request = require('request');
const conf = require('../config.json');
const compareHelper = require('../server/compare');
const jumpAlert = require('../server/jumpalert');
const pausedAlert = require('../server/pausedAlert');
const dataParser = require('../server/dataParser');
const disabledStationsChecker = require('../server/disabledStationsChecker');
const server = http.createServer(service);

server.listen();

server.on('listening', function () {
    console.log(`bothelper is listening on ${server.address().port} in ${service.get('env')}`);

    const stationStatus = () => {
        request.get(conf[0].url + '/stations', (err, response) => {
            if (err) {
                console.log(err);
                console.log("there is a error to get data");
                return;
            }

            compareHelper.compare(response.body);
        });

    };

    const patientStatus = () => {
        request.get(conf[0].url + '/patients', (err, response) => {
            if (err) {
                console.log(err);
                console.log("there is a error to get data");
                return;
            }
            jumpAlert.jumpAlert(response.body);
        });
    }

    const pausedStatus = () => {
        request.get(conf[0].url + '/patients', (err, response) => {
            if (err) {
                console.log(err);
                console.log("there is a error to get data");
                return;
            }
            pausedAlert.pausedAlert(response.body);
        });
    }

    const disabledStations = () => {
        request.get(conf[0].url + '/stations', (err, response) => {
            if (err) {
                console.log(err);
                console.log("there is a error to get data");
                return;
            }

            disabledStationsChecker.checker(response.body);
        });
    }

    stationStatus();
    patientStatus();
    pausedStatus();
    disabledStations();

    setInterval(stationStatus, 60 * 1000 * conf[0].waitingTimeDelay);
    setInterval(patientStatus, 60 * 1000 * conf[0].waitingTimeExceptions);
    setInterval(pausedStatus, 60 * 1000 * conf[0].pausedTimeChecker);
    setInterval(disabledStations, 60 * 1000 * conf[0].disabledStationsTime);
});