import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Project Manager",
      link: "https://repurfy.com/",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "mail.projectmanagement.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error(
      "Email service failed silently. Make sure that you have provided your MAILTRAP credentials in the .env file",
    );
    console.error("Error:", error);
  }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,

      intro: "Welcome to our App! We're excited to have you on board.",

      action: {
        instructions: "To verify your email, please click on the button below:",

        button: {
          color: "#1AA5AF",
          text: "Verify Email",
          link: verificationUrl,
        },
      },

      outro: "If you did not create an account, no further action is required.",
    },
  };
};

const forgotPasswordMailgenContent = (username, resetUrl) => {
  return {
    body: {
      name: username,

      intro: "We received a request to reset your password for your account.",

      action: {
        instructions: "To reset your password, please click the button below:",

        button: {
          color: "#DC4D2F",
          text: "Reset Password",
          link: resetUrl,
        },
      },

      outro:
        "If you did not request a password reset, please ignore this email. This link may expire after some time for security reasons.",
    },
  };
};

export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
};
