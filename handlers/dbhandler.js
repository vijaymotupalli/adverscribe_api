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
    editTask : function (taskId,data) {
        return new Promise(function (resolve, reject) {
            return models.tasks.update({_id:taskId},{
                title: data.title,
                description: data.description,
                startDate: data.startDate,
                endDate: data.endDate,
                assignTo: data.assignTo,
                status:data.status
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
    // editTask : function (taskId,taskData) {
    //     return new Promise(function (resolve, reject) {
    //         return models.tasks.update({_id:taskId},taskData).then(function (task, err) {
    //             if (err) {
    //                 reject(err);
    //             }
    //             resolve(task)
    //         }).catch(function (error) {
    //             reject(error)
    //         })
    //
    //     });
    // },
    getUsers : function () {
        return new Promise(function (resolve, reject) {
            return models.users.find({}).then(function (users,err) {
                if(err)reject(err);
                    resolve(users)
                }).catch(function (error) {
                    reject(error)
                })
        });
    },
    getUserDetails : function (userData) {
        return new Promise(function (resolve, reject) {
            return models.users.findOne({email:userData.email}).then(function (user,err) {
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
                },{$addFields:{"assignTo":{ $arrayElemAt: [ "$assignTo", 0 ] }}},{$project:{"assignTo.createdAt":0,"assignTo.updatedAt":0,"assignTo.role":0}}
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
                {$project:{name:1,
                    todayTasks: {
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
                }}},{$addFields:{"upcomingTasks.assignTo":{name:"$name",_id:"$_id"},"todayTasks.assignTo":{name:"$name",_id:"$_id"},"pendingTasks.assignTo":{name:"$name",_id:"$_id"}}}
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
                    signInTime: data.signInTime,
                    date:data.date
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
            return models.userLog.aggregate({$match:{userId:userData.userId}},
                {$group:{_id:{Day:{ $dayOfMonth: "$date" },Month:{ $month: "$date" },Year:{ $year: "$date" }},log:{$push:{signIn:"$signInTime",signOut:"$signOutTime"}},date:{$first: "$date"}}},
                {$project:{_id:0}},{$sort:{date:-1,"log.signIn":-1}}).then(function (userLog,err) {
                if(err)reject(err);
                resolve(userLog)
            }).catch(function (error) {
                reject(error)
            })
        });
    },
    postUserTimeData :function (timeData) {
        return new Promise(function(resolve,reject){
            return models.timeTracker.create(timeData).then(function (timeData, err) {
                if (err) {
                    reject(err);
                }
                resolve(timeData)
            }).catch(function (error) {
                reject(error)
            })
        });
    },
    getUserSelectedDateTimeData : function (userId,date) {
        return new Promise(function(resolve,reject){
            return models.timeTracker.aggregate({$match:{userId:userId,date:new Date(date)}}).then(function (timeData, err) {
                if (err) {
                    reject(err);
                }
                resolve(timeData)
            }).catch(function (error) {
                reject(error)
            })
        });

    } ,
    getUserMonthlyTimeData : function (userId,month,year) {

        console.log("----data----",userId,month,year);
        return new Promise(function(resolve,reject){
            return models.timeTracker.aggregate([{$match:{userId:userId}},
                {
                    $group : {
                        _id : { month: { $month: "$date" }, day: { $dayOfMonth: "$date" }, year: { $year: "$date" } },start:{$first: "$date"},
                        hourstomins: { $sum: { $multiply: [ "$hours", 60 ] }},mins:{$sum:"$mins"}
                    }
                },{$match:{"_id.month":month,"_id.year":year}},
                {$project:{totalMins:{ $add: [ "$hourstomins", "$mins" ] },start:1,_id:0}},
                {$addFields:{hours:{ $floor: { $divide: [ "$totalMins", 60 ] } },mins:{ $mod: [ "$totalMins", 60 ] },
                    end:"$start",
                    start:"$start",
                    eventClasses: { $literal: "optionalEvent" }}},
                {$project:{totalMins:0}}

            ]).then(function (monthlyData, err) {
                if (!err) {
                    monthlyData.forEach(function (data) {
                        data.start = moment(data.start).format("YYYY-MM-DD")
                        data.end = moment(data.end).format("YYYY-MM-DD")
                    })
                    resolve(monthlyData)
                }
                reject(err);
            }).catch(function (error) {
                reject(error)
            })
        });

    }

}

module.exports = dbHandler







