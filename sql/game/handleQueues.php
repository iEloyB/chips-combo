<?php
set_time_limit(0);

require_once "/opt/lampp/htdocs/chips-combo/sql/db_connect.php";

function processGames()
{
    global $conn;

    $sql = "SELECT qu_playerId, qu_id FROM Queue WHERE qu_status = 'waiting' ORDER BY qu_id ASC LIMIT 2";
    $result = $conn->query($sql);

    if ($result->num_rows >= 2) {
        $players = array();

        while ($row = $result->fetch_assoc()) {
            $players[] = $row;
        }

        $player1Id = $players[0]['qu_playerId'];
        $player2Id = $players[1]['qu_playerId'];
        $queueId1 = $players[0]['qu_id'];
        $queueId2 = $players[1]['qu_id'];

        deleteQueue($queueId1);
        deleteQueue($queueId2);

        createGameForPlayers($player1Id, $player2Id);

        echo "Se ha iniciado una partida para los jugadores con IDs $player1Id y $player2Id.<br>";
    } else {
        echo "No hay suficientes jugadores esperando en la cola para iniciar una partida.<br>";
    }
}

function createGameForPlayers($player1Id, $player2Id)
{
    global $conn;

    $sql = "INSERT INTO Game_1v1PvP (ga_status, player1Id, player2Id, player1points, player2points) 
            VALUES ('starting', $player1Id, $player2Id, 0, 0)";
    
    $result = $conn->query($sql);
    if (!$result) {
        die("Error al crear la partida: " . $conn->error);
    }
}

function deleteQueue($queueId)
{
    global $conn;

    $sql = "DELETE FROM Queue WHERE qu_id = $queueId";
    $result = $conn->query($sql);
    if (!$result) {
        die("Error al eliminar la entrada de la cola: " . $conn->error);
    }
}

processGames();

?>
