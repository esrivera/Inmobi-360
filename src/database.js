const admin = require('firebase-admin');
var serviceAccount = require('../proyecto-inmobiliario-firebase-adminsdk-72y63-f4aaa7c321.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://proyecto-inmobiliario.firebaseio.com/'
  });

module.exports = admin;