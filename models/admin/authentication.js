var dbhandler = require('../../handlers/dbhandler');
var jwt = require('../../utils/jwt');

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

    }


}

module.exports = authentication