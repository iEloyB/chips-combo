<?php
session_start();
require_once "../db_connect.php";

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['email'], $_POST['password'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];

    if ($conn->connect_error) {
        $response['error'] = "Connection failed: " . $conn->connect_error;
    } else {
        $stmt = $conn->prepare("SELECT pl_id, pl_name FROM Player WHERE pl_email = ? AND pl_pass = ?");
        $stmt->bind_param("ss", $email, $password);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 1) {
            $row = $result->fetch_assoc();
            $_SESSION['user_id'] = $row['pl_id'];
            $_SESSION['user_name'] = $row['pl_name'];
            $response['success'] = "Login successful.";
        } else {
            $response['error'] = "Invalid email or password.";
        }

        $stmt->close();
    }

    $conn->close();
} else {
    $response['error'] = "Email and password are required.";
}

header('Content-Type: application/json');
echo json_encode($response);
?>