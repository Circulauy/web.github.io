// Importar la librería de nodemailer para enviar correos
const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  // Verificar si el método de la solicitud es POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Método no permitido",
    };
  }

  // Extraer los datos enviados desde el formulario
  const { nombre, email, motivo, mensaje } = JSON.parse(event.body);

  // Configurar el transportador de correo con nodemailer
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "toni.robaina@gmail.com", // Cambia esto con tu correo de origen
      pass: "hkce wmts ukhf jdvh", // Cambia esto con tu contraseña de aplicación
    },
  });

  // Definir las opciones del correo
  let mailOptions = {
    from: email,
    to: "circulauy@correo.com", // Cambia esto con tu correo de destino
    subject: `Nuevo mensaje de contacto: ${motivo}`,
    text: `Nombre: ${nombre}\nCorreo: ${email}\nMotivo: ${motivo}\nMensaje: ${mensaje}`,
  };

  // Intentar enviar el correo
  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Correo enviado exitosamente" }),
    };
  } catch (error) {
    console.error("Error al enviar el correo: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error al enviar el correo" }),
    };
  }
};
