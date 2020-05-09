var nodemailer = require('nodemailer');

module.exports = {
  sendMail: function(user, target, subject, template, cb) {

    var smtpTransport = nodemailer.createTransport({
      service: "Yandex",
      auth: {
        user: user.login, // to be replaced by actual username and password
        pass: user.password
      }
    });

    mailOptions = {
      from: user.login,
      to: target,
      subject: subject,
      html: template
    }
    console.log("sending mail from: "+user.login+" To: "+target);

    smtpTransport.sendMail(mailOptions, function(error, response) {
      if (error) {
        cb({mailOptions: mailOptions, error: error});
      } else {
        cb({mailOptions: mailOptions, response: response});
      }
    });
  }
}
