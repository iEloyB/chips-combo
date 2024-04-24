<?php
require_once "../db_connect.php";

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['name'], $_POST['tag'], $_POST['email'], $_POST['password'])) {
    $user_name = $_POST['name'];
    $user_tag = $_POST['tag'];
    $user_email = $_POST['email'];
    $user_password = $_POST['password'];

    $stmt = $conn->prepare("SELECT pl_id FROM Player WHERE pl_email = ?");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $response['error'] = "Email already registered.";
    } else {
        $stmt = $conn->prepare("SELECT pl_id FROM Player WHERE pl_tag = ?");
        $stmt->bind_param("s", $user_tag);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $response['error'] = "Tag already registered.";
        } else {
            $stmt = $conn->prepare("INSERT INTO Player (pl_name, pl_tag, pl_email, pl_pass) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $user_name, $user_tag, $user_email, $user_password);

            if ($stmt->execute() === TRUE) {
                $response['success'] = "User registered successfully.";
            } else {
                $response['error'] = "Error: " . $conn->error;
            }
        }
    }

    $stmt->close();
    $conn->close();
} else {
    $response['error'] = "Name, email, tag, and password are required.";
}

// Devolver la respuesta como JSON
header('Content-Type: application/json');
echo json_encode($response);
?>