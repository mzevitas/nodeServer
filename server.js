var express    = require('express');        
var app        = express();                
var bodyParser = require('body-parser');




var mongoose = require('mongoose');
mongoose.connect("mongodb://mzevitas:zbest11@ds031711.mongolab.com:31711/testing");

var Bear     = require("./app/models/bear");
// Get data from POST

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;     



// Router

var router = express.Router();


router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); 
});


// router.get('/', function(req, res) {
//     res.json({ message: 'Whats up Ashbys' });
 
// });

router.route('/bears')


    .post(function(req, res) {
        
        var bear = new Bear();      
        bear.name = req.body.name;  


        bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Bear created!' });
        });
        
    })

    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    });



    router.route('/bears/:bear_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    });


// Add more routes

app.use('/api', router);






//Starting server with this port
app.listen(port);
console.log('Magic happens on port ' + port);


