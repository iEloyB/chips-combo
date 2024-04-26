import {
  readQueues,
  createQueue,
  deleteQueue,
  readQueueById,
  updateQueue,
} from "../classes/Queue.js";
import { readSessions, updateSession } from "../classes/Session.js";
import { readPlayerById } from "../classes/Player.js";
import { createGame } from "../classes/Game_1v1PvP.js";

async function getSession() {
  const sessions = await readSessions();
  const token = getSessionToken();
  for (let session of sessions) {
    if (session.se_token === token) {
      return session;
    }
  }
  return null;
}

function getSessionToken() {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "sessionToken") {
      return value;
    }
  }
  return null;
}

getSession()
  .then((session) => {
    if (session) {
      readPlayerById(session.se_playerId).then((playerSession) => {
        player = playerSession;
      });
    } else {
      window.location.href = "./signIn.php";
    }
  })
  .catch((error) => {
    console.error("Error al obtener la sesión:", error);
  });

const playButton = document.querySelector(".play");
let isInQueue = false;
let player;
let queueCheckInterval;
let playerQueue;
const selectElement = document.getElementById("modes");
const mode1v1Selected = selectElement.querySelector('option[value="1v1"]');

playButton.addEventListener("click", () => {
  if (!mode1v1Selected.selected) return;

  isInQueue = !isInQueue;
  renderQueueButton();

  if (isInQueue) {
    startQueue();
    renderQueueStatus("Waiting for other players... (1/2)");
    queueCheckInterval = setInterval(foundPlayers1v1PvP, 1000);
  } else {
    stopQueue();
    renderQueueStatus("");
    clearInterval(queueCheckInterval);
  }
});

function renderQueueButton() {
  if (isInQueue) {
    playButton.textContent = "In queue";
  } else {
    playButton.textContent = "Play";
  }
}

function renderQueueStatus(message) {
  const queueStatus = document.querySelector(".queueStatus");
  queueStatus.textContent = message;
}

function foundPlayers1v1PvP() {
  readQueues().then((queuesList) => {
    if (queuesList == "[]") {
      return false;
    } else {
      const queues = JSON.parse(queuesList);

      for (let queue of queues) {
        if (queue.qu_playerId !== player.pl_id) {
          renderQueueStatus("Waiting for other players... (2/2)");
          clearInterval(queueCheckInterval);
          startGame();
          return true;
        } else {
          playerQueue = queue;
        }
      }
    }
  });
}

function startQueue() {
  console.log(player);
  createQueue("waiting", "1v1pvp", player.pl_id);
}

function stopQueue() {
  deleteQueue(player.pl_id);
}

function startGame() {
  //updateQueue(playerQueue.qu_id, "ingame", "1v1pvp");
  updateSession(player.pl_id, "ingame");
}
