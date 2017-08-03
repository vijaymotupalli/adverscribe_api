var jwt = require('jwt-simple');
var config = require('../config/index')

var _jwt={

    generateAuthToken:function (user) {

        var given_expire = config.auth.admin.tokenExpiry//expires in 7 days by default
        var dateObj = new Date();
        var expires = dateObj.setDate(dateObj.getDate() + given_expire) // 7 days

        var token = jwt.encode({
            exp: expires,
            user:user
        },config.auth.admin.authSecret);

        return token;
    },

    decodeToken:function(token){
        return  jwt.decode(token, config.auth.admin.authSecret);
    }


}

module.exports = _jwt;