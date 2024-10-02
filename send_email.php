<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);

    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $to = "circulauy@gmail.com";
        $subject = "Nueva suscripción al newsletter";
        $message = "El siguiente correo electrónico se ha suscrito al newsletter: " . $email;
        $headers = "From: circulauy@gmail.com\r\n" .
                   "Reply-To: circulauy@gmail.com\r\n" .
                   "X-Mailer: PHP/" . phpversion();

        if (mail($to, $subject, $message, $headers)) {
            echo "Correo enviado exitosamente.";
        } else {
            echo "Error al enviar el correo.";
        }
    } else {
        echo "Dirección de email no válida.";
    }
} else {
    echo "Método de solicitud no permitido.";
}
?>
