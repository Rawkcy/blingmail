/**
 * Constants for approval statuses.
 */
var ApprovalStatus = {
  UNSEEN: 0,
  APPROVED: 1,
  DISAPPROVED: 2
};

/**
 * Loads Firebase js library
 */
$.getScript('https://cdn.firebase.com/v0/firebase.js', function() {
    console.log('get script');
});


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
  console.log('startGetApproval');
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

/**
 * Informs that this approver approves an email
 *
 * @param authorEmail
 *      email address of the person who drafted the email
 * @param approverEmail
 *      email address of the person approving the email
 * @param emailId
 *      id of the email being approved
 */
sendApproval = function(authorEmail, approverEmail, emailId, approvalStatus) {
  console.log('sendApproval');
  var rootRef = new Firebase('https://blingmail.firebaseio.com');
  var emailRef = rootRef.child('user').child(wtf(authorEmail)).child(emailId);
  emailRef.child('approver').child(wtf(approverEmail)).update({approved: approvalStatus}, firebaseCallback);
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





/*************************************************
 *      Code for testing
 * ***********************************************/

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
 * Test send approval
 */
testSendApproval = function() {
  var userEmail = "user@gmail.com";
  var emailId = "1234";
  var approverEmail = "2@gmail.com";
  sendApproval(userEmail, approverEmail, emailId, ApprovalStatus.UNSEEN);
}


$('#start-get-approval').on('click', testStartGetApproval);
$('#send-approval').on('click', testSendApproval);


