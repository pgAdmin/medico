/**
 * CallController
 *
 * @description :: Server-side logic for managing doctors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

  initiate: function (req, res) {
    Doctor.findOne({ id: req.query.id },
      function (err, doctor) {
        if(!doctor) {
          err = { code: 601, error: 'No user found.' };
          return res.json(500, err);
        }
        Call.makeCall(req.query.source, doctor.phoneNumber,
          function (status, response) {
            if(status != '201') {
              err = { code: 701, error: 'Could not initiate the call.' };
              return res.json(500, err);
            }
            Call.create({
              src: req.query.source,
              dest: doctor.phoneNumber,
              requestId: response.request_uuid
            }, function (err, data) {
              res.json({ message: 'Call initiated successfully.' });
            });
        });
      });
  },
  patientCallback: function (req, res) {
    res.set('Content-Type', 'text/xml');
    var data = '<Response><Speak>Please wait while we connect you to the doctor...</Speak>';
    data += '<Dial callerId="+14954954950" callbackUrl="http://greenpanda.xyz/call/doctorCallback"><Number>'+req.query.number+'</Number></Dial></Response>';
    return res.send(data);
  },
  doctorCallback: function (req, res) {
    var data = req.body;
    return res.send(null);
  },
  tester: function (req, res) {
    // Call.makeCall(919840309508, 919741811304);
  }
};

