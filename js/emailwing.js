$(document).ready(function() {
  $('div.aDh').after('<div style="background-color: whiteSmoke; border: 1px solid #CFCFCF; border-width: 0 1px 1px 1px; margin: 0 -1px; overflow-y: hidden;"><table><tbody><tr><td><button id="approve">Get Approved</button></td><td><input id="approval-emails" placeholder="Enter emails"></td></tr></tbody></table></div>');
  $('button#approve').click(function() {
    var body = $('div.LW-avf').text();
    var to = $('div.vT').text();
    var id = window.location.href.split('?compose=')[1];
    alert('body: ' + body);
    alert('to: ' + to);
    alert('id: ' + id);

    var db = new Firebase('https://blingmail.firebaseio.com/');
    db.set(body);
  });
});
