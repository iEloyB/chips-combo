import { readGameById, updateGame } from "../classes/Game_1v1PvP.js";
import {
  createObstacle,
  readObstacleById,
  updateObstacle,
  readGameObstacles,
} from "../classes/Obstacle.js";
import { readColors } from "../classes/Color.js";
import { readPlayerById } from "../classes/Player.js";

export class HandleGameUI {
  constructor(gameID, playerID) {
    this.gameID = gameID;
    this.playerID = playerID;

    this.checkGameStatus();
    this.renderScores();
    this.renderBoard();
    this.render();
  }

  render() {
    setInterval(() => {
      this.renderRound();
    }, 1000);

    setInterval(() => {
      this.renderScores();
    }, 2000);

    setInterval(() => {
      this.renderBoard();
    }, 100);

    setInterval(() => {
      this.checkGameStatus();
    }, 1000);

    this.renderColors();
  }

  async checkGameStatus() {
    const game = await readGameById(this.gameID);
    const winner = await readPlayerById(game.winnerId);
    const mainElement = document.querySelector("main");

    const PAUSE_CONTENT = document.createElement("div");
    PAUSE_CONTENT.classList.add("paused");
    const PAUSE_CONTENT_TEXT = document.createElement("h1");
    PAUSE_CONTENT_TEXT.textContent = "Game is paused!";
    PAUSE_CONTENT.appendChild(PAUSE_CONTENT_TEXT);

    const ENDING_CONTENT = document.createElement("div");
    ENDING_CONTENT.classList.add("closing");
    const ENDING_CONTENT_TEXT = document.createElement("h1");
    ENDING_CONTENT_TEXT.textContent = "The winner is " + winner.pl_name + "!";
    ENDING_CONTENT.appendChild(ENDING_CONTENT_TEXT);

    const pausedElements = mainElement.querySelectorAll(".paused");
    const endingElements = mainElement.querySelectorAll(".closing");
    pausedElements.forEach((element) => element.remove());
    endingElements.forEach((element) => element.remove());

    if (game.ga_status == "closed") {
      window.location.href = "./index.php";
    }

    if (game.ga_status == "paused") {
      mainElement.appendChild(PAUSE_CONTENT);
      return;
    }

    if (game.ga_status == "closing") {
      mainElement.appendChild(ENDING_CONTENT);
      return;
    }
  }

  async renderRound() {
    const game = await readGameById(this.gameID);
    document.querySelector(
      ".roundContainer h1"
    ).textContent = `Round: ${game.round}`;
  }

  async renderBoard() {
    const game = await readGameById(this.gameID);
    const obstacles = await readGameObstacles(this.gameID);
    const board = document.querySelector(".board");

    board.innerHTML = "";

    if (obstacles == []) {
      //idk
      return;
    }

    obstacles.forEach((obstacle) => {
      const obstacleDiv = document.createElement("div");

      const obstacleColors = document.createElement("div");
      obstacleColors.classList.add("obstacleColors");

      for (const color of obstacle.ob_colorsRemaining.split(",")) {
        const obstacleColor = document.createElement("div");
        obstacleColor.classList.add("obstacleColor");
        obstacleColor.style.backgroundColor = `#${color}`;

        obstacleColors.appendChild(obstacleColor);
      }

      obstacleDiv.classList.add("obstacle");
      if (game.player1Id == obstacle.ob_playerSelectorId) {
        obstacleDiv.classList.add("player1");
      } else {
        obstacleDiv.classList.add("player2");
      }

      obstacleDiv.style.top = `${obstacle.ob_y}%`;
      obstacleDiv.style.left = `${obstacle.ob_x}%`;

      obstacleDiv.appendChild(obstacleColors);
      board.appendChild(obstacleDiv);
    });
  }

  async renderColors() {
    const colorsContainer = document.querySelector(".colorsContainer");

    colorsContainer.innerHTML = "";

    const gameColors = await readColors();

    for (let color of gameColors) {
      const colorDiv = document.createElement("div");
      colorDiv.style.backgroundColor = `#${color.co_hexadecimalColor}`;

      colorDiv.addEventListener("click", () => {
        this.handleColorCorrect(color.co_hexadecimalColor);
      });

      colorsContainer.appendChild(colorDiv);
    }
  }

  async renderScores() {
    const game = await readGameById(this.gameID);

    let player1Winner =
      parseInt(game.player1points) > parseInt(game.player2points);

    if (parseInt(game.player1points) == parseInt(game.player2points))
      player1Winner = "equal";

    const player1 = document.querySelector(".scoreboard > .player1");
    const player1Score = document.createElement("p");
    player1Score.textContent = `Score: ${game.player1points || 0}`;
    player1.innerHTML = "";
    player1.appendChild(player1Score);

    const player2 = document.querySelector(".scoreboard > .player2");
    const player2Score = document.createElement("p");
    player2Score.textContent = `Score: ${game.player2points || 0}`;
    player2.innerHTML = "";
    player2.appendChild(player2Score);

    const winner = document.createElement("div");
    winner.classList.add("winner");
    if (player1Winner === "equal") return;
    else if (player1Winner) player1.appendChild(winner);
    else if (!player1Winner) player2.appendChild(winner);
  }

  async handleColorCorrect(color) {
    const colorInfo = await this.isColorCorrect(color);
    if (colorInfo == undefined || colorInfo == null) return;
    if (colorInfo.colorCorrect) {
      this.removeObstacleColor(parseInt(colorInfo.obstacleId));
    } else {
      this.punishPlayer(this.playerID);
    }
  }

  async punishPlayer(playerId) {
    const game = await readGameById(this.gameID);
    await updateGame(
      game.ga_id,
      game.ga_status,
      game.ga_queueId,
      parseInt(game.player1Id),
      parseInt(game.player2Id),
      parseInt(game.player1Id) == playerId
        ? parseInt(game.player1points) - 10
        : game.player1points,
      parseInt(game.player2Id) == playerId
        ? parseInt(game.player2points) - 10
        : game.player2points,
      game.winnerId,
      game.round
    );
  }

  async removeObstacleColor(obstacleId) {
    let obs = await readObstacleById(obstacleId);

    const obsNewColors = obs[0].ob_colorsRemaining.split(",");
    obsNewColors.shift();
    obsNewColors.join(",");

    await updateObstacle(
      obs[0].ob_id,
      obs[0].ob_gameId,
      obs[0].ob_x,
      obs[0].ob_y,
      obsNewColors
    );
  }

  async isColorCorrect(color) {
    const obstacles = await readGameObstacles(this.gameID);
    let colorInfo;
    obstacles.forEach((obstacle) => {
      if (obstacle.ob_playerSelectorId == this.playerID) {
        const obstacleColor = obstacle.ob_colorsRemaining.split(",")[0];

        colorInfo = {
          colorCorrect: obstacleColor == color,
          obstacleId: obstacle.ob_id,
        };
      }
    });
    return colorInfo;
  }
}
