var mongoose = require('mongoose');

var PaymentSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    amount: { type: Number, unique: false, required: true },
    date: { type: Date, unique: false, required: true },
    type: { type: String, unique: false, required: true },
    category: { type: String, unique: false, required: true },
    description: { type: String, unique: false, required: false },
    cardType: { type: String, unique: false, required: false }
});

module.exports = PaymentSchema;