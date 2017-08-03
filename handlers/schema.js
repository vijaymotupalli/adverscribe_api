var mongoose = require('mongoose'),
materializedPathPlugin = require('mongoose-materialized'),customId = require('mongoose-hook-custom-id');

// Creating  Schemas
var userSchema = new mongoose.Schema({
    name:{type:String},
    email:{type:String,required:true},
    role:{type:String,required:true},
    isActive:{type:Boolean,defaultValue:true}
},{ versionKey:false, timestamps:true})


//plugins
userSchema.plugin(customId, {mongoose: mongoose});


//models
var users = mongoose.model('users',userSchema,'users');

//exports


exports.users = users;
