var auth = require('../models/admin/authentication');
var users = require('../models/admin/user');
var tasks = require('../models/admin/task');

module.exports = function (app) {

    app.post('/users',users.addUser);
    app.post('/tasks',tasks.addTask);
    app.get('/users',users.getUsers);
    app.get('/tasks',tasks.getTasks);
    app.post('/login',auth.login);

}




