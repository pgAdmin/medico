/**
 * PatientController
 *
 * @description :: Server-side logic for managing patients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var md5 = require('md5');
var Mailgun = require('mailgun').Mailgun;
var mg = new Mailgun('key-463dfec4468b2c83b539f0ba8c9bfc4a');

var _editParams = function(requestParams) {
  var params = { };
  if(requestParams.name) { params.name = requestParams.name; }
  if(requestParams.phoneNumber) { params.phoneNumber = requestParams.phoneNumber; }
  if(requestParams.password) { params.password = md5(requestParams.password); }
  if(requestParams.gender) { params.gender = requestParams.gender; }
  return params;
};

module.exports = {

  login: function (req, res) {
  	params = req.body || {};

    // Find a patient with the following email and password
    Patient.findOne({
      email: params.email,
      password: md5(params.password)
    }).exec(function (err, data) {

      // Return error if no record found.
      if (err) { return res.json(err); }

      if (data) {
        var token = md5(params.email+(new Date()).toJSON());

        // If record is found, create a session token
        Session.create({
          token: token,
          userId: data.id,
          type: 'patient'
        }).exec(function (err, data) {});
        data.token = token
        return res.json(data);
      }
      else {
        err = { code: 601, error: 'No user found.' };
        return res.json(500, err);
      }
    });
  },
  register: function (req, res) {
  	params = req.body || {};
    Patient.create({
      name: params.name,
      email: params.email,
      phoneNumber: params.phoneNumber,
      gender: params.gender,
      password: md5(params.password)
    }).exec(function (err, data){
      if (err) { return res.json(500, err); }
      return res.json(data);
    });
  },
  edit: function (req, res) {
    params = req.body || {};

    Patient.update({ id: req.query.patientId }, _editParams(params))
    .exec(function (err, data){
      if (err) { return res.json(500, err); }
      return res.json(data[0]);
    })
  },
  forgot: function (req, res) {
    params = req.body || {};
    var password = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6);
    Patient.findOne({
      email: params.email
    }).exec(function (err, data){
      if (err) { return res.json(err); }
      if (data) {
        Patient.update({ id: data.id }, { password: md5(password) }).exec(function(){});
        mg.sendRaw('no-reply@avasaram.ml', data.email,
          'From: no-reply@avasaram.ml' +
          '\nContent-Type: text/html; charset=utf-8' +
          '\nSubject: Avasaram - Your password has been reset' +
          '\n\nHi, '+data.name +
          '<br><br>Your password has been reset successfully.' +
          '<br><br>Your new password is: ' + password +
          '<br><br>Thank you!.', function(err) {
            if(err) { return res.json(500, err); }
            return res.json({ code: 200, message: 'your password has been reset.' });
          });
      }
      else {
        err = { code: 601, error: 'No user found.' };
        return res.json(500, err);
      }
    });
  }
};
