class Game_1v1PvP {
  #players;
  #board;
  #status; //PRE_GAME, IN_GAME, ENDING

  start() {}

  stop() {}

  setWinner(winnerId) {}
}

function makeRequest(method, url, data, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        callback(null, xhr.responseText);
      } else {
        callback("Error en la solicitud: " + xhr.status);
      }
    }
  };
  xhr.open(method, url, true);
  if (method === "POST") {
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  }
  xhr.send(data);
}

export function createGame(
  status,
  queueId,
  player1Id,
  player2Id,
  player1obstacles,
  player2obstacles,
  winnerId,
  round
) {
  const data = `operation=create&status=${encodeURIComponent(
    status
  )}&queueId=${encodeURIComponent(queueId)}&player1Id=${encodeURIComponent(
    player1Id
  )}&player2Id=${encodeURIComponent(
    player2Id
  )}&player1obstacles=${encodeURIComponent(
    player1obstacles
  )}&player2obstacles=${encodeURIComponent(
    player2obstacles
  )}&winnerId=${encodeURIComponent(winnerId)}&round=${encodeURIComponent(
    round
  )}`;
  makeRequest(
    "POST",
    "./sql/cruds/Game_1v1PvP.php",
    data,
    function (error, response) {
      if (error) {
        console.error(error);
      } else {
        console.log(response);
      }
    }
  );
}

export function updateGame(
  id,
  status,
  queueId,
  player1Id,
  player2Id,
  player1obstacles,
  player2obstacles,
  winnerId,
  round
) {
  const data = `operation=update&id=${encodeURIComponent(
    id
  )}&status=${encodeURIComponent(status)}&queueId=${encodeURIComponent(
    queueId
  )}&player1Id=${encodeURIComponent(player1Id)}&player2Id=${encodeURIComponent(
    player2Id
  )}&player1obstacles=${encodeURIComponent(
    player1obstacles
  )}&player2obstacles=${encodeURIComponent(
    player2obstacles
  )}&winnerId=${encodeURIComponent(winnerId)}&round=${encodeURIComponent(
    round
  )}`;
  makeRequest(
    "POST",
    "./sql/cruds/Game_1v1PvP.php",
    data,
    function (error, response) {
      if (error) {
        console.error(error);
      } else {
        console.log(response);
      }
    }
  );
}

export function deleteGame(id) {
  const data = `operation=delete&id=${encodeURIComponent(id)}`;
  makeRequest(
    "POST",
    "./sql/cruds/Game_1v1PvP.php",
    data,
    function (error, response) {
      if (error) {
        console.error(error);
      } else {
        console.log(response);
      }
    }
  );
}

export function readGameById(id) {
  makeRequest(
    "GET",
    `./sql/cruds/Game_1v1PvP.php?operation=readById&id=${encodeURIComponent(
      id
    )}`,
    null,
    function (error, response) {
      if (error) {
        console.error(error);
      } else {
        var game = JSON.parse(response);
        console.log(game);
      }
    }
  );
}

export function readGames() {
  makeRequest(
    "GET",
    "./sql/cruds/Game_1v1PvP.php?operation=read",
    null,
    function (error, response) {
      if (error) {
        console.error(error);
      } else {
        var games = JSON.parse(response);
        console.log(games);
      }
    }
  );
}
