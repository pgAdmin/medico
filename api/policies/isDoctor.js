// policies/isDoctor.js

module.exports = function isDoctor (req, res, next) {
  var token = req.query.access_token;

  Session
  .findOne({ token: token, type: 'doctor' })
  .exec(function session (err, session) {

    // Unexpected error occurred-- skip to the app's default error (500) handler
    if (err) return next(err);

    // No session exists linking this user to this folder.  Maybe they got removed from it?  Maybe they never had permission in the first place?  Who cares?
    if (!session ) return res.json(403, { code: 403, error: 'User is not logged in as Doctor' });

    // If we made it all the way down here, looks like everything's ok, so we'll let the user through
    Doctor.findOne({ id: session.userId }, function (err, doctor){
      req.query.doctorId = doctor.id;
      next();
    }); 
  });
};
