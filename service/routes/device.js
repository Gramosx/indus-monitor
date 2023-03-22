const express = require("express");
const api = express.Router();

const deviceController = require('../controllers/device/device.controller')
// const loggerController = require('../controllers/log/logger.controller')


api.post('/',
    deviceController.updateDeviceData
);

api.get('/',
    deviceController.getDeviceData
);

api.put('/trigger',
    deviceController.triggerDevice
);


module.exports = api;