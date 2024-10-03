const nodemailer = require("nodemailer");

exports.handler = async function (event, context) {
  // Obtenemos el email desde el cuerpo de la solicitud
  const { email } = JSON.parse(event.body);

  // Validación simple del email
  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ status: "error", message: "Email es requerido." }),
    };
  }

  // Configurar el transporte SMTP para Gmail (puedes cambiarlo a cualquier otro proveedor SMTP)
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "circulauy@gmail.com", // Reemplaza con tu correo
      pass: "Circula.uy2021", // Reemplaza con tu contraseña o con la App Password de Gmail si usas autenticación de 2 pasos
    },
  });

  // Definir el contenido del correo electrónico
  let mailOptions = {
    from: "circulauy@gmail.com", // Remitente (mismo que `user` en `auth`)
    to: "circulauy@gmail.com", // Destinatario (el correo al que quieres enviar)
    subject: "Nueva suscripción al newsletter",
    text: `El siguiente correo electrónico se ha suscrito al newsletter: ${email}`,
  };

  try {
    // Enviar el correo con nodemailer
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ status: "success", message: "Correo enviado exitosamente." }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: "error", message: `Error al enviar el correo: ${error.message}` }),
    };
  }
};
