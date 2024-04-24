export class Player {
  #id;
  #team;
  #points = 0;

  addpoints(points) {
    this.#points = this.#points + points;
  }
}

function makeRequest(method, url, data) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
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

export function createPlayer(name, tag, iconId, xp, coins, email, password) {
  const data = `operation=create&name=${encodeURIComponent(
    name
  )}&tag=${encodeURIComponent(tag)}&iconId=${encodeURIComponent(
    iconId
  )}&xp=${encodeURIComponent(xp)}&coins=${encodeURIComponent(
    coins
  )}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(
    password
  )}`;
  return makeRequest("POST", "./sql/cruds/Player.php", data);
}

export function updatePlayer(id, name, tag, iconId, xp, coins, email) {
  const data = `operation=update&id=${encodeURIComponent(
    id
  )}&name=${encodeURIComponent(name)}&tag=${encodeURIComponent(
    tag
  )}&iconId=${encodeURIComponent(iconId)}&xp=${encodeURIComponent(
    xp
  )}&coins=${encodeURIComponent(coins)}&email=${encodeURIComponent(email)}`;
  return makeRequest("POST", "./sql/cruds/Player.php", data);
}

export function deletePlayer(id) {
  const data = `operation=delete&id=${encodeURIComponent(id)}`;
  return makeRequest("POST", "./sql/cruds/Player.php", data);
}

export async function readPlayerById(id) {
  const response = await makeRequest(
    "GET",
    `./sql/cruds/Player.php?operation=readById&id=${encodeURIComponent(id)}`
  );
  return JSON.parse(response);
}

export async function readPlayers() {
  const response = await makeRequest("GET", "./sql/cruds/Player.php?operation=read");
  return JSON.parse(response);
}
