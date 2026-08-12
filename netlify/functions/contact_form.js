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
    formData = JSON.parse(event.body); 
  } catch (error) {
    console.error("Error al parsear el cuerpo de la solicitud:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Formato de datos incorrecto" }),
    };
  }

  const { name, email, interest, message, attachmentBase64, attachmentName, attachmentType } = formData;

  // Validar los datos del formulario
  if (!name || !email || !interest || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Todos los campos son obligatorios"}),
    };
  }

  // Guardar en la base de datos (Supabase o Mock)
  const db = require("./utils/db");
  try {
    await db.saveMessage({
      name, email, interest, message,
      attachment_name: attachmentName,
      attachment_type: attachmentType,
      attachment_base64: attachmentBase64
    });
  } catch (e) {
    console.error("Error guardando el mensaje en la base de datos:", e);
    // Continuamos para enviar el correo de todas formas
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("⚠️ No están configuradas las variables de entorno EMAIL_USER o EMAIL_PASS.");
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "El servidor de correos no está configurado." }),
    };
  }

  // Configurar el transportador de nodemailer con tus credenciales de correo
  let transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS 
    },
  });

  // Preparar el archivo adjunto si existe
  const attachments = [];
  if (attachmentBase64 && attachmentName && attachmentType) {
    // Eliminar el prefijo data:tipo/extension;base64, si lo hubiera
    const base64Data = attachmentBase64.replace(/^data:.*?;base64,/, "");
    attachments.push({
      filename: attachmentName,
      content: base64Data,
      encoding: 'base64',
      contentType: attachmentType
    });
  }

  // 1. Opciones del correo para NOTIFICAR AL EQUIPO DE CIRCULA
  let notificationMailOptions = {
    from: process.env.EMAIL_USER, // El correo se envía desde la cuenta propia para evitar que Gmail lo marque como SPAM o Forjado
    replyTo: email, // Si responden a este correo, se dirige al cliente
    to: "contacto@circula.uy", 
    subject: `Consulta Web: ${interest} (${name})`,
    html: `
      <h2>Nueva consulta desde la web</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Interés:</strong> ${interest}</p>
      <p><strong>Mensaje:</strong></p>
      <blockquote style="background: #f8f9fa; padding: 10px; border-left: 4px solid #79C7C7;">
        ${message.replace(/\n/g, '<br>')}
      </blockquote>
      ${attachments.length > 0 ? `<p><em>📎 Se incluyó un archivo adjunto.</em></p>` : ''}
    `,
    attachments: attachments
  };

  // 2. Preparar el correo de AUTO-RESPUESTA para el CLIENTE
  let autoResponseHtml = "";
  if (interest === 'Solicitud de trabajo') {
    autoResponseHtml = `
      <p>¡Hola ${name}! Gracias por tu interés en sumarte al equipo de Circula.</p>
      <p>Confirmamos que hemos recibido tu solicitud y CV. Actualmente no contamos con vacantes activas, pero guardaremos tu información en nuestra base de datos para futuras búsquedas.</p>
      <p>¡Saludos!<br>El equipo de Circula.</p>
    `;
  } else if (interest === 'Talleres para colegios') {
    autoResponseHtml = `
      <p>¡Hola ${name}! Gracias por tu interés en nuestra propuesta de talleres para instituciones.</p>
      <p>Te adjuntamos nuestra propuesta 2026 en este enlace:</p>
      <p><a href="https://drive.google.com/file/d/1WlnLk0vGFIfdLAwAnGF3cuNgsgAjwndZ/view?usp=drive_link">Ver Propuesta Colegios 2026</a></p>
      <p>Por otro lado, en el siguiente enlace podrás agendar directamente una reunión informativa con nosotros:</p>
      <p><a href="https://calendar.app.google/Zeax6rCH9hdCKMqNA">Agendar Reunión (Google Calendar)</a></p>
      <p>¡Quedamos a las órdenes y saludos!<br>El equipo de Circula.</p>
    `;
  } else if (interest === 'Talleres para empresas') {
    autoResponseHtml = `
      <p>¡Hola ${name}! Gracias por tu interés en nuestra propuesta de talleres corporativos.</p>
      <p>Te adjuntamos nuestra propuesta 2026 en este enlace:</p>
      <p><a href="https://drive.google.com/file/d/1y10XoMchiLkRlUdyiXqByPUAAUqsPj4-/view?usp=sharing">Ver Propuesta Empresas 2026</a></p>
      <p>Por otro lado, en el siguiente enlace podrás agendar directamente una reunión informativa con nosotros:</p>
      <p><a href="https://calendar.app.google/Zeax6rCH9hdCKMqNA">Agendar Reunión (Google Calendar)</a></p>
      <p>¡Quedamos a las órdenes y saludos!<br>El equipo de Circula.</p>
    `;
  } else {
    autoResponseHtml = `
      <p>¡Hola ${name}! Gracias por contactar a Circula.</p>
      <p>Hemos recibido tu consulta correctamente ("${interest}") y nuestro equipo te responderá a la brevedad con la información solicitada.</p>
      <p>¡Saludos!<br>El equipo de Circula.</p>
    `;
  }

  let autoResponseMailOptions = {
    from: `"Circula Uruguay" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Hemos recibido tu consulta - Circula`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
        <h2 style="color: #79C7C7;">¡Consulta Recibida!</h2>
        ${autoResponseHtml}
      </div>
    `
  };

  // Intentar enviar ambos correos
  try {
    // 1. Enviar notificación al admin
    await transporter.sendMail(notificationMailOptions);
    
    // 2. Enviar auto-respuesta al cliente
    await transporter.sendMail(autoResponseMailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Correos enviados exitosamente" }),
    };
  } catch (error) {
    console.error("Error al enviar los correos: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno al enviar los correos" }),
    };
  }
};
