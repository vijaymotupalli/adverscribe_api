/**
 * Created by Vijay on 27-Jun-17.
 */
var dbhandler = require('../../handlers/dbhandler');
var config = require('../../config/index')

var task = {

    addTask:function (req,res) {

        var title = req.body.title;
        var description = req.body.description;
        var startDate = req.body.startDate;
        var endDate = req.body.endDate;
        var assignTo = req.body.assignTo;

        var taskData = {
            title:title,
            description:description,
            startDate:startDate,
            endDate:endDate,
            assignTo:assignTo

        }
        dbhandler.addTask(taskData).then(function (task) {
            return res.status(200).json(task)
        },function (errMsg) {
            res.status(400);
            return res.json({
                status: 400,
                title: 'Fail To Add Task',
                msg: errMsg
            });
        });
    }
}

module.exports = task