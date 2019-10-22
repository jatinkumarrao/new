const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
var bcrypt = require('bcryptjs');
const User = mongoose.model('User');

var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
module.exports.register = (req, res, next) => {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}

module.exports.authenticate = (req, res, next) => {
   passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json('success');
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.reset =(req,res, next) =>{
  console.log(req.body)
    async.waterfall([
    function(done) {
      User.findOne({ email: req.body.email }, function(err, user) {
       
       console.log(user) 
       if (!user) {
        //  req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.saltSecret = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
           // req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'tt626287@gmail.com',
          pass: 'Dashboard@123'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'tt626287@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
       // req.flash('success', 'Success! Your password has been changed.');
       console.log('done')
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/campgrounds');
  });
    
}

module.exports.password =(req,res, next) =>{
     async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(app, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          return res.status(404).json({ status: false, message: 'User record not found'});
        }
      console.log(user.email);
      var password = user.password;
        console.log(user.password);
       console.log(user.saltSecret);
 module.exports.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
    console.log(password)
};

       app =user.saltSecret;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, app, user);
        });
      });
    },
    function(app, user, done) {
       var email=req.body.email;
    //   console.log(email)
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'tt626287@gmail.com',
          pass: 'Dashboard@123'
        }
      });
      var mailOptions = {
        to: req.body.email,
        from: 'tt626287@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://localhost:4200' + '/reset/' + app + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        res.status(200).send(['Please check your email ']);
       done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.json('error');
  });
 
}

module.exports.userProfile = (req, res, next) =>{
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['fullName','email']) });
        }
    );
}