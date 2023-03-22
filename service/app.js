const express = require("express");
const bodyParser = require('body-parser');
const deviceApi = require('./routes/device')
var cors = require('cors')

const app = express();


app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(cors())

app.use(bodyParser.json());

app.use('/api/devices', deviceApi);

app.use(function (err, req, res, next) {
    if (err) {
        let statuscode = err.statuscode || 500;
        res.status(statuscode).json({
            type: 'error',
            message: err.message || "Something went wrong"
        });
    } else {
        next();
    }
})

module.exports = app;