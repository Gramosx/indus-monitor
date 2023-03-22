let data = {};
let triggerState = false;
exports.updateDeviceData = (req, res, next) => {
    data = req.body
    res.send(triggerState ? "success" : 'stop')
}

exports.getDeviceData = (req, res, next) => {
    let devices = [
        { ...data, state: triggerState }
    ]
    res.send(devices)
}

exports.triggerDevice = (req, res, next) => {
    triggerState = req.body.trigger;
    res.send();
}