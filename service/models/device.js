const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    deviceId: { type: String },
    data: { type: Object },
    location: { type: String }
});

const Device = mongoose.model('Device', deviceSchema);


exports.updateDeviceData = async (payload) => {
    const { deviceId, data } = payload;
    console.log(payload)
    return "Ok"
    // return await Device.findOneAndUpdate({ deviceId }, { data }, { new: true, upsert: true });

}