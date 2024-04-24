export class Queue {}

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

export function createQueue(status, type, playerId) {
  const data = `operation=create&status=${encodeURIComponent(
    status
  )}&type=${encodeURIComponent(type)}&playerId=${encodeURIComponent(playerId)}`;
  return makeRequest("POST", "./sql/cruds/Queue.php", data);
}

export function updateQueue(id, status, type) {
  const data = `operation=update&id=${encodeURIComponent(
    id
  )}&status=${encodeURIComponent(status)}&type=${encodeURIComponent(type)}`;
  return makeRequest("POST", "./sql/cruds/Queue.php", data);
}

export function deleteQueue(id) {
  const data = `operation=delete&id=${encodeURIComponent(id)}`;
  return makeRequest("POST", "./sql/cruds/Queue.php", data);
}

export function readQueueById(id) {
  return makeRequest(
    "GET",
    `./sql/cruds/Queue.php?operation=readById&id=${encodeURIComponent(id)}`
  );
}

export function readQueues() {
  return makeRequest("GET", "./sql/cruds/Queue.php?operation=read");
}
