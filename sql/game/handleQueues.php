<?php
set_time_limit(0);

require_once "../sql/db_connect.php";

function processGames()
{
    global $conn;

    $sql = "SELECT qu_playerId, qu_id FROM Queue WHERE qu_status = 'waiting'";

    $result = $conn->query($sql);

    if ($result->num_rows >= 2) {
        $players = array();

        while ($row = $result->fetch_assoc()) {
            $players[] = $row;
        }

        if (count($players) >= 2) {
            $player1Id = $players[0]['qu_playerId'];
            $player2Id = $players[1]['qu_playerId'];
            $queueId1 = $players[0]['qu_id'];
            $queueId2 = $players[1]['qu_id'];

            createGameForPlayers($player1Id, $player2Id, $queueId1, $queueId2);

            deleteQueue($queueId1);
            deleteQueue($queueId2);

            echo "Se ha iniciado una partida para los jugadores con IDs $player1Id y $player2Id.<br>";
        }
    }
}

function createGameForPlayers($player1Id, $player2Id, $queueId1, $queueId2)
{
    global $conn;

    $sql = "INSERT INTO Game_1v1PvP (ga_status, ga_queueId, player1Id, player2Id) 
            VALUES ('starting', NULL, $player1Id, $player2Id)";

    if ($conn->query($sql) === TRUE) {
        echo "Nueva partida creada exitosamente.";
    } else {
        echo "Error al crear una nueva partida: " . $conn->error;
    }
}

function deleteQueue($queueId)
{
    global $conn;

    $sql = "DELETE FROM Queue WHERE qu_id = $queueId";
    $conn->query($sql);
}

processGames();
?>
