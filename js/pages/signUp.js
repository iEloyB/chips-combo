const error_message = document.querySelector("p");
const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.querySelector("#name").value;
  const tag = document.querySelector("#tag").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  try {
    const response = await fetch("./sql/session/handleSignUp.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `name=${name}&tag=${tag}&email=${email}&password=${password}`,
    });

    const data = await response.json();

    if (data.error) {
      error_message.textContent = data.error;
    } else if (data.success) {
      startSession(email);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

import { createSession, readSessionById } from "../classes/Session.js";
import { readPlayers } from "../classes/Player.js";

function startSession(email) {
  getPlayerIdByEmail(email).then((playerId) => {
    createSession(playerId, "online").then((sessionResponse) => {
      readSessionById(sessionResponse.session.se_playerId).then((session) => {
        createSessionCookie(session.se_token);
        window.location.href = "./index.php";
      });
    });
  });
}

function getPlayerIdByEmail(email) {
  return new Promise((resolve, reject) => {
    readPlayers()
      .then((players) => {
        for (let player of players) {
          if (player.pl_email === email) {
            resolve(player.pl_id);
            return;
          }
        }
        resolve(null);
      })
      .catch((error) => reject(error));
  });
}

function createSessionCookie(token) {
  document.cookie = `sessionToken=${token}; path=/`;
}
