export class Color {
  #id;
  #hexColor;

  constructor() {}
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

export function createColor(hexColor) {
  const data = "operation=create&hexColor=" + encodeURIComponent(hexColor);
  makeRequest(
    "POST",
    "./sql/cruds/Color.php",
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

export function updateColor(id, newHexColor) {
  const data =
    "operation=update&id=" +
    encodeURIComponent(id) +
    "&newHexColor=" +
    encodeURIComponent(newHexColor);
  makeRequest(
    "POST",
    "./sql/cruds/Color.php",
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

export function deleteColor(id) {
  const data = "operation=delete&id=" + encodeURIComponent(id);
  makeRequest(
    "POST",
    "./sql/cruds/Color.php",
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

export function readColorById(id) {
  makeRequest(
    "GET",
    `./sql/cruds/Color.php?operation=read&id=${encodeURIComponent(id)}`,
    null,
    function (error, response) {
      if (error) {
        console.error(error);
      } else {
        var color = JSON.parse(response);
        console.log(color);
      }
    }
  );
}

export function readColors() {
  makeRequest(
    "GET",
    "./sql/cruds/Color.php?operation=read",
    null,
    function (error, response) {
      if (error) {
        console.error(error);
      } else {
        var colors = JSON.parse(response);
        console.log(colors);
      }
    }
  );
}
