//Write All Mongo Queries Here
var config = require('../config/index');
var mongoose = require('mongoose');
var moment = require('moment');
var models = require('../handlers/schema');

mongoose.connect(config.db.host,{user:config.db.username,pass:config.db.password,auth: {
    authdb: 'admin'
}},function (err) {
    if(err){
        console.log("----DATABASE CONNECTION FAILED----",err);
    }else{
        console.log("connected to database"+" "+config.db.database+" ");
    }
});

var db = mongoose.connection.db ;

var dbHandler = {
    getRoles : function () {
        return new Promise(function(resolve,reject){
            db.collection('roles', function(err, collection) {
                collection.find().toArray(function (err,roles) {
                    if(!err){
                        resolve(roles)
                    }
                    reject(err);
                })
            });
        });
    },
    addUser : function (data) {
        return new Promise(function (resolve, reject) {
            return models.users.findOne({email:data.email}).then(function (email,err) {
                if(email){
                  return  reject("Email Already Exists")
                }
                if(err)reject(err);
                return models.users.create({
                    email: data.email,
                    name: data.name,
                    role: data.role,
                    isActive: true
                }).then(function (user, err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(user)
                }).catch(function (error) {
                    reject(error)
                })
            })
        });
    },
    editUser : function (data) {
        return new Promise(function (resolve, reject) {
                return models.users.update({email:data.email},{
                    name: data.name,
                    role: data.role,
                    isActive: data.isActive
                }).then(function (user, err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(user)
                }).catch(function (error) {
                    reject(error)
                })

        });
    },
    addTask : function (taskData) {
        return new Promise(function (resolve, reject) {
                return models.tasks.create(taskData).then(function (task, err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(task)
                }).catch(function (error) {
                    reject(error)
                })

        });
    },
    editTask : function (taskId,taskData) {
        return new Promise(function (resolve, reject) {
            return models.tasks.update({_id:taskId},taskData).then(function (task, err) {
                if (err) {
                    reject(err);
                }
                resolve(task)
            }).catch(function (error) {
                reject(error)
            })

        });
    },
    getUsers : function () {
        return new Promise(function (resolve, reject) {
            console.log("---iam in above users---")
            return models.users.find({}).then(function (users,err) {
                console.log("---iam in gt users---")
                if(err)reject(err);
                    resolve(users)
                }).catch(function (error) {
                    reject(error)
                })
        });
    },
    getUserDetails : function (userData) {
        return new Promise(function (resolve, reject) {
            console.log("---iam in above users---")
            return models.users.findOne({email:userData.email}).then(function (user,err) {
                console.log("---iam in gt users---")
                if(err)reject(err);
                    resolve(user)
                }).catch(function (error) {
                    reject(error)
                })
        });
    },
    getTasks : function () {
        return new Promise(function (resolve, reject) {
            return models.tasks.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "assignTo",
                        foreignField: "_id",
                        as: "assignTo"
                    }
                },{$addFields:{"assignTo":{ $arrayElemAt: [ "$assignTo", 0 ] }}},{$project:{"assignTo.createdAt":0,"assignTo.updatedAt":0,"assignTo.role":0,"assignTo._id":0}}
            ],function (err,tasks) {
                if(!err)resolve(tasks)
                reject(err)
                })
        });
    },
    getUserTasks : function (userData) {
        return new Promise(function (resolve, reject) {
            return models.users.aggregate([
                {$match:{email:userData.email}},
                {$lookup:{
                    from:'tasks',
                    localField:'_id',
                    foreignField:'assignTo',
                    as:'tasks'
                }},
                {$project:{todayTasks: {
                    $filter: {
                        input: "$tasks",
                        as: "task",
                        cond: { $eq: [ {$dateToString: { format: "%d-%m-%Y", date: "$$task.startDate" }},moment().format("DD-MM-YYYY")]}
                    }
                },upcomingTasks: {
                    $filter: {
                        input: "$tasks",
                        as: "task",
                        cond: { $gt: [{$dateToString: { format: "%d-%m-%Y", date: "$$task.startDate" }}, moment().format("DD-MM-YYYY")]}
                    }
                },pendingTasks: {
                    $filter: {
                        input: "$tasks",
                        as: "task",
                        cond: { $lt: [{$dateToString: { format: "%d-%m-%Y", date: "$$task.startDate" }}, moment().format("DD-MM-YYYY")]}
                    }
                }}}
            ],function (err,tasks) {
                if(!err)
                resolve(tasks.pop());
                reject(err);
            })
        })
    },
    login : function (data) {
        return new Promise(function(resolve,reject){
            models.users.aggregate([
                    {"$match": { email:data.email,isActive:true}},
                    {$lookup: {
                        from: "roles",
                        localField: "role",
                        foreignField: "role",
                        as: "role"
                    }},{$addFields:{role:{ $arrayElemAt: [ "$role", 0 ] }}},{$project:{"role._id":0}}
                ],
                function (err,user) {
                    if(!err){
                            resolve(user.pop())
                    }reject(err);
                })
        });
    },
    addUserLog : function (data) {
        return new Promise(function(resolve,reject){
                return models.userLog.create({
                    userId: data.userId,
                    signInTime: data.signInTime
                }).then(function (userLog, err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(userLog)
                }).catch(function (error) {
                    reject(error)
                })
        });
    },
    editUserLog : function (logId,data) {
        return new Promise(function(resolve,reject){
                return models.userLog.update({_id:logId},{signOutTime:data.signOutTime}).then(function (userLog, err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(userLog)
                }).catch(function (error) {
                    reject(error)
                })
        });
    },
    getUserLog : function (userData) {
        return new Promise(function (resolve, reject) {
            return models.userLog.find({userId:userData.userId}).sort({createdAt: -1}).then(function (userLog,err) {
                if(err)reject(err);
                resolve(userLog)
            }).catch(function (error) {
                reject(error)
            })
        });
    },


}

module.exports = dbHandler







