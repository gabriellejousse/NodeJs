
const mongoose = require('mongoose');



const Address = new mongoose.Schema({
    streetName: { type: String },
    streetNumber: { type: String },
    postCode: { type: String },
    city: { type: String }
})


const AddressModel = mongoose.model('Address', Address);


module.exports = AddressModel;


