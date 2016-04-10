/**
 * TransactionController
 *
 * @description :: Server-side logic for managing transactions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var stripe = require("stripe")("sk_test_XkCEE9YuuqCOlEUVAOkMuCm3");

module.exports = {

  loadCash: function (req, res) {
    amount = req.body.amount*100;
    source = req.body.card;

    stripe.charges.create({
      amount: amount,
      currency: "usd",
      source: source,
      description: "Charge for Avasaram.ml"
    }, function(err, charge) {
      if (charge) {
        Patient.findOne({ id: req.query.patientId },
          function (err, patient) {
            if (patient && charge.status == 'succeeded') {
              patient.callPoints += charge.amount/100;
              Patient.update({ id: req.query.patientId }, { callPoints: patient.callPoints }, function (err, resp){
                return res.json({ status: 200, message: 'Call points added successfully.', callPoints: resp.callPoints });
              })
            } else {
              return res.json(500, { status: 801, message: 'Sorry, the payment was not successful.' });
            }
        })
      } else {
        return res.json(500, { status: 801, message: 'Sorry, the payment was not successful.' });
      }
    });
  }
};
