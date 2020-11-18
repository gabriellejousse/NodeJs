
// on met 'date' en paramètre pour que l'on puisse 
// rentrer n'importe quelle date (en string) en paramètre et calculer l'age dans index.js : 
const ageFunc = function ageCalculator(date) {
    var today = new Date();
    var age = 0;
    var birthday = new Date(date)

    age = today.getFullYear() - birthday.getFullYear();

    return age;
}

//exporter la const qui contient la fonction de calculateur d'age pour l'envoyer dans index.js : 
module.exports = ageFunc;

