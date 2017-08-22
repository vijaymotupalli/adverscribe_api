var auth = require('../models/admin/authentication');
var users = require('../models/admin/user');
var tasks = require('../models/admin/task');
var roles = require('../models/admin/roles');

module.exports = function (app) {

    app.post('/api/users',users.addUser);
    app.put('/api/users',users.editUser);
    app.post('/api/tasks',tasks.addTask);
    app.get('/api/users',users.getUsers);
    app.get('/api/users/roles',roles.getRoles);
    app.get('/api/users/:email',users.getUserDetails);
    app.get('/api/tasks/:userId',tasks.getUserTasks);
    app.get('/api/tasks',tasks.getTasks);
    app.post('/login',auth.login);
    app.post('/api/userlog',auth.addUserLog);
    app.put('/api/userlog',auth.editUserLog);
    app.get('/api/userlog/:userId',users.getUserLog);

}




