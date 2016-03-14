/**
 * PatientController
 *
 * @description :: Server-side logic for managing patients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var md5 = require('md5');

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
  }
};
