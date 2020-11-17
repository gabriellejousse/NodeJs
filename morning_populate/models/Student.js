
const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const Student = new mongoose.Schema({
    firstName : { type : String },
    surname : { type : String },
    address : {
        type : mongoose.Types.ObjectId,
        ref : 'Address' 
    }
})


const StudentModel = mongoose.model('Student', Student);


module.exports = StudentModel;
