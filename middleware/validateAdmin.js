
var utils = require('../utils/jwt');
var dbhandler = require("../handlers/dbhandler");

module.exports = function(req, res, next) {
    var token = req.headers['accesstoken'];
    if (token) {
       try {
            var adminData = utils.decodeToken(token);
        } catch (err) {
            res.status(400);
           return res.json({
                "title": "Invalid Token",
                "msg": err
            });
        }
            if (adminData.exp <= Date.now()) {
                res.status(401);
                return res.json({
                    "title": "Access Token Expired",
                    "msg":"Generate New One"
                });
            }

            next();

    } else {
        res.status(401);
        return  res.json({
            "status": 401,
            "title":"Access Denied",
            "msg": "Blank or Invalid Access Token"
        });
    }
};