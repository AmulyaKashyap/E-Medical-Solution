const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    doctorId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Doctor",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
});

module.exports = mongoose.model("doctortoken", tokenSchema);