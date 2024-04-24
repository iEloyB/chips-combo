<?php
require_once "../db_connect.php";

class Game
{
    private $conn;

    public function __construct($connection)
    {
        $this->conn = $connection;
    }

    public function create($status, $queueId)
    {
        $sql = "INSERT INTO Game (ga_status, ga_queueId) VALUES ('$status', $queueId)";
        if ($this->conn->query($sql) === TRUE) {
            return "New game created successfully.";
        } else {
            return "Error creating game: " . $this->conn->error;
        }
    }

    public function read()
    {
        $games = array();
        $sql = "SELECT * FROM Game";
        $result = $this->conn->query($sql);
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $games[] = $row;
            }
        }
        return $games;
    }

    public function readById($gameId)
    {
        $sql = "SELECT * FROM Game WHERE ga_id=$gameId";
        $result = $this->conn->query($sql);
        if ($result->num_rows > 0) {
            return $result->fetch_assoc();
        } else {
            return "Game not found.";
        }
    }

    public function update($gameId, $status, $queueId)
    {
        $sql = "UPDATE Game SET ga_status='$status', ga_queueId=$queueId WHERE ga_id=$gameId";
        if ($this->conn->query($sql) === TRUE) {
            return "Game updated successfully.";
        } else {
            return "Error updating game: " . $this->conn->error;
        }
    }

    public function delete($gameId)
    {
        $sql = "DELETE FROM Game WHERE ga_id=$gameId";
        if ($this->conn->query($sql) === TRUE) {
            return "Game deleted successfully.";
        } else {
            return "Error deleting game: " . $this->conn->error;
        }
    }
}

$game = new Game($conn);

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['operation'])) {
    $operation = $_POST['operation'];

    switch ($operation) {
        case 'create':
            if (isset($_POST['status'], $_POST['queueId'])) {
                $status = $_POST['status'];
                $queueId = $_POST['queueId'];
                echo $game->create($status, $queueId);
            } else {
                echo "Missing parameters for create operation.";
            }
            break;
        case 'read':
            $games = $game->read();
            echo json_encode($games);
            break;
        case 'readById':
            if (isset($_POST['id'])) {
                $gameId = $_POST['id'];
                $gameData = $game->readById($gameId);
                echo json_encode($gameData);
            } else {
                echo "ID is required for readById operation.";
            }
            break;
        case 'update':
            if (isset($_POST['id'], $_POST['status'], $_POST['queueId'])) {
                $gameId = $_POST['id'];
                $status = $_POST['status'];
                $queueId = $_POST['queueId'];
                echo $game->update($gameId, $status, $queueId);
            } else {
                echo "Missing parameters for update operation.";
            }
            break;
        case 'delete':
            if (isset($_POST['id'])) {
                $gameId = $_POST['id'];
                echo $game->delete($gameId);
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
                $games = $game->read();
                echo json_encode($games);
                break;
            case 'readById':
                if (isset($_GET['id'])) {
                    $gameId = $_GET['id'];
                    $gameData = $game->readById($gameId);
                    echo json_encode($gameData);
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