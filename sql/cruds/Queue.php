<?php
require_once "../db_connect.php";

class Queue
{
    private $conn;

    public function __construct($connection)
    {
        $this->conn = $connection;
    }

    public function create($status, $type, $playerId)
    {
        $sql = "INSERT INTO Queue (qu_status, qu_type, qu_playerId) VALUES ('$status', '$type', $playerId)";
        if ($this->conn->query($sql) === TRUE) {
            return "New queue created successfully.";
        } else {
            return "Error creating queue: " . $this->conn->error;
        }
    }

    public function read()
    {
        $queues = array();
        $sql = "SELECT * FROM Queue";
        $result = $this->conn->query($sql);
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $queues[] = $row;
            }
        }
        return $queues;
    }

    public function readById($queueId)
    {
        $sql = "SELECT * FROM Queue WHERE qu_id=$queueId";
        $result = $this->conn->query($sql);
        if ($result->num_rows > 0) {
            return $result->fetch_assoc();
        } else {
            return "Queue not found.";
        }
    }

    public function update($queueId, $status, $type)
    {
        $sql = "UPDATE Queue SET qu_status='$status', qu_type='$type' WHERE qu_id=$queueId";
        if ($this->conn->query($sql) === TRUE) {
            return "Queue updated successfully.";
        } else {
            return "Error updating queue: " . $this->conn->error;
        }
    }

    public function delete($queueId)
    {
        $sql = "DELETE FROM Queue WHERE qu_id=$queueId";
        if ($this->conn->query($sql) === TRUE) {
            return "Queue deleted successfully.";
        } else {
            return "Error deleting queue: " . $this->conn->error;
        }
    }
}

$queue = new Queue($conn);

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['operation'])) {
    $operation = $_POST['operation'];

    switch ($operation) {
        case 'create':
            if (isset($_POST['status'], $_POST['type'], $_POST['playerId'])) {
                $status = $_POST['status'];
                $type = $_POST['type'];
                $playerId = $_POST['playerId'];
                echo $queue->create($status, $type, $playerId);
            } else {
                echo "Missing parameters for create operation.";
            }
            break;
        case 'read':
            $queues = $queue->read();
            echo json_encode($queues);
            break;
        case 'readById':
            if (isset($_GET['id'])) {
                $queueId = $_GET['id'];
                $queueData = $queue->readById($queueId);
                echo json_encode($queueData);
            } else {
                echo "ID is required for readById operation.";
            }
            break;
        case 'update':
            if (isset($_POST['id'], $_POST['status'], $_POST['type'])) {
                $queueId = $_POST['id'];
                $status = $_POST['status'];
                $type = $_POST['type'];
                echo $queue->update($queueId, $status, $type);
            } else {
                echo "Missing parameters for update operation.";
            }
            break;
        case 'delete':
            if (isset($_POST['id'])) {
                $queueId = $_POST['id'];
                echo $queue->delete($queueId);
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
                $queues = $queue->read();
                echo json_encode($queues);
                break;
            case 'readById':
                if (isset($_GET['id'])) {
                    $queueId = $_GET['id'];
                    $queueData = $queue->readById($queueId);
                    echo json_encode($queueData);
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