
//brew services start mongodb
let express = require('express');
let app = express();
let mongoose = require('mongoose');
let bodyparser = require('body-parser');
let ejs = require('ejs');

app.engine('html',ejs.renderFile);
app.set('view engine', 'html');

app.use(bodyparser.urlencoded({extended: false}));

app.use(express.static('public'));
app.use(express.static('images'));
app.use(express.static('css'));

let url = "mongodb://localhost:27017/week7lab";

mongoose.connect(url, function(err){
    if (err) {
        throw err;
    }else {
        console.log("Successfully Connected");
    }
});

let Task = require('./models/task');
let Developer = require('./models/developer');

// Adds new task
app.get('/addTask',function(req,res){
    res.render('addTask.html');
});

app.post('/addNewTask', function(req, res){
    let task = new Task({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.taskName,
        assign: req.body.assignTo,
        dueDate: new Date(req.body.dueDate),
        taskStatus: req.body.taskStatus,
        taskDesc: req.body.taskDesc
    });

    task.save(function (err){
        if (err) {
            console.log(err);
        }
        else{
            res.redirect('/addTask');
        }
    });
});

// Adds new developer
app.get('/addDeveloper', function(req, res){
    res.render("addDeveloper.html");
});

app.post('/addNewDeveloper', function(req, res){
    let developer = new Developer({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        },
        level: req.body.level,
        address: {
            state: req.body.state,
            suburb: req.body.suburb,
            street: req.body.street,
            unit: parseInt(req.body.unit)
        }
    });

    developer.save(function (err){
        if (err) {
            console.log(err);
        }
        else{
            res.redirect('/addDeveloper');
        }
    });
});

// List all Task
app.get('/listTasks', function(req, res){
    Task.find().populate('task').exec(function(err, result){
        res.render('listTasks.html', {task: result});
    })
});

app.get('/listDevelopers', function(req, res){
    Developer.find().populate('developer').exec(function(err, result){
        res.render('listDevelopers.html', {developer: result});
    })
});

// Deletes Task by Id
app.get('/deleteTask', function(req, res){
    res.render('deleteTask.html');
    
})

app.post('/deleteTaskData', function(req, res){
    let deleteID = req.body.taskID;
    Task.deleteOne({ _id: deleteID}, function(err, doc){
        console.log(doc);
    })
    res.redirect('/listTasks');
});

// Delete All Completed task
app.get('/deleteAllCompleted', function(req, res){
    Task.deleteMany({'taskStatus': 'Complete'}, function(err, doc){
        console.log(doc);
    })
    res.redirect('/listTasks');
});

// Update Task Status
app.get('/updateStatus', function(req, res){
    res.render('updateStatus.html');
});

app.post('/updateStatusData', function(req, res){
    let updateID = req.body.taskID;
    let updateStatus = req.body.taskStatus;
    
    Task.updateOne({ _id: updateID}, {$set: {taskStatus: updateStatus}}, function (err, doc){
        console.log(doc);
        
    })
    res.redirect('/listTasks');
});

app.get('/listCompletedSorted', function(req, res){
    Task.where({'taskStatus': 'Complete'}).where('name').limit(3).sort({'name':-1}).exec(function(err, doc){
        res.send(doc);
    })
})

app.listen(8080);