<?php
require_once "../db_connect.php";

class Obstacle
{
    private $conn;

    public function __construct($connection)
    {
        $this->conn = $connection;
    }

    public function create($gameId, $x, $y, $playerSelector, $colorsRemaining)
    {
        $sql = "INSERT INTO Obstacle (ob_gameId, ob_playerSelectorId, ob_x, ob_y, ob_colorsRemaining) VALUES ($gameId, $playerSelector, $x, $y, '$colorsRemaining')";
        
        if ($this->conn->query($sql) === TRUE) {
            return "New obstacle created successfully.";
        } else {
            return "Error creating obstacle: " . $this->conn->error;
        }
    }

    public function read()
    {
        $obstacles = array();
        $sql = "SELECT * FROM Obstacle";
        $result = $this->conn->query($sql);
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $obstacles[] = $row;
            }
        }
        return $obstacles;
    }

    public function readById($obstacleId)
    {
        $sql = "SELECT * FROM Obstacle WHERE ob_id=$obstacleId";
        $result = $this->conn->query($sql);
        
        $obstacles = array(); // Array para almacenar los obstáculos encontrados
        
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $obstacles[] = $row;
            }
        }
        
        return $obstacles; // Devolver el array de obstáculos (puede ser vacío si no se encuentran obstáculos)
    }
    
    public function readByGameId($obstacleId)
    {
        $sql = "SELECT * FROM Obstacle WHERE ob_gameId=$obstacleId";
        $result = $this->conn->query($sql);
        
        $obstacles = array(); // Array para almacenar los obstáculos encontrados
        
        if ($result->num_rows > 0) {
            // Si se encuentran obstáculos, iterar sobre cada fila y agregar al array $obstacles
            while ($row = $result->fetch_assoc()) {
                $obstacles[] = $row;
            }
        }
        
        return $obstacles; // Devolver el array de obstáculos (puede ser vacío si no se encuentran obstáculos)
    }

    public function update($obstacleId, $gameId, $x, $y, $colorsRemaining)
    {
        $sql = "UPDATE Obstacle SET ob_gameId=$gameId, ob_x=$x, ob_y=$y, ob_colorsRemaining='$colorsRemaining' WHERE ob_id=$obstacleId";
        if ($this->conn->query($sql) === TRUE) {
            return "Obstacle updated successfully.";
        } else {
            return "Error updating obstacle: " . $this->conn->error;
        }
    }

    public function delete($obstacleId)
    {
        $sql = "DELETE FROM Obstacle WHERE ob_id=$obstacleId";
        if ($this->conn->query($sql) === TRUE) {
            return "Obstacle deleted successfully.";
        } else {
            return "Error deleting obstacle: " . $this->conn->error;
        }
    }
}

$obstacle = new Obstacle($conn);

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['operation'])) {
    $operation = $_POST['operation'];

    switch ($operation) {
        case 'create':
            if (isset($_POST['gameId'], $_POST['x'], $_POST['y'], $_POST['playerSelectorId'], $_POST['colorsRemaining'])) {
                $gameId = $_POST['gameId'];
                $x = $_POST['x'];
                $y = $_POST['y'];
                $playerSelectorId = $_POST['playerSelectorId'];
                $colorsRemaining = $_POST['colorsRemaining'];

                echo json_encode($obstacle->create($gameId, $x, $y, $playerSelectorId, $colorsRemaining));
            } else {
                echo "Missing parameters for create operation.";
            }
            break;
        case 'read':
            $obstacles = $obstacle->read();
            echo json_encode($obstacles);
            break;
        case 'readById':
            if (isset($_POST['id'])) {
                $obstacleId = $_POST['id'];
                $obstacleData = $obstacle->readById($obstacleId);
                echo json_encode($obstacleData);
            } else {
                echo "ID is required for readById operation.";
            }
            break;
        case 'readByGameId':
            if (isset($_POST['id'])) {
                $obstacleId = $_POST['id'];
                $obstacleData = $obstacle->readByGameId($obstacleId);
                echo json_encode($obstacleData);
            } else {
                echo "ID is required for readByGameId operation.";
            }
            break;
        case 'update':
            if (isset($_POST['id'], $_POST['gameId'], $_POST['x'], $_POST['y'], $_POST['colorsRemaining'])) {
                $obstacleId = $_POST['id'];
                $gameId = $_POST['gameId'];
                $x = $_POST['x'];
                $y = $_POST['y'];
                $colorsRemaining = $_POST['colorsRemaining'];
                echo json_encode($obstacle->update($obstacleId, $gameId, $x, $y, $colorsRemaining));
            } else {
                echo "Missing parameters for update operation.";
            }
            break;
        case 'delete':
            if (isset($_POST['id'])) {
                $obstacleId = $_POST['id'];
                echo json_encode($obstacle->delete($obstacleId));
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
                $obstacles = $obstacle->read();
                echo json_encode($obstacles);
                break;
            case 'readById':
                if (isset($_GET['id'])) {
                    $obstacleId = $_GET['id'];
                    $obstacleData = $obstacle->readById($obstacleId);
                    echo json_encode($obstacleData);
                } else {
                    echo "ID is required for readById operation.";
                }
                break;
            case 'readByGameId':
                if (isset($_GET['id'])) {
                    $obstacleId = $_GET['id'];
                    $obstacleData = $obstacle->readByGameId($obstacleId);
                    echo json_encode($obstacleData);
                } else {
                    echo "ID is required for readByGameId operation.";
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
