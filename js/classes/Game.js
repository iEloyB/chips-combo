class Game {
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

export function createGame(status, queueId) {
  const data = `operation=create&status=${encodeURIComponent(
    status
  )}&queueId=${encodeURIComponent(queueId)}`;
  makeRequest("POST", "./sql/cruds/Game.php", data, function (error, response) {
    if (error) {
      console.error(error);
    } else {
      console.log(response);
    }
  });
}

export function updateGame(id, status, queueId) {
  const data = `operation=update&id=${encodeURIComponent(
    id
  )}&status=${encodeURIComponent(status)}&queueId=${encodeURIComponent(
    queueId
  )}`;
  makeRequest("POST", "./sql/cruds/Game.php", data, function (error, response) {
    if (error) {
      console.error(error);
    } else {
      console.log(response);
    }
  });
}

export function deleteGame(id) {
  const data = `operation=delete&id=${encodeURIComponent(id)}`;
  makeRequest("POST", "./sql/cruds/Game.php", data, function (error, response) {
    if (error) {
      console.error(error);
    } else {
      console.log(response);
    }
  });
}

export function readGameById(id) {
  makeRequest(
    "GET",
    `./sql/cruds/Game.php?operation=readById&id=${encodeURIComponent(id)}`,
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
    "./sql/cruds/Game.php?operation=read",
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
