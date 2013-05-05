$(document).ready(function() {
  alert("emailwing!");
  $('div.aDh').after('<div style="background-color: whiteSmoke; border: 1px solid #CFCFCF; border-width: 0 1px 1px 1px; margin: 0 -1px; overflow-y: hidden;"><table style="width=100%"><tbody><tr><td><button style="padding: 2px 18px; line-height: 27px; font-size: 11px; font-weight: bold; color: white; background: orange; border: none; background-image: -webkit-linear-gradient(top, #25ce23, #1fb71d); border-radius: 2px; border: 1px solid #1fb71d;">Approve</button></td></tr></tbody></table></div>');
  var body = $('div.LW-avf').text();
  //var to = $('textarea[name=to]').val;
  alert(body);
  //alert(to);

  var db = new Firebase('https://blingmail.firebaseio.com/');
  db.set(body);
});
