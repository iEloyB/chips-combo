<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chips combo! - Play</title>

    <link rel="stylesheet" href="./css/play/play.css">
    <script src="./js/pages/play.js" type="module" defer></script>
</head>
<body class="pattern">
<?php
    include ("./php/header.php");
    ?>
    <h1>Play!</h1>

    <main>
        <select name="modes" id="modes">
            <!-- <option value="solo">Solo</option> -->
            <option value="1v1">1v1 PvP</option>
        </select>

        <button class="play">Play</button>
        <p class="queueStatus"></p>
    </main>
</body>
</html>