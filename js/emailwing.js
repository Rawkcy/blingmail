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
  var body = "body=" + bod;
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

  return opcodes;
};

testFn = function() {
  //alert(generateFinalMailToLink("roxane.guo@gmail.com", "Thanks for all the
  insertDiffReplies('ma', "This is a test","This is an amazing test");
};


$(document).ready(function() {
  // activate js code on "COMPOSE"
  $('div.T-I.J-J5-Ji.T-I-KE.L3').click(function() {
    $('div.aDh').after('<div style="background-color: whiteSmoke; border: 1px solid #CFCFCF; border-width: 0 1px 1px 1px; margin: 0 -1px; overflow-y: hidden;"><table id="approval-fields"><tbody><tr><td><input placeholder="Enter emails" id="approval-emails"></td><td><button id="approve">Get Approved</button></td></tr></tbody></table></div>');
    $('button#approve').click(function() {
      var to = $('div.vT').text().match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
      var from = $('div.J-J5-Ji.J-JN-M-I-Jm').find('span').text().match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
      var subject = $('input[name="subjectbox"]').val();
      var body = $('div.LW-avf').html();
      body = body.replace(/<br>/g, "\n");
      body = body.replace(/<\/div>/g, "\n");
      body = body.replace(/<div[^>]*>/g, "");
      var approver = $('input#approval-emails').val().split(',');
      var id = window.location.href.split('?compose=')[1];
      var link = 'http://emailwing.herokuapp.com/' + from + '/' + id + '/' + approver;

      startGetApproval(from, id, to, subject, body, approver);
      window.open(generateMailToLinkForApproval(to, from, subject, body, to, link));
    });
  });

  $('div.approver').live('click', function() {
    //alert(generateFinalMailToLink("roxane.guo@gmail.com", "Thanks for all the fish", "Dear Roxanne,\nHere is the final mailto link\nSincerely,\nJon"));
    var userEmail = $('div.iw span.gD').attr('email');
    var id = window.location.href.split('?compose=')[1];
    alert('approver got clicked!');
    var reply = $('div.gmail_quote').text().split('==========================================')[1];
    alert(reply);
    var original_text = readData('/user/' + wtf(userEmail) + '/' +  id + '/body');
    alert(original_text);
    insertDiffReplies('ma', original_text, reply);
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
  // TODO: hardcode stuff here if necessary
  // Check if email id is in the database
  var emailId = url.substring(url.lastIndexOf('/') + 1);
  //emailId = 1234;
  var userEmail = $('div.iw span.gD').attr('email');
  //userEmail = 'user@gmail.com';
  userEmail = wtf(userEmail);
  console.log('useremail=' + userEmail);
  if (nodeExists('/user/' + userEmail + '/' + emailId)) {
    console.log('this email thread is in firebase');
    // HIJACK!! MUHAHAHAHA
    // Create approval pane.
    var pane = approvalPane();
    var approverPath = '/user/' + userEmail + '/' + emailId + '/approver';
    var approvers = readData(approverPath);
    console.log(JSON.stringify(approvers));
    if (approvers != null) {
      for (var key in approvers) {
        if (approvers.hasOwnProperty(key)) {
          var approver = approvers[key];
          pane.addApprover(approver.name, key, approver.approved)
        }
      }
    } else {
      console.log('null approvers');
    }
    $('div.nH.adC').after(pane.getHtml());
    testFn();

    // Subscribe to approval status
    if (approvers != null) {
      for (var key in approvers) {
        if (approvers.hasOwnProperty(key)) {
          var approver = approvers[key];
          watchNode(approverPath + '/' + key, approvalChangeCallback);
        }
      }
    } else {
      console.log('null approvers');
    }
  } else {
    console.log('this email thread does not exist in firebase');
  }
}

/**
 * Callback for real-time approval status update.
 */
approvalChangeCallback = function(value) {
  console.log('changed: ' + JSON.stringify(value));
}

/**
 * Helper for generated the approval pane.
 */
approvalPane = function() {
  var pane = {
    /** The html element of the approval pane */
    html: ['<div id="right-sidebar"><section><h1>Approvers</h1>'],
    /** Adds an approver to the pane */
    addApprover: function(name, email, approvalStatus) {
      var domClass = 'approver';
      if (approvalStatus == ApprovalStatus.APPROVED) {
        domClass = domClass + ' approved';
      } else if (approvalStatus == ApprovalStatus.EDITS) {
        domClass = domClass + ' edited';
      }

      this.html.push('<div class="' + domClass + '">');
      // Hardcode each person.
      if (name == 'Tim Cheng') {
        this.html.push('<img src="https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash3/c181.36.534.534/s160x160/530665_10151029834141116_2018307025_n.jpg" alt="" />'); 
      } else if (name == 'Jonathan Ng') {
        this.html.push('<img src="https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn1/c49.49.619.619/s160x160/164910_10151451395577017_1574110779_n.jpg" alt="" />');
      } else {
        this.html.push('<img src="https://secure.gravatar.com/avatar/f461b6d61f8692ca12a1a545a493d5f2?s=400&d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" alt="" />');
      }
      this.html.push('<h2>' + name + '</h2>');

      if (approvalStatus == ApprovalStatus.APPROVED) {
        this.html.push('<h1 class="check">&#10003;</h1>');
        this.html.push('<h3>Approved</h3>');
      } else if (approvalStatus == ApprovalStatus.EDITS) {
        this.html.push('<h1 class="check">&#10003;</h1>');
        this.html.push('<h3>Submitted edits</h3>');
      } else {
        this.html.push('<h3>Pending</h3>');
      }

      this.html.push('</div>');
    },
    getHtml: function() {
      return this.html.join("") + '<button id="send-approved">Send Approved</button></section></div>';
    }
  }
  return pane;
};
