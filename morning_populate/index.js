
const mongoose = require('mongoose');
const AddressModel = require('./models/Address');
const StudentModel = require('./models/Student');



mongoose.connect('mongodb://localhost:27017/mongoose_populate', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => console.log(err))



/////////

const address1 = new AddressModel({
    streetName: "Rue des écoles",
    streetNumber: "59",
    postCode: "93300",
    city: "Aubervilliers"
})
address1.save().then(data => {
    let addressId = AddressModel.findById(data._id, function (err, result) {
        const ID = result
        console.log("result", result)
    })
})
    .catch(err => console.log(err))




// récupérer l'id de address1 :

/* let addressId = AddressModel.findById(data._id).then( result => {
    console.log("result", result)
}) */


/*  async function addressFunc() {
    const addressId = await AddressModel.findOne({ _id: "5fb29c610319c1cc48e0414c" }).exec()
    console.log("addressId:", addressId)
}
addressFunc()
 */




// Nouveau student : 

const student1 = new StudentModel({
    firstName: 'Gabrielle',
    surname: 'Jousse',
    address: address1._id
})
student1.save().then(res => {
    StudentModel
        .findOne({ _id: student1._id })
        .populate('address')
        .exec((err, res) => {
            console.log('The result is', res);
        });
})


const address2 = new AddressModel({
    streetName: "Rue Faure",
    streetNumber: "28",
    postCode: "92300",
    city: "Clichy"
})


