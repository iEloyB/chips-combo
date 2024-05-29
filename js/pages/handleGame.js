import { readGameById, updateGame } from "../classes/Game_1v1PvP.js";
import {
  createObstacle,
  readObstacleById,
  updateObstacle,
  readGameObstacles,
  deleteObstacle,
} from "../classes/Obstacle.js";

import { readColors } from "../classes/Color.js";
var MAX_Y = 85;
let GAME_STATUS = "";

export class HandleGame {
  constructor(gameID) {
    this.gameID = gameID;

    this.checkGameStatus();
  }

  async checkGameStatus() {
    const game = await readGameById(this.gameID);

    switch (game.ga_status) {
      case "starting":
        await this.start();
        break;
      case "active":
        await this.handleActiveGame();
        await this.handleStatus();
        break;
      case "paused":
        await this.handleStatus();
        break;
      case "closing":
        this.end();
        break;
      default:
        break;
    }
  }

  async setStatus(status) {
    const game = await readGameById(this.gameID);
    await updateGame(
      game.ga_id,
      status,
      game.ga_queueId,
      parseInt(game.player1Id),
      parseInt(game.player2Id),
      game.player1points,
      game.player2points,
      game.winnerId,
      game.round
    );
  }

  async setWinner(winnerId) {
    const game = await readGameById(this.gameID);
    await updateGame(
      game.ga_id,
      game.ga_status,
      game.ga_queueId,
      parseInt(game.player1Id),
      parseInt(game.player2Id),
      game.player1points,
      game.player2points,
      winnerId,
      game.round
    );
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
        ? parseInt(game.player1points) - 50
        : game.player1points,
      parseInt(game.player2Id) == playerId
        ? parseInt(game.player2points) - 50
        : game.player2points,
      game.winnerId,
      game.round
    );
  }

  async rewardPlayer(playerId) {
    const game = await readGameById(this.gameID);

    await updateGame(
      game.ga_id,
      game.ga_status,
      game.ga_queueId,
      parseInt(game.player1Id),
      parseInt(game.player2Id),
      parseInt(game.player1Id) == playerId
        ? parseInt(game.player1points) + 100
        : game.player1points,
      parseInt(game.player2Id) == playerId
        ? parseInt(game.player2points) + 100
        : game.player2points,
      game.winnerId,
      game.round
    );
  }

  async setObstacleY(obstacleId, y) {
    let obs = await readObstacleById(obstacleId);
    obs = obs[0];
    await updateObstacle(
      obs.ob_id,
      obs.ob_gameId,
      obs.ob_x,
      y,
      obs.ob_colorsRemaining
    );
  }

  async setRound(round) {
    const game = await readGameById(this.gameID);
    await updateGame(
      game.ga_id,
      game.ga_status,
      game.ga_queueId,
      parseInt(game.player1Id),
      parseInt(game.player2Id),
      game.player1points,
      game.player2points,
      game.winnerId,
      round
    );
  }

  async handleActiveGame() {
    this.handleObstacles();
    this.handleRound();
    this.detectWinner();

    setInterval(() => {
      this.detectObstacles();
    }, 1000);

    setInterval(() => {
      this.detectWinner();
    }, 1000);
  }

  async handleStatus() {
    setInterval(async () => {
      const game = await readGameById(this.gameID);

      if (GAME_STATUS == "paused" && game.ga_status == "active") {
        window.location.reload();
      }

      if (GAME_STATUS == "active" && game.ga_status == "paused") {
        window.location.reload();
      }

      if (GAME_STATUS == "active" && game.ga_status == "closing") {
        window.location.reload();
      }

      GAME_STATUS = game.ga_status;
    }, 1000);
  }

  async detectWinner() {
    const game = await readGameById(this.gameID);

    if (GAME_STATUS == "paused") return;
    if (GAME_STATUS == "closing") return;

    if (parseInt(game.player1points) >= 2000) {
      await this.winGame(game.player1Id);
      return;
    }

    if (parseInt(game.player2points) >= 2000) {
      await this.winGame(game.player2Id);
      return;
    }
  }

  async winGame(winnerId) {
    await this.setWinner(winnerId);
    await this.setStatus("closing");

    setTimeout(async () => {
      await this.setStatus("closed");
    }, 5000);
  }

  async detectObstacles() {
    const game = await readGameById(this.gameID);
    if (GAME_STATUS == "paused") return;
    if (GAME_STATUS == "closing") return;

    const obstacles = await readGameObstacles(this.gameID);
    if (obstacles.length == 0) {
      await this.createNewObstacle(game.player1Id);
      await this.createNewObstacle(game.player2Id);
    }

    if (obstacles.length == 1) {
      const player1Id = game.player1Id;
      const player2Id = game.player2Id;
      if (obstacles[0].ob_playerSelectorId == player1Id) {
        await this.createNewObstacle(game.player2Id);
        return;
      }

      if (obstacles[0].ob_playerSelectorId == player2Id) {
        await this.createNewObstacle(game.player1Id);
        return;
      }
    }

    let player1Obstacles = 0;
    let player2Obstacles = 0;
    if (obstacles.length > 2) {
      obstacles.forEach((obstacle) => {
        if (obstacle.ob_playerSelectorId == game.player1Id) {
          player1Obstacles++;
        }

        if (obstacle.ob_playerSelectorId == game.player2Id) {
          player2Obstacles++;
        }
      });
    }

    if (player1Obstacles > 1) {
      obstacles.forEach((obstacle) => {
        if (obstacle.ob_playerSelectorId == game.player1Id) {
          this.removeAnObstacle(obstacle.ob_id);
        }
      });
    }

    if (player2Obstacles > 1) {
      obstacles.forEach((obstacle) => {
        if (obstacle.ob_playerSelectorId == game.player2Id) {
          this.removeAnObstacle(obstacle.ob_id);
        }
      });
    }
  }

  async handleObstacles() {
    const obstacles = await readGameObstacles(this.gameID);
    const game = await readGameById(this.gameID);
    if (GAME_STATUS == "paused") return;
    if (GAME_STATUS == "closing") return;

    if (obstacles.length == 0) {
      this.createNewObstacle(game.player1Id);
      this.createNewObstacle(game.player2Id);
    } else {
      obstacles.forEach((obstacle) => {
        if (parseInt(obstacle.ob_y) >= MAX_Y) {
          const playerId = obstacle.ob_playerSelectorId;
          this.removeAnObstacle(obstacle.ob_id);
          this.punishPlayer(obstacle.ob_playerSelectorId);
          this.createNewObstacle(playerId);
        } else {
          this.handleObstacle(obstacle);
        }
      });
    }
  }

  async start() {
    await this.setStatus("active");
    await this.setRound(1);
    this.handleActiveGame();
  }

  async pause() {
    this.setStatus("paused");
  }

  async resume() {
    this.setStatus("active");
  }

  async end() {
    await this.setStatus("closing");
    GAME_STATUS = "closing";

    setTimeout(async () => {
      await this.setStatus("closed");
    }, 5000);
  }

  async handleObstacle(obstacle) {
    if (!obstacle) {
      console.log("Obstacle not found.");
      return;
    }

    if (GAME_STATUS == "paused") return;
    if (GAME_STATUS == "closing") return;

    const { ob_id, ob_playerSelectorId } = obstacle;

    const incrementY = async () => {
      const updatedObstacle = await readObstacleById(ob_id);

      let newY = null;
      let newColorsRemaining = null;

      try {
        newY = parseInt(updatedObstacle[0].ob_y) + 1;
        newColorsRemaining = updatedObstacle[0].ob_colorsRemaining;
      } catch (e) {
        return;
      }

      await this.setObstacleY(ob_id, newY);

      if (newY >= MAX_Y) {
        this.removeAnObstacle(ob_id);
        this.punishPlayer(ob_playerSelectorId);
        this.createNewObstacle(ob_playerSelectorId);
        return;
      }

      if (newColorsRemaining == "") {
        this.removeAnObstacle(ob_id);
        this.rewardPlayer(ob_playerSelectorId);
        this.createNewObstacle(ob_playerSelectorId);
      }

      setTimeout(incrementY, 10);
    };

    await incrementY();
  }

  getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  async getRandomColors(numberOfColors) {
    const allColors = await readColors();

    const colors = [];
    for (let i = 0; i < numberOfColors; i++) {
      colors.push(this.getRandomElement(allColors).co_hexadecimalColor);
    }

    return colors.join(",");
  }

  async createNewObstacle(playerId) {
    let randomX = Math.floor(Math.random() * 91);

    const game = await readGameById(this.gameID);

    let colorsToGenerate = 3;
    if (game.round >= 5) {
      colorsToGenerate = 4;
    }

    if (game.round >= 15) {
      colorsToGenerate = 5;
    }

    if (game.round >= 25) {
      colorsToGenerate = 6;
    }

    const objectColors = await this.getRandomColors(colorsToGenerate);

    await createObstacle(this.gameID, randomX, -10, playerId, objectColors);

    const obstacles = await readGameObstacles(this.gameID);

    for (let obstacle of obstacles) {
      if (obstacle.ob_playerSelectorId == playerId) {
        await this.handleObstacle(obstacle);
        //console.log("Objeto " + obstacle.ob_id + " creado");
        return;
      }
    }
  }

  async removeAnObstacle(obstacleId) {
    const obs = await deleteObstacle(obstacleId);
    //console.log("Objeto " + obstacleId + " eliminado");
  }

  async handleRound() {
    setInterval(async () => {
      const game = await readGameById(this.gameID);
      if (GAME_STATUS == "paused") return;
      if (GAME_STATUS == "closing") return;

      this.setRound(parseInt(game.round) + 1);
    }, 10000);
  }
}
