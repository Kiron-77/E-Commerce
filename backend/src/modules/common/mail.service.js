require('dotenv').config
const nodemailer = require('nodemailer')
class EmailService{
    transporter;
    constructor(){
        this.transporter = nodemailer.createTransport({
            host:process.env.SMTP_HOST,
            port:process.env.SMTP_PORT,
            auth:{
                user:process.env.SMTP_USR_NAME,
                pass:process.env.SMTP_PWD
            }
        })
        this.sendEmail = async(to,subject,message)=>{
            try{  
                 await this.transporter.sendMail({
                to:to,
                from:process.env.FROM_ADDRESS,
                subject:subject,
                html:message,
                
            })
         }catch(exception){
            console.log("SendEmail:",exception)
            throw exception
         }
         
            }
        }
    }
   
module.exports = EmailService;

