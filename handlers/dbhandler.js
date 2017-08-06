//Write All Mongo Queries Here
var config = require('../config/index');
var mongoose = require('mongoose');
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
    getTasks : function () {
        return new Promise(function (resolve, reject) {
            return models.tasks.find({}).then(function (tasks,err) {
                if(err)reject(err);
                    resolve(tasks)
                }).catch(function (error) {
                    reject(error)
                })
        });
    },
    login : function (data) {
        return new Promise(function(resolve,reject){
           return models.users.findOne({email:data.email,isActive:true}).then(function(user,err){
                if(err){
                    reject(err);
                }
                resolve(user)
            }).catch(function (error) {
               reject(error)
           })

        });
    }


}

module.exports = dbHandler







