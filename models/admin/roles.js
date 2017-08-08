/**
 * Created by Vijay on 27-Jun-17.
 */
var dbhandler = require('../../handlers/dbhandler');
var config = require('../../config/index')

var roles = {

    getRoles:function (req,res) {
        dbhandler.getRoles().then(function (roles) {
            return res.json(roles)
        },function (errMsg) {
            res.status(400);
            return res.json({
                status: 400,
                title: 'Fail To Found Roles',
                msg: errMsg
            });
        });
    },

}

module.exports = roles