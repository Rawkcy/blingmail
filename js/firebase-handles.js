/**
 * Constants for approval statuses.
 */
var ApprovalStatus = {
  UNSEEN: 0,
  APPROVED: 1,
  DISAPPROVED: 2,
  EDITS: 3
};

var FIREBASE_ROOT_URL = 'https://blingmail.firebaseio.com';

/**
 * Loads Firebase js library
 */
$.getScript('https://cdn.firebase.com/v0/firebase.js', function() {
    console.log('Got Firebase js script.');
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
  var rootRef = new Firebase(FIREBASE_ROOT_URL);
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
  var rootRef = new Firebase(FIREBASE_ROOT_URL);
  var emailRef = rootRef.child('user').child(wtf(authorEmail)).child(emailId);
  emailRef.child('approver').child(wtf(approverEmail)).update({approved: approvalStatus}, firebaseCallback);
};

firebaseCallback = function(error) {
    if (error) {
      console.log('Cannot save data ' + error); 
    } else {
      console.log('Data saved successfully');
    }
};

/**
 * Turn dots to comma
 */
wtf = function(string) {
  return String(string).replace(/\./g, ',');
};

/**
 * Checks if a firebase node exists.
 */
nodeExists = function(pathFromRoot) {
  var path = FIREBASE_ROOT_URL + pathFromRoot;
  console.log('nodeExists: ' + pathFromRoot);
  try {
    var emailRef = new Firebase(path);
    var exist;
    emailRef.on('value', function(snapshot) {
      if(snapshot.val() === null) {
        alert('This email id does not exist.');
        exist = false;
      } else {
        exist = true;
      }
    });
    return exist;
  } catch (err) {
    return false;
  }
};

readData = function(pathFromRoot) {
  var path = FIREBASE_ROOT_URL + pathFromRoot;
  console.log('reading data from ' + path);
  try {
    var data = null;
    var ref = new Firebase(path);
    ref.on('value', function(snapshot) {
      if(snapshot.val() === null) {
        console.log('Could not read data. Might not exist.');
      } else {
        console.log('Could read data.');
        data = snapshot.val();
      }
    });
    return data;
  } catch (err) {
    return null;
  }
};

watchNode = function(pathFromRoot, callback) {
  console.log('watchNode ' + pathFromRoot);
  var path = FIREBASE_ROOT_URL + pathFromRoot;
  console.log('reading data from ' + path);
  try {
    var ref = new Firebase(path);
    ref.on('value', function(snapshot) {
      if(snapshot.val() === null) {
        console.log('watch null node');
      } else {
        console.log('watching node change');
        callback(snapshot.val());
      }
    });
  } catch (err) {}
}

//getApprovers = function(pathFromRoot) {
//  var path = FIREBASE_ROOT_URL + pathFromRoot;
//  console.log('reading approvers from ' + path);
//  try {
//    var ref = new Firebase(path);
//    ref.on('value', function(snapshot) {
//      if(snapshot.val() === null) {
//        alert('Could not read data. Might not exist.');
//        return null;
//      } else {
//        alert('Could read data.');
//        return snapshot.val();
//      }
//    });
//  } catch (err) {
//    return null;
//  }
//  for (var key in validation_messages) {
//   var obj = validation_messages[key];
//   for (var prop in obj) {
//      alert(prop + " = " + obj[prop]);
//   }
//}
//};





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


