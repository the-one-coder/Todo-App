var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var urlencodedParser = bodyParser.urlencoded({extended: false});

// commenting data because now connecting with database
// var data = [{item:'Do shower'}, {item:'Homework'}, {item:'Walk the dog'}];

// connect to database
mongoose.connect('mongodb+srv://admin:todopass@cluster0.oxecz9w.mongodb.net/?retryWrites=true&w=majority');

// create a schema
var todoSchema = new mongoose.Schema({item: String});

// create model 
var Todo = mongoose.model('Todo', todoSchema);

// add data to collection
// var objectOne = Todo({item: 'Buy Flowers'}).save(function(err){
//     if(err) throw(err);
//     else{
//         console.log('Item saved');
//     }
// });


module.exports = function(app){
    
    // data
    // working without sending this to as the 2nd argument in render
    // data = [{item:'Do shower'}, {item:'Homework'}, {item:'Walk the dog'}]


    // get
    app.get('/todo', function(req, res){

        // // before database
        // res.render('todo', {todos: data});

        // With Database, callback fn takes error and retreived data as argument
        Todo.find({}, function(err, data){
            if(err) throw err;
            else{
                res.render('todo', {todos: data});
            }
        });
    });

    // post
    app.post('/todo', urlencodedParser, function(req, res){

        // // Without database
        // data.push(req.body);
        // res.json({todos: data});

        // With Database
        var newTask = req.body;
        Todo(newTask).save(function(err, data){
            if(err) throw err;
            else{
                res.json({todos: data});
            }
        })

    });

    // delete
    app.delete('/todo/:item', function(req, res){

        // // Wihtout Database
        // data = data.filter(function(todo){
        //     return (todo.item.replace(/ /g, "-") !== req.params.item);
        // });

        // console.log(data);
        // res.json({todos: data});

        
        // With Database
        var toDelete = req.params.item.replace(/\-/g, ' ');
        Todo.find({item: toDelete}).deleteOne(function(err, data){
            if(err) throw err;
            res.json({todos: data});
        }).clone();
    });
}