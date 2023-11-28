const path = require("path");
const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const fs = require("fs");
const keys =require("lodash");

getHtmlContent = (filePath, replaceData) => {
  const data = fs.readFileSync(filePath);
  let html = data.toString();
  keys(replaceData).forEach((key) => {
    html = html.replace(key, replaceData[key]);
  });
  return html;
};

const emailSend = (body) => {
  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve("./views/"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./views/"),
  };
  let html = "";
  let replaceData = body?.context;
  if (body?.template) {
    const templatesDir = path.resolve(`${__dirname}/../`, "templates");
    const content = `${templatesDir}/${body?.template}.html`;
    html = getHtmlContent(content, replaceData);
  }

  //    const {mailFrom, smtpHost, smtpPassword, smtpPort, smtpUserName} = EnvUtils.getEnvValues();
  const mailOptions = {
    from: process.env.mailFrom,
    html,
    replyTo: process.env.mailFrom,
    subject: body?.subject,
    to: body?.to,
    bcc: body?.to,
    text: "",
  };

  const transportObj = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER_NAME,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(transportObj);

  transporter.use("compile", hbs(handlebarOptions));
  transporter.sendMail(mailOptions, (mailSendErr, info) => {
    console.log("sent mail successfully ", mailSendErr, info);
  });
};

module.exports = { emailSend };
