let mongoose = require('mongoose');

let developerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    level: {
        type: String,
        validate: {
            validator: function(levelValue){
                return levelValue === "Beginner" || levelValue === "Expert";
            },
            message: "Status can only be 'InProgress' or 'Complete'. "
        },
        required: true
    },
    address: {
        state: String,
        suburb: String,
        street: String,
        unit: Number
    }
});

developerSchema.pre('save', function(){
    this.level = this.level.toUpperCase();
})

let developerModel = mongoose.model("Developer", developerSchema);
module.exports = developerModel;