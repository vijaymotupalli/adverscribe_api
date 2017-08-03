var dbhandler = require('../../handlers/dbhandler');
var jwt = require('../../utils/jwt');

var authentication = {
    
    login:function (req,res) {

        var email = req.body.email;
        if(!email){
            return res.status(400).json({
                title: 'Please Enter Valid Email',
                msg: "Email is required"
            })
        }
        var data = {
            email:email
        }
        dbhandler.login(data).then(function (user) {
            if(!user){
                return res.status(401).json({
                    title: 'User Not Found',
                    msg: "Please Contact Admin"
                })
            }
            return res.status(200).json(user)

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