const { default: mongoose } = require("mongoose");
const app = require('./app')
// mongoose.set("strictQuery", true);
// console.log(process.env.DB_URL || "mongodb://127.0.0.1/mahi");

// mongoose
//     .connect(process.env.DB_URL || "mongodb://127.0.0.1/mahi", { useNewUrlParser: true })
//     .catch((error) => console.log(error));

// mongoose.connection.on("connected", () => {
//     console.log("Mongoose default connection to ", process.env.DB_URL);
// })
// mongoose.connection.on("error", (err) => {
//     console.log("Mongoose connection has occured " + err + " err")
// })

// mongoose.connection.on("reconnected", () => {
//     console.log("Mongoose successfully reconnected ")
// })

// mongoose.connection.on("disconnected", () => {
//     console.log("Mongoose disconnected ")
// });

// process.on("SIGINT", () => mongoose.connection.close(() => process.exit()));

app.listen(process.env.PORT || 3000, () =>
    console.log(`server started on Port: ${process.env.PORT || 3000}`));

module.exports = app;