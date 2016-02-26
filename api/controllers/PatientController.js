/**
 * PatientController
 *
 * @description :: Server-side logic for managing patients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var md5 = require('md5');

module.exports = {

  login: function (req, res) {
  	params = req.body || {};
    Patient.findOne({
      email: params.email,
      password: md5(params.password)
    }).exec(function (err, data) {
      if (err) { return res.json(err); }
      if (data) { 
        var token = md5(params.email+(new Date()).toJSON());
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
    return res.json({ mocked: true });
  },
  populate: function (req, res) {
    var factor = Math.ceil(Math.random()*1000);
    Patient.create({
      name: 'Patient '+factor,
      email: 'test'+factor+'@gmail.com',
      phoneNumber: '9840309'+factor,
      gender: 'M',
      password: md5('something')
    }).exec(function (err, data){
      if (err) { return res.json(err); }
      return res.json(data);
    });
  }
};

