export class Obstacle {}

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

export function createObstacle(gameId, x, y, colorsRemaining) {
  const data = `operation=create&gameId=${encodeURIComponent(
    gameId
  )}&x=${encodeURIComponent(x)}&y=${encodeURIComponent(
    y
  )}&colorsRemaining=${encodeURIComponent(colorsRemaining)}`;
  makeRequest(
    "POST",
    "./sql/cruds/Obstacle.php",
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

export function updateObstacle(id, gameId, x, y, colorsRemaining) {
  const data = `operation=update&id=${encodeURIComponent(
    id
  )}&gameId=${encodeURIComponent(gameId)}&x=${encodeURIComponent(
    x
  )}&y=${encodeURIComponent(y)}&colorsRemaining=${encodeURIComponent(
    colorsRemaining
  )}`;
  makeRequest(
    "POST",
    "./sql/cruds/Obstacle.php",
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

export function deleteObstacle(id) {
  const data = `operation=delete&id=${encodeURIComponent(id)}`;
  makeRequest(
    "POST",
    "./sql/cruds/Obstacle.php",
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

export function readObstacleById(id) {
  makeRequest(
    "GET",
    `./sql/cruds/Obstacle.php?operation=readById&id=${encodeURIComponent(id)}`,
    null,
    function (error, response) {
      if (error) {
        console.error(error);
      } else {
        var obstacle = JSON.parse(response);
        console.log(obstacle);
      }
    }
  );
}

export function readObstacles() {
  makeRequest(
    "GET",
    "./sql/cruds/Obstacle.php?operation=read",
    null,
    function (error, response) {
      if (error) {
        console.error(error);
      } else {
        var obstacles = JSON.parse(response);
        console.log(obstacles);
      }
    }
  );
}
