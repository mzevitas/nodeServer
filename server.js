// to run server type nodemon server.js


var express    = require('express');        
var app        = express();                
var bodyParser = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
	// mongoose.connect("mongodb://mzevitas:zbest11@ds031711.mongolab.com:31711/testing");


var jwt    = require('jsonwebtoken'); 
var config = require('./config'); 
var User   = require('./app/models/user'); 
var Bear     = require("./app/models/bear");



// getting the data from the POST


var port = process.env.PORT || 8080;    

mongoose.connect(config.database); 
app.set('superSecret', config.secret); 


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));




//  Router For API

var router = express.Router();


router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); 
});




app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});



app.listen(port);
console.log('Magic happens at http://localhost:' + port);



app.get('/setup', function(req, res) {

  var mike = new User({ 
    name: 'Mike Zevitas', 
    password: 'password',
    admin: true 
  });
  

  // save the sample user
  mike.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});




//API ROUTES
var apiRoutes = express.Router(); 

apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});  


apiRoutes.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   

    }

  });
}); 

//"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NTg4MmJhZjBlYTg2NjNkNGEwMDAwMDEiLCJuYW1lIjoiTWlrZSBaZXZpdGFzIiwicGFzc3dvcmQiOiJwYXNzd29yZCIsImFkbWluIjp0cnVlLCJfX3YiOjB9.SJgeXgLBXRjZLVWcdPN4IRgNW_OqY3DxZRbBc8bfEUM"

// apiRoutes.use(function(req, res, next) {

//   var token = req.body.token || req.query.token || req.headers['x-access-token'];

//   // decode token
//   if (token) {

//     jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
//       if (err) {
//         return res.json({ success: false, message: 'Failed to authenticate token.' });    
//       } else {
//         req.decoded = decoded;    
//         next();
//       }
//     });

//   } else {

   
//     return res.status(403).send({ 
//         success: false, 
//         message: 'No token provided.' 
//     });
    
//   }
// });






app.use('/api', apiRoutes);



// router.get('/', function(req, res) {
//     res.json({ message: 'Whats up Ashbys' });
 
// });








router.route('/bears')


    .post(function(req, res) {
        
        var bear = new Bear();      
        bear.name = req.body.name;  // give the api requirements to post


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

//single id

    router.route('/bears/:bear_id')

    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    })
    .put(function(req, res) {

        // use our bear model to find the bear we want
        Bear.findById(req.params.bear_id, function(err, bear) {

            if (err)
                res.send(err);

            bear.name = req.body.name;  // update the bears info

            // save the bear
            bear.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Bear updated!' });
            });

        });
    })
    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


// Add more routes

app.use('/api', router);








//Starting server with this port
// app.listen(port);
// console.log('Magic happens on port ' + port);


