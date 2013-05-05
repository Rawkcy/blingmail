$(document).ready(function() {
  // activate js code on "COMPOSE"
  $('div.T-I.J-J5-Ji.T-I-KE.L3').click(function() {
    //alert("emailwing activate!");
    $('div.aDh').after('<div style="background-color: whiteSmoke; border: 1px solid #CFCFCF; border-width: 0 1px 1px 1px; margin: 0 -1px; overflow-y: hidden;"><table id="approval-fields"><tbody><tr><td><button id="approve">Get Approved</button></td><td><input placeholder="Enter emails" id="approval-emails"></td></tr></tbody></table></div>');
    $('button#approve').click(function() {
      var body = $('div.LW-avf').text();
      var to = $('div.vT').text();
      var id = window.location.href.split('?compose=')[1];
      alert('body: ' + body);
      alert('to: ' + to);
      alert('id: ' + id);

      var db = new Firebase('https://test-test-test.firebaseio.com/');
      db.set(body);
    });
  });
});

function generateMailToLink(to, from, sub, bod, approvers, approvalLink) {
  var header = "mailto:" + approvers;
  var subject = "subject=" + from + " would like you to approve an email: " + '"' + sub + '"';
  var separator = "\n\n============================================================\n\n";
  var body = "body=" + "Hi there!\n\n" + from + " would like you to approve the following email to be sent to " + to + "." + separator + bod + separator + "To approve this email to be sent, please click here: " + approvalLink + "\n" + "If you would like to suggest a revision, just make the changes inline in a reply!\n\nThanks!,\nEmailWing Team";
  return encodeURI(header + "?" + subject + "&amp;" + body);
}
