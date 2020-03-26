module.exports = {
  generateRandomString: function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  },

  generateNewQueueID: function () {
    var ran = 0;

    while(ran > 999999 || ran < 100000 ) {
      ran = Math.floor(Math.random() * 1000000);
    }
    return ran;
  }
}