var Engine = {
  matrices: undefined,

  dir: {
    "left": {x: -1, y: 0},
    "right": {x: 1, y: 0},
    "up": {x: 0, y: -1},
    "down": {x: 0, y: 1}
  },

  players: [],
  bombs: [],

  initMatrices: function(N, M) {
    Engine.matrices = [];

    for (var i = 0; i < N; ++i) {
      Engine.matrices[i] = [];
      for (var j = 0; j < M; ++j) {
        Engine.matrices[i][j] = new Block();
      }
    }

    var fixBlock = {
      type: "fixblock",
      isBlocking: true
    }

    // border
    for (var i = 0; i < N; ++i) {
      Engine.matrices[i][M-1].content =
        Engine.matrices[i][0].content = [fixBlock];
    }
    for (var i = 0; i < M; ++i) {
      Engine.matrices[0][i].content =
        Engine.matrices[N-1][i].content = [fixBlock];
    }

  },

  update: function () {
    Engine.updatePlayers();
    Engine.updateBombs();
    ++GameRules.currentFrame;
    Draw.update();
    setTimeout(Engine.update, 1000/GameRules.framesPerSecond);
  },

  addPlayer: function() {
    var player = new Player();
    player.pos.c = Engine.matrices[ player.pos.x ][ player.pos.y ].content.push(player) - 1;
    Engine.players.push(player);
  },

  updatePlayers: function() {
    for (var i = 0, _ilen = Engine.players.length; i < _ilen; ++i) {
      var player = Engine.players[i];

      if (player.direction != "none") {
        var now = GameRules.currentFrame;
        if (now - player.lastUpdate > GameRules.playerSpeed) {
          moveThis( player );
          player.lastUpdate = now;
        }
      }
    }
  },

  addBomb: function() {
    var bomb = new Bomb();
    bomb.pos.c = Engine.matrices[ bomb.pos.x ][ bomb.pos.y ].content.push(bomb) - 1;
    Engine.bombs.push(bomb);
  },

  updateBombs: function() {
    for (var i = 0, _ilen = Engine.bombs.length; i < _ilen; ++i) {
      var bomb = Engine.bombs[i];

      if (GameRules.currentFrame - bomb.spawnFrame  >= GameRules.bombLife) {
        spliceContent(bomb);
        Engine.bombs.splice(i, 0);
        --i, --_ilen;
        continue;
      }
      
      if ( bomb.direction != "none" ) {
        var now = GameRules.currentFrame;
        if ( (now-bomb.lastUpdate) > GameRules.bombSpeed ) {
          moveThis( bomb );
          bomb.lastUpdate = now;
        }
      }
    }
  },

}

function spliceContent(x) {
  Engine.matrices[x.pos.x][x.pos.y].content.splice(x.pos.c, 1);
}

function moveThis( aux ) {
  var new_pos = {};
  new_pos.x = aux.pos.x + Engine.dir[ aux.direction ].x;
  new_pos.y = aux.pos.y + Engine.dir[ aux.direction ].y;

  if (Engine.matrices[new_pos.x][new_pos.y].isBlocked()) {
    aux.direction = "none";
  } else {
    spliceContent(aux);
    aux.pos.x = new_pos.x;
    aux.pos.y = new_pos.y;
    aux.pos.c = Engine.matrices[new_pos.x][new_pos.y].content.push(aux) - 1;
  }
}

function Block() {
  this.content = [];
}

Block.prototype.isBlocked =
function() {
  for (var i = 0, _ilen = this.content.length; i < _ilen; ++i) {
    if (this.content[i].isBlocking === true) {
      return true;
    } else if (this.content[i].isBlocking === "mov") {
      return "mov";
    }
  }
  return false;
};

function Player() {
  this.isBlocking = false;
  this.type = "player";
  this.pos = {
    x: 1,
    y: 1,
    c: 0
  };
  this.name = "Barman";
  this.lastUpdate = 0;
  this.direction = "right";
}

function Bomb() {
  this.isBlocking = "mov";
  this.type = "bomb";
  this.pos = {
    x: 3,
    y: 2,
    c: 0
  };

  this.range = GameRules.basicBombRange;
  this.spawnFrame = GameRules.currentFrame;
  this.lastUpdate = 0;
  this.direction = "left";
}
