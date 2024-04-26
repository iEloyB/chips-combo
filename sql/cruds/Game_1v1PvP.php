<?php
require_once "../db_connect.php";

class Game_1v1PvP
{
    private $conn;

    public function __construct($connection)
    {
        $this->conn = $connection;
    }

    public function create($status, $queueId, $player1Id, $player2Id, $player1obstacles, $player2obstacles, $winnerId, $round)
    {
        $sql = "INSERT INTO Game_1v1PvP (ga_status, ga_queueId, player1Id, player2Id, player1obstacles, player2obstacles, winnerId, round) VALUES ('$status', $queueId, $player1Id, $player2Id, '$player1obstacles', '$player2obstacles', $winnerId, $round)";
        if ($this->conn->query($sql) === TRUE) {
            return "New game created successfully.";
        } else {
            return "Error creating game: " . $this->conn->error;
        }
    }

    public function read()
    {
        $games = array();
        $sql = "SELECT * FROM Game_1v1PvP";
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
        $sql = "SELECT * FROM Game_1v1PvP WHERE ga_id=$gameId";
        $result = $this->conn->query($sql);
        if ($result->num_rows > 0) {
            return $result->fetch_assoc();
        } else {
            return "Game not found.";
        }
    }

    public function update($gameId, $status, $queueId, $player1Id, $player2Id, $player1obstacles, $player2obstacles, $winnerId, $round)
    {
        $sql = "UPDATE Game_1v1PvP SET ga_status='$status', ga_queueId=$queueId, player1Id=$player1Id, player2Id=$player2Id, player1obstacles='$player1obstacles', player2obstacles='$player2obstacles', winnerId=$winnerId, round=$round WHERE ga_id=$gameId";
        if ($this->conn->query($sql) === TRUE) {
            return "Game updated successfully.";
        } else {
            return "Error updating game: " . $this->conn->error;
        }
    }

    public function delete($gameId)
    {
        $sql = "DELETE FROM Game_1v1PvP WHERE ga_id=$gameId";
        if ($this->conn->query($sql) === TRUE) {
            return "Game deleted successfully.";
        } else {
            return "Error deleting game: " . $this->conn->error;
        }
    }
}

$game_1v1pvp = new Game_1v1PvP($conn);

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['operation'])) {
    $operation = $_POST['operation'];

    switch ($operation) {
        case 'create':
            if (isset($_POST['status'], $_POST['queueId'], $_POST['player1Id'], $_POST['player2Id'], $_POST['player1obstacles'], $_POST['player2obstacles'], $_POST['winnerId'], $_POST['round'])) {
                $status = $_POST['status'];
                $queueId = $_POST['queueId'];
                $player1Id = $_POST['player1Id'];
                $player2Id = $_POST['player2Id'];
                $player1obstacles = $_POST['player1obstacles'];
                $player2obstacles = $_POST['player2obstacles'];
                $winnerId = $_POST['winnerId'];
                $round = $_POST['round'];
                echo $game_1v1pvp->create($status, $queueId, $player1Id, $player2Id, $player1obstacles, $player2obstacles, $winnerId, $round);
            } else {
                echo "Missing parameters for create operation.";
            }
            break;
        case 'read':
            $games = $game_1v1pvp->read();
            echo json_encode($games);
            break;
        case 'readById':
            if (isset($_POST['id'])) {
                $gameId = $_POST['id'];
                $gameData = $game_1v1pvp->readById($gameId);
                echo json_encode($gameData);
            } else {
                echo "ID is required for readById operation.";
            }
            break;
        case 'update':
            if (isset($_POST['id'], $_POST['status'], $_POST['queueId'], $_POST['player1Id'], $_POST['player2Id'], $_POST['player1obstacles'], $_POST['player2obstacles'], $_POST['winnerId'], $_POST['round'])) {
                $gameId = $_POST['id'];
                $status = $_POST['status'];
                $queueId = $_POST['queueId'];
                $player1Id = $_POST['player1Id'];
                $player2Id = $_POST['player2Id'];
                $player1obstacles = $_POST['player1obstacles'];
                $player2obstacles = $_POST['player2obstacles'];
                $winnerId = $_POST['winnerId'];
                $round = $_POST['round'];
                echo $game_1v1pvp->update($gameId, $status, $queueId, $player1Id, $player2Id, $player1obstacles, $player2obstacles, $winnerId, $round);
            } else {
                echo "Missing parameters for update operation.";
            }
            break;
        case 'delete':
            if (isset($_POST['id'])) {
                $gameId = $_POST['id'];
                echo $game_1v1pvp->delete($gameId);
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
                $games = $game_1v1pvp->read();
                echo json_encode($games);
                break;
            case 'readById':
                if (isset($_GET['id'])) {
                    $gameId = $_GET['id'];
                    $gameData = $game_1v1pvp->readById($gameId);
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