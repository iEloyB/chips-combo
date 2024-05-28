export class Obstacle {}

function makeRequest(method, url, data) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(new Error("Error en la solicitud: " + xhr.status));
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

export async function createObstacle(
  gameId,
  x,
  y,
  playerSelectorId,
  colorsRemaining
) {
  const data = `operation=create&gameId=${encodeURIComponent(
    gameId
  )}&x=${encodeURIComponent(x)}&y=${encodeURIComponent(
    y
  )}&playerSelectorId=${encodeURIComponent(
    playerSelectorId
  )}&colorsRemaining=${encodeURIComponent(colorsRemaining)}`;

  try {
    const response = await makeRequest(
      "POST",
      "./sql/cruds/Obstacle.php",
      data
    );
    return JSON.parse(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateObstacle(id, gameId, x, y, colorsRemaining) {
  const data = `operation=update&id=${encodeURIComponent(
    id
  )}&gameId=${encodeURIComponent(gameId)}&x=${encodeURIComponent(
    x
  )}&y=${encodeURIComponent(y)}&colorsRemaining=${encodeURIComponent(
    colorsRemaining
  )}`;

  try {
    const response = await makeRequest(
      "POST",
      "./sql/cruds/Obstacle.php",
      data
    );
    return JSON.parse(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteObstacle(id) {
  const data = `operation=delete&id=${encodeURIComponent(id)}`;

  try {
    const response = await makeRequest(
      "POST",
      "./sql/cruds/Obstacle.php",
      data
    );
    return JSON.parse(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function readObstacleById(id) {
  try {
    const response = await makeRequest(
      "GET",
      `./sql/cruds/Obstacle.php?operation=readById&id=${encodeURIComponent(id)}`
    );
    return JSON.parse(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function readGameObstacles(id) {
  try {
    const response = await makeRequest(
      "GET",
      `./sql/cruds/Obstacle.php?operation=readByGameId&id=${encodeURIComponent(
        id
      )}`
    );
    return JSON.parse(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function readObstacles() {
  try {
    const response = await makeRequest(
      "GET",
      "./sql/cruds/Obstacle.php?operation=read"
    );
    return JSON.parse(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
