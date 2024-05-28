export class Session {}

function makeRequest(method, url, data) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
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

export function createSession(playerId, status) {
  const data = `operation=create&playerId=${encodeURIComponent(
    playerId
  )}&status=${encodeURIComponent(status)}`;
  return makeRequest("POST", "./sql/cruds/Session.php", data);
}

export function updateSession(playerId, status) {
  const data = `operation=update&id=${encodeURIComponent(
    playerId
  )}&status=${encodeURIComponent(status)}`;
  return makeRequest("POST", "./sql/cruds/Session.php", data);
}

export function deleteSession(id) {
  const data = `operation=delete&id=${encodeURIComponent(id)}`;
  return makeRequest("POST", "./sql/cruds/Session.php", data);
}

export async function readSessionById(id) {
  const response = await makeRequest(
    "GET",
    `./sql/cruds/Session.php?operation=readById&id=${encodeURIComponent(id)}`
  );
  return response;
}

export async function readSessions() {
  const response = await makeRequest(
    "GET",
    "./sql/cruds/Session.php?operation=read"
  );
  return response;
}
