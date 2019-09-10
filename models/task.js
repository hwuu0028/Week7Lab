let mongoose = require('mongoose');

let taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },

    assign: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "Developer"
    },
    dueDate: {
        type: Date
    },
    taskStatus: { 
        type: String,
        validate: {
            validator: function(statusValue){
                return statusValue === "InProgress" || statusValue === "Complete";
            },
            message: "Status can only be 'InProgress' or 'Complete'. "
        }
    },
    taskDesc: String
});

let taskModel = mongoose.model('Task', taskSchema);
module.exports = taskModel;