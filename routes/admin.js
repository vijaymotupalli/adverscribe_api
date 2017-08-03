var auth = require('../models/admin/authentication');
var users = require('../models/admin/user');




module.exports = function (app) {

    app.post('/users',users.addUser);
    app.get('/users',users.getUsers);
    app.post('/login',auth.login);


}




