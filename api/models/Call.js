/**
 * Call.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

// var plivo = require('plivo');
var util = require("util");
var Client = require('telapi').client;
 
module.exports = {

  attributes: {
    src: {
      type: 'string',
      required: true
    },
    dest: {
      type: 'string',
      required: true
    },
    duration: {
      type: 'integer',
      defaultsTo: 0
    },
    requestId: {
      type: 'string'
    },
    callId: {
      type: 'string'
    },
    status: {
      type: 'string'
    }
  },
  makeCall: function (patient, doctor, callback) {
    // var p = plivo.RestAPI({
    //   authId: 'MAMJG1NTE0MZLLYJC3MT',
    //   authToken: 'YWViMDYwMGVmYjJhMjY3NjcyMzRjNzRmMzE2ZjI3'
    // });
    var client = new Client(
      'ACa44f15271d5641f1805b593c32cfd5d9', 
      '99a44d72da3c42b884486a3c981d3da6'
    );

    // var params = {
    //   'to': patient, // The phone numer to which the all has to be placed separated by "<" delimiter
    //   'from' : '+14954954950', // The phone number to be used as the caller id
    //   'answer_url' : 'http://avasaram.ml/call/patientCallback?number='+doctor, // The URL invoked by Plivo when the outbound call is answered
    //   'answer_method' : "POST", // The method used to call the answer_url
    // };

    // p.make_call(params, callback);
    client.create(
      ['calls'],
      {
        To : patient, // The phone numer to which the all has to be placed separated by "<" delimiter
        From : '+14954954950', // The phone number to be used as the caller id
        Url : 'http://avasaram.ml/call/patientCallback?number='+doctor // The URL invoked by Plivo when the outbound call is answered
      }
    );
    return callback('201', 'success');    
  }
};

