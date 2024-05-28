export class Color {
  #id;
  #hexColor;

  constructor(id, hexColor) {
    this.#id = id;
    this.#hexColor = hexColor;
  }

  getId() {
    return this.#id;
  }

  getHexColor() {
    return this.#hexColor;
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

export async function createColor(hexColor) {
  const data = "operation=create&hexColor=" + encodeURIComponent(hexColor);
  try {
    const response = await makeRequest("POST", "./sql/cruds/Color.php", data);
    return JSON.parse(response);
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateColor(id, newHexColor) {
  const data =
    "operation=update&id=" +
    encodeURIComponent(id) +
    "&newHexColor=" +
    encodeURIComponent(newHexColor);
  try {
    const response = await makeRequest("POST", "./sql/cruds/Color.php", data);
    return JSON.parse(response);
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteColor(id) {
  const data = "operation=delete&id=" + encodeURIComponent(id);
  try {
    const response = await makeRequest("POST", "./sql/cruds/Color.php", data);
    return JSON.parse(response);
  } catch (error) {
    throw new Error(error);
  }
}

export async function readColorById(id) {
  try {
    const response = await makeRequest(
      "GET",
      `./sql/cruds/Color.php?operation=read&id=${encodeURIComponent(id)}`,
      null
    );
    return JSON.parse(response);
  } catch (error) {
    throw new Error(error);
  }
}

export async function readColors() {
  try {
    const response = await makeRequest(
      "GET",
      "./sql/cruds/Color.php?operation=read",
      null
    );
    return JSON.parse(response);
  } catch (error) {
    throw new Error(error);
  }
}
