var mongoose = require('mongoose'),
materializedPathPlugin = require('mongoose-materialized'),customId = require('mongoose-hook-custom-id');

// Creating  Schemas
var userSchema = new mongoose.Schema({
    name:{type:String},
    email:{type:String,required:true},
    role:{type:String,required:true},
    isActive:{type:Boolean,defaultValue:true}
},{ versionKey:false, timestamps:true})


var taskSchema = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String},
    startDate:{type:Date,required:true},
    endDate:{type:Date,required:true},
    assignTo:{type:String,required:true},
    status:{type:String}
},{ versionKey:false, timestamps:true})


var logSchema = new mongoose.Schema({
    date:{type:Date,default: Date.now},
    signInTime:{type:Date,required:true},
    signOutTime:{type:Date},
    userId:{type:String,required:true}
},{ versionKey:false, timestamps:true})

//plugins
userSchema.plugin(customId, {mongoose: mongoose});


//models
var tasks = mongoose.model('tasks',taskSchema,'tasks');
var users = mongoose.model('users',userSchema,'users');
var userLog = mongoose.model('userLog',logSchema,'userLog');

//exports


exports.users = users;
exports.tasks = tasks;
exports.userLog = userLog;
