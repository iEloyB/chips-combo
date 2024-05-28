<?php
require_once "../db_connect.php";

class Color
{
    private $conn;

    public function __construct($connection)
    {
        $this->conn = $connection;
    }

    public function create($hexadecimalColor)
    {
        $sql = "INSERT INTO Color (co_hexadecimalColor) VALUES ('$hexadecimalColor')";
        if ($this->conn->query($sql) === TRUE) {
            return "New color created successfully.";
        } else {
            return "Error creating color: " . $this->conn->error;
        }
    }

    public function read()
    {
        $colors = array();
        $sql = "SELECT * FROM Color";
        $result = $this->conn->query($sql);
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $colors[] = $row;
            }
        }
        return $colors;
    }

    public function readById($colorId)
    {
        $sql = "SELECT * FROM Color WHERE co_id=$colorId";
        $result = $this->conn->query($sql);
        if ($result->num_rows > 0) {
            return $result->fetch_assoc();
        } else {
            echo json_encode(array());
        }
    }
    public function update($colorId, $hexadecimalColor)
    {
        $sql = "UPDATE Color SET co_hexadecimalColor='$hexadecimalColor' WHERE co_id=$colorId";
        if ($this->conn->query($sql) === TRUE) {
            return "Color updated successfully.";
        } else {
            return "Error updating color: " . $this->conn->error;
        }
    }

    public function delete($colorId)
    {
        $sql = "DELETE FROM Color WHERE co_id=$colorId";
        if ($this->conn->query($sql) === TRUE) {
            return "Color deleted successfully.";
        } else {
            return "Error deleting color: " . $this->conn->error;
        }
    }
}

$color = new Color($conn);

if ($_SERVER['REQUEST_METHOD'] === 'GET' || $_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_REQUEST['operation'])) {
        switch ($_REQUEST['operation']) {
            case 'create':
                if (isset($_REQUEST['hexColor'])) {
                    $hexColor = $_REQUEST['hexColor'];
                    echo $color->create($hexColor);
                } else {
                    echo "Hex color is required for create operation.";
                }
                break;
            case 'read':
                if (isset($_REQUEST['id'])) {
                    $id = $_REQUEST['id'];
                    $colorData = $color->readById($id);
                    echo json_encode($colorData);
                } else {
                    $colors = $color->read();
                    echo json_encode($colors);
                }
                break;
            case 'update':
                if (isset($_REQUEST['id'], $_REQUEST['newHexColor'])) {
                    $id = $_REQUEST['id'];
                    $newHexColor = $_REQUEST['newHexColor'];
                    echo $color->update($id, $newHexColor);
                } else {
                    echo "ID and new hex color are required for update operation.";
                }
                break;
            case 'delete':
                if (isset($_REQUEST['id'])) {
                    $id = $_REQUEST['id'];
                    echo $color->delete($id);
                } else {
                    echo "ID is required for delete operation.";
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