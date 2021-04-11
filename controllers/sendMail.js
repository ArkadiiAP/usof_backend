const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "usoftest@gmail.com",
        pass: process.env.EMAIL_PASSWORD
    }
})
const mailer = mailOptions => {
    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            return console.log(err)
        }else {
            console.log("Send mail: ", info)
        }
    })
}

module.exports = mailer
