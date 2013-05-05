function generateMailToLink(to, from, sub, bod, approvers, approvalLink) {
  var header = "mailto:" + approvers;
  var subject = "subject=" + from + " would like you to approve an email: " + '"' + sub + '"';
  var separator = "\n\n============================================================\n\n";
  var body = "body=" + "Hi there!\n\n" + from + " would like you to approve the following email to be sent to " + to + "." + separator + bod + separator + "To approve this email to be sent, please click here: " + approvalLink + "\n" + "If you would like to suggest a revision, just make the changes inline in a reply!\n\nThanks!,\nEmailWing Team";
  return encodeURI(header + "?" + subject + "&" + body);
}

$(document).ready(function() {
  // activate js code on "COMPOSE"
  $('div.T-I.J-J5-Ji.T-I-KE.L3').click(function() {
    $('div.aDh').after('<div style="background-color: whiteSmoke; border: 1px solid #CFCFCF; border-width: 0 1px 1px 1px; margin: 0 -1px; overflow-y: hidden;"><table id="approval-fields"><tbody><tr><td><input placeholder="Enter emails" id="approval-emails"></td><td><button id="approve">Get Approved</button></td></tr></tbody></table></div>');
    $('button#approve').click(function() {
      var body = $('div.LW-avf').text();
      var to = $('div.vT').text();
      var from = $('div.J-J5-Ji.J-JN-M-I-Jm').find('span').text();
      var subject = 'This is the subject';
      var approver = $('input#approval-emails').val().split(',');
      var id = window.location.href.split('?compose=')[1];

      startGetApproval(from, id, to, subject, body, approver);
      //window.open(generateMailToLink(to, 'roxane.guo@gmail.com', 'Please approve', body, to, 'www.google.com'));
      window.location.href = generateMailToLink(to, 'roxane.guo@gmail.com', 'Please approve', body, to, 'www.google.com');
    });
  });

  // Draw over the right sidebar
  $('div.nH.adC').livequery(
    function() {
      // When the element comes.
      alert("HUEHUEHUE");
    });
});

$(document).on('click', function() {
  // Check if we opened an email thread that we care.
  var url = window.location.href;
  var potentialEmailId = url.substring(url.lastIndexOf('/'));
  console.log('emailid=' + potentialEmailId);
  //alert('emailId=' + potentialEmailId);
})




