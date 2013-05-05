/**
 * Test start get approval
 */
testStartGetApproval = function() {
  console.log('hug');
  var userEmail = "user@gmail.com";
  var emailId = "1234";
  var toEmail = "to@gmail.com";
  var subject = "subject";
  var body = "body";
  var approvers = ["1@gmail.com", "2@gmail.com", "3@gmail.com"];
  startGetApproval(userEmail, emailId, toEmail, subject, body, approvers);
};

/**
 * Creates a new entry in firebase for email that needs to be approved.
 *
 * @param userEmail
 * @param emailId
 *      ID of the draft email
 * @param toEmail
 * @param subject
 * @param body
 * @param approvers
 *      List of approvers' email.
 */
startGetApproval = function(userEmail, emailId, toEmail, subject, body, approvers) {
  var rootRef = new Firebase('https://blingmail.firebaseio.com');
  var emailRef = rootRef.child('user').child(wtf(userEmail)).child(emailId);

  // Save all data other than list of approvers. Approvers are special because firebase is weird.
  emailRef.set({to: toEmail, subject: subject, body: body}, firebaseCallback);

  // Save approvers list with the boolean "approved"=false in firebase.
  var approverList = {};
  var i;
  for (i = 0; i < approvers.length; ++i) {
    emailRef.child('approver').child(wtf(approvers[i])).set({approved: false}, firebaseCallback);
  }
};

firebaseCallback = function(error) {
    if (error) {
      console.log('Cannot save data ' + error); 
    } else {
      console.log('data saved successfully');
    }
};

/**
 * Turn dots to comma
 */
wtf = function(string) {
  return string.replace(/\./g, ',');
}

$('#start-get-approval').on('click', testStartGetApproval);

/**
 * Loads Firebase js library
 */
$.getScript('https://cdn.firebase.com/v0/firebase.js', function() {
    console.log('get script');
    });
