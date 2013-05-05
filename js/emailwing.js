generateMailToLinkForApproval = function(to, from, sub, bod, approvers, approvalLink) {
  var header = "mailto:" + approvers;
  var subject = "subject=" + from + " would like you to approve an email: " + '"' + sub + '"';
  var separator = "\n\n============================================================\n\n";
  var body = "body=" + "Hi there!\n\n" + from + " would like you to approve the following email to be sent to " + to + "." + separator + bod + separator + "To approve this email to be sent, please click here: " + approvalLink + "\n" + "If you would like to suggest a revision, just make the changes inline in a reply!\n\nThanks!,\nEmailWing Team";
  return encodeURI(header + "?" + subject + "&" + body);
};

generateFinalMailToLink = function(to, sub, bod) {
  var header = "mailto:" + to;
  var subject = "subject=" + sub;
  var body = "body=" bod;
  return encodeURI(header + "?" + subject + "&" + body);
};

insertDiffReplies = function(appendAfter, orig, rev) {
  console.log('diffreplies function');
  var original = difflib.stringAsLines(orig);
  var revision = difflib.stringAsLines(rev);

  // create a SequenceMatcher instance that diffs the two sets of lines
  var sm = new difflib.SequenceMatcher(original, revision);

  // get the opcodes from the SequenceMatcher instance
  // opcodes is a list of 3-tuples describing what changes should be made to the original text
  // in order to yield the new text
  var opcodes = sm.get_opcodes();

  console.log(JSON.stringify(opcodes));

  $('div.'+appendAfter).after('<div class="diffoutput"></div>');
  var diffoutputdiv = $('div.diffoutput');

  // remove any children the output div has already
  while (diffoutputdiv.firstChild) diffoutputdiv.removeChild(diffoutputdiv.firstChild);

  // check the context size of the diff
  var contextSize = $("contextSize").value;
  contextSize = contextSize ? contextSize : null;

  // build the diff view and add it to the current DOM
  diffoutputdiv.after(diffview.buildView({
      baseTextLines: original,
      newTextLines: revision,
      opcodes: opcodes,
      // set the display titles for each resource
      baseTextName: "Original",
      newTextName: "Revision",
      contextSize: contextSize,
      viewType: 1
  }));

  console.log('end of diffreplies');
};

$(document).ready(function() {
  insertDiffReplies('ma', "Hello\nWorld","Hella\n\nHawaii");
  // activate js code on "COMPOSE"
  $('div.T-I.J-J5-Ji.T-I-KE.L3').click(function() {
    $('div.aDh').after('<div style="background-color: whiteSmoke; border: 1px solid #CFCFCF; border-width: 0 1px 1px 1px; margin: 0 -1px; overflow-y: hidden;"><table id="approval-fields"><tbody><tr><td><input placeholder="Enter emails" id="approval-emails"></td><td><button id="approve">Get Approved</button></td></tr></tbody></table></div>');
    $('button#approve').click(function() {
      var body = $('div.LW-avf').text();
      var to = $('div.vT').text().match(/\(([^)]+)\)/)[1]; // get between ()
      var from = $('div.J-J5-Ji.J-JN-M-I-Jm').find('span').text().match(/\<([^)]+)\>/)[1]; // get between <>
      var subject = 'This is the subject';
      var approver = $('input#approval-emails').val().split(',');
      var id = window.location.href.split('?compose=')[1];
      var link = 'http://emailwing.herokuapp.com/' + from + '/' + id + '/' + approver;

      startGetApproval(from, id, to, subject, body, approver);
      window.location.href = generateMailToLinkForApproval(to, from, subject, body, to, link);
    });
  });
});

$(window).on('hashchange', function() {
  tryToHijackSidebar();
});

/**
 * Hijacks the right sidebar where the ads usually are
 */
tryToHijackSidebar = function() {
  var url = window.location.href;
  var emailId = url.substring(url.lastIndexOf('/') + 1);
  console.log('emailid=' + emailId);
  // Check if email id is in the database
  var userEmail = $('div.iw span.gD').attr('email');
  console.log('useremail=' + userEmail);
  if (nodeExists('/user/' + userEmail + '/' + emailId)) {
    console.log('this email thread is in firebase');
    // HIJACK!! MUHAHAHAHA
    // TODO hijack...
  } else {
    console.log('this email thread does not exist in firebase');
  }
  // TODO: take this out when we're done debugging.
  $('div.nH.adC').after('<div id="right-sidebar">LOL\nlol\nlolol</div>');
}
