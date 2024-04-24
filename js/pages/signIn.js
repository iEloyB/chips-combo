const error_message = document.querySelector("p");
const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  try {
    const response = await fetch("./sql/session/handleSignIn.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `email=${email}&password=${password}`,
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

import {
  createSession,
  readSessionById,
  readSessions,
  updateSession,
} from "../classes/Session.js";
import { readPlayers } from "../classes/Player.js";

async function startSession(email) {
  try {
    const playerId = await getPlayerIdByEmail(email);
    const sessions = await readSessions();
    const existingSession = findSessionByPlayerId(sessions, playerId);

    if (!existingSession) {
      await createNewSession(playerId);
      window.location.href = "./index.php";
    } else {
      await updateExistingSession(playerId);
      window.location.href = "./index.php";
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function findSessionByPlayerId(sessions, playerId) {
  return sessions.find((session) => session.se_playerId === playerId);
}

async function createNewSession(playerId) {
  try {
    const sessionResponse = await createSession(playerId, "online");
    const session = await readSessionById(sessionResponse.session.se_playerId);
    createSessionCookie(session.se_token);
  } catch (error) {
    console.error("Error creating new session:", error);
  }
}

async function updateExistingSession(playerId) {
  try {
    const sessionResponse = await updateSession(playerId, "online");
    const session = await readSessionById(sessionResponse.player_id);
    createSessionCookie(session.se_token);

    console.log(session);
  } catch (error) {
    console.error("Error updating existing session:", error);
  }
}

function getPlayerIdByEmail(email) {
  return new Promise((resolve, reject) => {
    readPlayers()
      .then((players) => {
        const player = players.find((player) => player.pl_email === email);
        resolve(player ? player.pl_id : null);
      })
      .catch((error) => reject(error));
  });
}

function createSessionCookie(token) {
  document.cookie = `sessionToken=${token}; path=/`;
}
