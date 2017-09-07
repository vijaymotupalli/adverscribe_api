var dbhandler = require('../../handlers/dbhandler');
var config = require('../../config/index')
var utils = require('../../utils/jwt');
var moment = require("moment");


var timeTracker = {

    postUserTimeData:function (req,res) {

        var token = req.headers['accesstoken'];

            try {
                var userData = utils.decodeToken(token);
            } catch (err) {
                res.status(400);
                return res.json({
                    "title": "Invalid Token",
                    "msg": err
                });
            }

        var userId = userData.user.email
        var timeData = {
            date:req.body.date,
            userId:userId,
            hours:req.body.hours,
            mins:req.body.mins,
            project:req.body.project,
            description:req.body.description
        }

        dbhandler.postUserTimeData(timeData).then(function (timeData) {
            return res.json(timeData)
        },function (errMsg) {
            res.status(400);
            return res.json({
                status: 400,
                title: 'Fail To Add Time Data',
                msg: errMsg
            });
        });
    },
    getUserSelectedDateTimeData:function (req,res) {

        var token = req.headers['accesstoken'];

            try {
                var userData = utils.decodeToken(token);
            } catch (err) {
                res.status(400);
                return res.json({
                    "title": "Invalid Token",
                    "msg": err
                });
            }

        var userId = userData.user.email
        var date = req.query.date
        dbhandler.getUserSelectedDateTimeData(userId,date).then(function (timeData) {
            return res.json(timeData)
        },function (errMsg) {
            res.status(400);
            return res.json({
                status: 400,
                title: 'Fail To get Time Data',
                msg: errMsg
            });
        });
    },
    getUserMonthlyTimeData:function (req,res) {

        var token = req.headers['accesstoken'];

            try {
                var userData = utils.decodeToken(token);
            } catch (err) {
                res.status(400);
                return res.json({
                    "title": "Invalid Token",
                    "msg": err
                });
            }

        var userId = userData.user.email
        var month = Number(req.query.month)
        var year = Number(req.query.year)
        dbhandler.getUserMonthlyTimeData(userId,month,year).then(function (monthlyData) {
            return res.json(monthlyData)
        },function (errMsg) {
            res.status(400);
            return res.json({
                status: 400,
                title: 'Fail To get Time Data',
                msg: errMsg
            });
        });
    },
}

module.exports = timeTracker