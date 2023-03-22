const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const loogerSchema = new Schema({
    deviceId: { type: String },
    data: { type: Object },
    location: { type: String },
    loggedAt: { type: Date }
});

const Logger = mongoose.model('Logger', loogerSchema);


exports.LogDeviceData = async (payload) => {
    let dt = new Date();
    console.log(dt)
    return await Logger.create({ ...payload, loggedAt: dt })
}

exports.GetLogsOfDevice = async (deviceId) => {
    return await Logger.find({ deviceId });
}