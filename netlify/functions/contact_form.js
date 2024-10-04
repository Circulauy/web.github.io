// Importar la librería nodemailer para enviar correos
const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  // Verificar que el método sea POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Método no permitido" }),
    };
  }

  // Extraer los datos directamente de `event.body`
  let formData;
  try {
    formData = JSON.parse(event.body); // Si `event.body` ya es JSON, no se necesita `parse`
  } catch (error) {
    console.error("Error al parsear el cuerpo de la solicitud:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Formato de datos incorrecto" }),
    };
  }

  const { nombre, email1, motivo, mensaje } = formData;

  // Validar los datos del formulario
  if (!nombre || !email1 || !motivo || !mensaje) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Todos los campos son obligatorios"}),
    };
  }

  // Configurar el transportador de nodemailer con tus credenciales de correo
  let transporter = nodemailer.createTransport({
    service: "gmail", // Cambia esto según el servicio de correo que utilices
    auth: {
      user: "toni.robaina@gmail.com", // Cambia esto con el correo de origen
      pass: process.env.SUPER_SECRET // "uxwf oqfy ugnm dilj", // Cambia esto con la contraseña de la aplicación
    },
  });

  // Definir las opciones del correo
  let mailOptions = {
    from: email,
    to: "circulauy@gmail.com", // Cambia esto con el correo de destino
    subject: `Nuevo mensaje de contacto de: ${nombre}`,
    text: `Motivo: ${motivo}\nMensaje:\n${mensaje}\n\nCorreo del remitente: ${email}`,
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
