<?php
require_once "../db_connect.php";

class Player
{
    private $conn;

    public function __construct($connection)
    {
        $this->conn = $connection;
    }

    public function create($name, $tag, $iconId, $xp, $coins, $email, $password)
    {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO Player (pl_name, pl_tag, pl_iconId, pl_xp, pl_coins, pl_email, pl_pass) VALUES ('$name', '$tag', $iconId, $xp, $coins, '$email', '$hashedPassword')";
        if ($this->conn->query($sql) === TRUE) {
            return "New player created successfully.";
        } else {
            return "Error creating player: " . $this->conn->error;
        }
    }

    public function read()
    {
        $players = array();
        $sql = "SELECT pl_id, pl_name, pl_tag, pl_iconId, pl_xp, pl_coins, pl_email FROM Player";
        $result = $this->conn->query($sql);
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $players[] = $row;
            }
        }
        return $players;
    }

    public function readById($playerId)
    {
        $sql = "SELECT * FROM Player WHERE pl_id=$playerId";
        $result = $this->conn->query($sql);
        if ($result->num_rows > 0) {
            return $result->fetch_assoc();
        } else {
            return "Player not found.";
        }
    }

    public function update($playerId, $name, $tag, $iconId, $xp, $coins, $email)
    {
        $sql = "UPDATE Player SET pl_name='$name', pl_tag='$tag', pl_iconId=$iconId, pl_xp=$xp, pl_coins=$coins, pl_email='$email' WHERE pl_id=$playerId";
        if ($this->conn->query($sql) === TRUE) {
            return "Player updated successfully.";
        } else {
            return "Error updating player: " . $this->conn->error;
        }
    }

    public function delete($playerId)
    {
        $sql = "DELETE FROM Player WHERE pl_id=$playerId";
        if ($this->conn->query($sql) === TRUE) {
            return "Player deleted successfully.";
        } else {
            return "Error deleting player: " . $this->conn->error;
        }
    }
}

$player = new Player($conn);

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['operation'])) {
    $operation = $_POST['operation'];

    switch ($operation) {
        case 'create':
            if (isset($_POST['name'], $_POST['tag'], $_POST['iconId'], $_POST['xp'], $_POST['coins'], $_POST['email'], $_POST['password'])) {
                $name = $_POST['name'];
                $tag = $_POST['tag'];
                $iconId = $_POST['iconId'];
                $xp = $_POST['xp'];
                $coins = $_POST['coins'];
                $email = $_POST['email'];
                $password = $_POST['password'];
                echo $player->create($name, $tag, $iconId, $xp, $coins, $email, $password);
            } else {
                echo "Missing parameters for create operation.";
            }
            break;
        case 'read':
            $players = $player->read();
            echo json_encode($players);
            break;
        case 'readById':
            if (isset($_POST['id'])) {
                $playerId = $_POST['id'];
                $playerData = $player->readById($playerId);
                echo json_encode($playerData);
            } else {
                echo "ID is required for readById operation.";
            }
            break;
        case 'update':
            if (isset($_POST['id'], $_POST['name'], $_POST['tag'], $_POST['iconId'], $_POST['xp'], $_POST['coins'], $_POST['email'])) {
                $playerId = $_POST['id'];
                $name = $_POST['name'];
                $tag = $_POST['tag'];
                $iconId = $_POST['iconId'];
                $xp = $_POST['xp'];
                $coins = $_POST['coins'];
                $email = $_POST['email'];
                echo $player->update($playerId, $name, $tag, $iconId, $xp, $coins, $email);
            } else {
                echo "Missing parameters for update operation.";
            }
            break;
        case 'delete':
            if (isset($_POST['id'])) {
                $playerId = $_POST['id'];
                echo $player->delete($playerId);
            } else {
                echo "ID is required for delete operation.";
            }
            break;
        default:
            echo "Invalid operation.";
    }
} elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (isset($_GET['operation'])) {
        $operation = $_GET['operation'];

        switch ($operation) {
            case 'read':
                $players = $player->read();
                echo json_encode($players);
                break;
            case 'readById':
                if (isset($_GET['id'])) {
                    $playerId = $_GET['id'];
                    $playerData = $player->readById($playerId);
                    echo json_encode($playerData);
                } else {
                    echo "ID is required for readById operation.";
                }
                break;
            default:
                echo "Invalid operation.";
        }
    } else {
        echo "Operation is required.";
    }
}
?>