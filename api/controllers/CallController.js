/**
 * CallController
 *
 * @description :: Server-side logic for managing calls
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
        Call.makeCall('91'+req.query.source, '91'+doctor.phoneNumber,
          function (status, response) {
            if(status != '201') {
              err = { code: 701, error: 'Could not initiate the call.' };
              return res.json(500, err);
            }
            Call.create({
              src: '91'+req.query.source,
              dest: '91'+doctor.phoneNumber,
              requestId: response.request_uuid
            }, function (err, data) {
              res.json({ message: 'Call initiated successfully.' });
            });
        });
      });
  },
  patientCallback: function (req, res) {
    var resp = req.body;
    Call.update({ requestId: resp["RequestUUID"] }, { callId: resp["CallUUID"] }, function (err, data) {
      console.log('Patient - Callback');
    });

    res.set('Content-Type', 'text/xml');
    var data = '<Response><Speak>Please wait while we connect you to the doctor...</Speak>';
    data += '<Dial callerId="+14954954950" callbackUrl="http://avasaram.ml/call/doctorCallback"><Number>'+req.query.number+'</Number></Dial></Response>';
    return res.send(data);
  },
  doctorCallback: function (req, res) {
    var data = req.body;
    if(data["DialAction"] == "hangup") {
      Call.update({ callId: data["CallUUID"] }, { status: "complete", duration: data["DialBLegDuration"] }, function(){
        Call.findOne({ callId: data["CallUUID"] }, function (err, calldata) {
          var docNo = calldata.dest.substr(2);
          var patNo = calldata.src.substr(2);
          Doctor.findOne({ phoneNumber: docNo }, function (err, doc) {
            var docRate = parseInt(doc.rate);
            var cost = docRate * Math.ceil(parseInt(data["DialBLegDuration"]) / 60);
            doc.callPoints = parseInt(doc.callPoints) + cost;
            Doctor.update({ phoneNumber: docNo }, { callPoints: doc.callPoints }, function(){});

            Patient.findOne({ phoneNumber: patNo }, function (err, pat) {
              pat.callPoints = pat.callPoints - cost;
              Patient.update({ phoneNumber: patNo }, { callPoints: pat.callPoints }, function(){});
            })
          });
        });
      });
    } else if(data["DialAction"] == "answer") {
      Call.update({ callId: data["CallUUID"] }, { status: "in-progress" }, function(){});
    }
    return res.send(data);
  }
};

