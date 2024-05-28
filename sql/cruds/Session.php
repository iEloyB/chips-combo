<?php
require_once "../db_connect.php";

class Session
{
    private $conn;

    public function __construct($connection)
    {
        $this->conn = $connection;
    }

    public function create($playerId, $status)
    {
        $token = bin2hex(random_bytes(32));

        $sql = "INSERT INTO Session (se_playerId, se_token, se_status) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("iss", $playerId, $token, $status);

        if ($stmt->execute()) {
            return [
                "message" => "New session created successfully.",
                "session" => [
                    "se_id" => $stmt->insert_id,
                    "se_playerId" => $playerId,
                    "se_token" => $token,
                    "se_status" => $status
                ]
            ];
        } else {
            return [
                "error" => "Error creating session: " . $stmt->error
            ];
        }
    }

    public function read()
    {
        $sessions = array();
        $sql = "SELECT * FROM Session";
        $result = $this->conn->query($sql);
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $sessions[] = $row;
            }
        }
        return $sessions;
    }

    public function readById($playerId)
    {
        $sql = "SELECT * FROM Session WHERE se_playerId=$playerId";
        $result = $this->conn->query($sql);
        if ($result->num_rows > 0) {
            return $result->fetch_assoc();
        } else {
            return [
                "error" => "Session not found.",
                "player_id" => "$playerId"
            ];
        }
    }

    public function update($playerId, $status)
    {
        $token = bin2hex(random_bytes(32));

        $sql = "UPDATE Session SET se_status=?, se_token=? WHERE se_playerId=?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssi", $status, $token, $playerId);

        if ($stmt->execute()) {
            return [
                "message" => "Session updated successfully.",
                "player_id" => $playerId
            ];
        } else {
            return [
                "error" => "Error updating session: " . $this->conn->error
            ];
        }
    }

    public function delete($sessionId)
    {
        $sql = "DELETE FROM Session WHERE se_id=$sessionId";
        if ($this->conn->query($sql) === TRUE) {
            return [
                "message" => "Session deleted successfully.",
                "session_id" => $sessionId
            ];
        } else {
            return [
                "error" => "Error deleting session: " . $this->conn->error
            ];
        }
    }
}

$session = new Session($conn);

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['operation'])) {
    $operation = $_POST['operation'];

    switch ($operation) {
        case 'create':
            if (isset($_POST['playerId'], $_POST['status'])) {
                $playerId = $_POST['playerId'];
                $status = $_POST['status'];
                $result = $session->create($playerId, $status);
                echo json_encode($result);
            } else {
                echo json_encode(["error" => "Missing parameters for create operation."]);
            }
            break;
        case 'read':
            $sessions = $session->read();
            echo json_encode($sessions);
            break;
        case 'readById':
            if (isset($_POST['id'])) {
                $sessionId = $_POST['id'];
                $sessionData = $session->readById($sessionId);
                echo json_encode($sessionData);
            } else {
                echo json_encode(["error" => "ID is required for readById operation."]);
            }
            break;
        case 'update':
            if (isset($_POST['id'], $_POST['status'])) {
                $sessionId = $_POST['id'];
                $status = $_POST['status'];
                $result = $session->update($sessionId, $status);
                echo json_encode($result);
            } else {
                echo json_encode(["error" => "Missing parameters for update operation."]);
            }
            break;
        case 'delete':
            if (isset($_POST['id'])) {
                $sessionId = $_POST['id'];
                $result = $session->delete($sessionId);
                echo json_encode($result);
            } else {
                echo json_encode(["error" => "ID is required for delete operation."]);
            }
            break;
        default:
            echo json_encode(["error" => "Invalid operation."]);
    }
} elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (isset($_GET['operation'])) {
        $operation = $_GET['operation'];

        switch ($operation) {
            case 'read':
                $sessions = $session->read();
                echo json_encode($sessions);
                break;
            case 'readById':
                if (isset($_GET['id'])) {
                    $sessionId = $_GET['id'];
                    $sessionData = $session->readById($sessionId);
                    echo json_encode($sessionData);
                } else {
                    echo json_encode(["error" => "ID is required for readById operation."]);
                }
                break;
            default:
                echo json_encode(["error" => "Invalid operation."]);
        }
    } else {
        echo json_encode(["error" => "Operation is required."]);
    }
}
?>