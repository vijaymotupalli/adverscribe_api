var dbhandler = require('../../handlers/dbhandler');
var jwt = require('../../utils/jwt');
var moment = require("moment")

var authentication = {
    
    login:function (req,res) {

        var email = req.body.email;
        if(!email){
            return res.status(400).json({
                title:"Login Fail",
                msg:"Email Required"
            })
        }
        var data = {email:email}
        dbhandler.login(data).then(function (user) {
            if(!user){
                return res.status(401).json({
                    title: 'Invalid credentials',
                    msg: "Incorrect Username & Password "
                })
            }
            try{
                user.access_token =  jwt.generateAuthToken(user);
                return res.json(user)
            }catch(err){
                return res.status(400).json({
                    title: 'Login Fail',
                    msg: err
                })
            }
        },function (errMsg) {
            res.status(400);
            return res.json({
                title: 'Login Fail',
                msg: errMsg
            });
        })

    },
    addUserLog:function (req,res) {
        var userId = req.body.userId;
        var signInTime = moment();
        if(!userId){
            return res.status(400).json({
                title:"Log Fail",
                msg:"UserId Required"
            })
        }
        if(!signInTime){
            return res.status(400).json({
                title:"Log Fail",
                msg:"signInTime Required"
            })
        }
        var data = {userId:userId,signInTime:signInTime}

        dbhandler.addUserLog(data).then(function (userLog) {
                if (!userLog) {
                    return res.status(400).json({
                        title: 'Log Fail',
                        msg: "Something Went Wrong "
                    })
                }
                return res.status(200).json(userLog)
            },function (errMsg) {
            res.status(400);
            return res.json({
                title: 'Log Fail',
                msg: errMsg
            });
        })
    },
    editUserLog:function (req,res) {
        console.log("----rebody----",req.body)
        var logId = req.body.logId;
        var signOutTime = moment()
        if(!logId){
            return res.status(400).json({
                title:"Log Fail",
                msg:"logId Required"
            })
        }
        if(!signOutTime){
            return res.status(400).json({
                title:"Log Fail",
                msg:"signOutTime Required"
            })
        }
        var data = {signOutTime:signOutTime}

        dbhandler.editUserLog(logId,data).then(function (userLog) {
                if (!userLog) {
                    return res.status(400).json({
                        title: 'Log Fail',
                        msg: "Something Went Wrong "
                    })
                }
                return res.status(200).json(userLog)
            },function (errMsg) {
            res.status(400);
            return res.json({
                title: 'Log Fail',
                msg: errMsg
            });
        })
    },
}

module.exports = authentication