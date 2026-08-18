const nodemailer = require("nodemailer");

exports.handler = async function (event, context) {
  // Obtenemos el email y honeypot desde el cuerpo de la solicitud
  const { email, honeypot } = JSON.parse(event.body);

  // --- FIX SEGURIDAD: HONEYPOT ANTI-BOT ---
  if (honeypot) {
    console.log(`🤖 Bot detectado y bloqueado en newsletter silenciósamente. Email ignorado: ${email}`);
    // Respondemos OK para que el bot crea que funcionó
    return {
      statusCode: 200,
      body: JSON.stringify({ status: "success", message: "Correo enviado exitosamente." }),
    };
  }

  // Validación simple del email
  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ status: "error", message: "Email es requerido." }),
    };
  }

  // Configurar el transporte SMTP para Gmail (podés cambiarlo a cualquier otro proveedor SMTP)
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER, // Reemplaza con tu correo
      pass: process.env.EMAIL_PASS, // Reemplaza con tu contraseña o con la App Password de Gmail si usas autenticación de 2 pasos
    },
  });

  // Definir el contenido del correo electrónico
  let mailOptions = {
    from: process.env.EMAIL_USER || "contacto@circula.uy", // Remitente
    to: "contacto@circula.uy", // Destinatario (el correo al que querés enviar)
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


exports.handler = async (event, context) => {
    const corsUtils = require('./utils/cors');
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: corsUtils.getCorsHeaders(event),
            body: ""
        };
    }
    const response = await originalHandler(event, context);
    if (response && typeof response === 'object') {
        response.headers = { ...response.headers, ...corsUtils.getCorsHeaders(event) };
    }
    return response;
};
