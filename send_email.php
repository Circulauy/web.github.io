<?php
header('Content-Type: application/json'); // Establece el tipo de contenido de la respuesta a JSON

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);

    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $to = "contacto@circula.uy";
        $subject = "Nueva suscripción al newsletter";
        $message = "El siguiente correo electrónico se ha suscrito al newsletter: " . $email;
        $headers = "From: contacto@circula.uy\r\n" .
                   "Reply-To: contacto@circula.uy\r\n" .
                   "X-Mailer: PHP/" . phpversion();

        if (mail($to, $subject, $message, $headers)) {
            $response['status'] = 'success';
            $response['message'] = 'Correo enviado exitosamente.';
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Error al enviar el correo.';
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Dirección de email no válida.';
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Método de solicitud no permitido.';
}

echo json_encode($response);
?>
