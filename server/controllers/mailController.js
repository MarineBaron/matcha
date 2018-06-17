nodeMailer = require('nodemailer')

const transporter = nodeMailer.createTransport({
    host: process.env.MAIL_SMTP,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_ADMIN_USER,
        pass: process.env.MAIL_ADMIN_PASS
    }
})

module.exports = {
  send: function(to, obj) {
    const mailOptions = {
      from: process.env.MAIL_ADMIN_USER, // sender address
      to: to === 'admin' ? process.env.MAIL_ADMIN_USER : process.env.MAIL_USER_USER, // list of receivers
      subject: obj.subject, // Subject line
      text: obj.text, // plain text body
      html: obj.html// html body
    }
    console.log(mailOptions)

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response)
    })
  },
}