import { createGame, readGames } from "../classes/Game_1v1PvP.js";
import { readSessions, updateSession } from "../classes/Session.js";
import { readPlayerById } from "../classes/Player.js";
import { HandleGame } from "./handleGame.js";
import { HandleGameUI } from "./handleGameUI.js";

var player;

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
        loadGame();
      });
    } else {
      window.location.href = "./signIn.php";
    }
  })
  .catch((error) => {
    console.error("Error al obtener la sesión:", error);
  });

async function loadGame() {
  try {
    const games = await readGames();

    let gameExists = false;
    games.forEach((game) => {
      if (game.ga_status != "closed") {
        if (game.player1Id == player.pl_id) {
          const currentGame = new HandleGame(game.ga_id);
          const currentGameUI = new HandleGameUI(game.ga_id, player.pl_id);
          gameExists = true;
        } else if (game.player2Id == player.pl_id) {
          const currentGameUI = new HandleGameUI(game.ga_id, player.pl_id);
          gameExists = true;
        }
      }
    });

    if (!gameExists) {
      window.location.href = "./play.php";
    }
  } catch (error) {
    console.error("Error al cargar los juegos:", error);
  }
}
