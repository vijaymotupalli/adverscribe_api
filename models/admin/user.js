/**
 * Created by Vijay on 27-Jun-17.
 */
var dbhandler = require('../../handlers/dbhandler');
var config = require('../../config/index')

var user = {

    addUser:function (req,res) {

        var email = req.body.email;
        var name = req.body.name;
        var role = req.body.role;

        var userData = {
            email:email,
            name:name,
            role:role
        }

        dbhandler.addUser(userData).then(function (user) {
            return res.json(user)
        },function (errMsg) {
            res.status(400);
            return res.json({
                status: 400,
                title: 'Fail To Add User',
                msg: errMsg
            });
        });
    },
    editUser:function (req,res) {

        var email = req.body.email;
        var name = req.body.name;
        var role = req.body.role;
        var isActive = req.body.isActive;

        var userData = {
            email:email,
            name:name,
            role:role,
            isActive:isActive
        }
        dbhandler.editUser(userData).then(function (user) {
            return res.json(user)
        },function (errMsg) {
            res.status(400);
            return res.json({
                status: 400,
                title: 'Fail To Edit User',
                msg: errMsg
            });
        });
    },
    getUsers:function (req,res) {
        dbhandler.getUsers().then(function (users) {
            return res.json(users)
        },function (errMsg) {
            res.status(400);
            return res.json({
                status: 400,
                title: 'Fail To Get Users',
                msg: errMsg
            });
        });
    },
    getUserDetails:function (req,res) {
        var email = req.params.email
        var userData = {email:email}
        dbhandler.getUserDetails(userData).then(function (user) {
            return res.json(user)
        },function (errMsg) {
            res.status(400);
            return res.json({
                status: 400,
                title: 'Fail To Get Users',
                msg: errMsg
            });
        });
    },
    getUserLog:function (req,res) {
        var userId = req.params.userId
        var userData = {userId:userId}
        dbhandler.getUserLog(userData).then(function (userLog) {
            return res.json(userLog)
        },function (errMsg) {
            res.status(400);
            return res.json({
                status: 400,
                title: 'Fail To Get User Log',
                msg: errMsg
            });
        });

    }
}

module.exports = user