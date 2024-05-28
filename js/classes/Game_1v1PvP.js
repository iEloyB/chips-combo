class Game_1v1PvP {
  #players;
  #board;
  #status; //PRE_GAME, IN_GAME, ENDING

  start() {}

  stop() {}

  setWinner(winnerId) {}
}
// Función para realizar una solicitud HTTP utilizando XMLHttpRequest
function makeRequest(method, url, data) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject("Error en la solicitud: " + xhr.status);
        }
      }
    };

    xhr.open(method, url, true);

    if (method === "POST") {
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }

    xhr.send(data);
  });
}

// Función para crear un nuevo juego
export async function createGame(
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

  const response = await makeRequest(
    "POST",
    "./sql/cruds/Game_1v1PvP.php",
    data
  );

  return response;
}

export async function updateGame(
  id,
  status,
  queueId,
  player1Id,
  player2Id,
  player1points,
  player2points,
  winnerId,
  round
) {
  const data = `operation=update&id=${encodeURIComponent(
    id
  )}&status=${encodeURIComponent(status)}&queueId=${encodeURIComponent(
    queueId
  )}&player1Id=${encodeURIComponent(player1Id)}&player2Id=${encodeURIComponent(
    player2Id
  )}&player1points=${encodeURIComponent(
    player1points
  )}&player2points=${encodeURIComponent(
    player2points
  )}&winnerId=${encodeURIComponent(winnerId)}&round=${encodeURIComponent(
    round
  )}`;

  const response = await makeRequest(
    "POST",
    "./sql/cruds/Game_1v1PvP.php",
    data
  );

  return response;
}

// Función para eliminar un juego
export async function deleteGame(id) {
  const data = `operation=delete&id=${encodeURIComponent(id)}`;

  const response = await makeRequest(
    "POST",
    "./sql/cruds/Game_1v1PvP.php",
    data
  );

  return response;
}

// Función para leer un juego por su ID
export async function readGameById(id) {
  const url = `./sql/cruds/Game_1v1PvP.php?operation=readById&id=${encodeURIComponent(
    id
  )}`;

  const response = await makeRequest("GET", url);

  return response;
}

// Función para leer todos los juegos
export async function readGames() {
  const url = "./sql/cruds/Game_1v1PvP.php?operation=read";

  const response = await makeRequest("GET", url);

  return response;
}
