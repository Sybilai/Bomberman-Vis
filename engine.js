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
  flames: [],

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
    Engine.updateFlames();
    ++GameRules.currentFrame;
    Draw.update();
    setTimeout(Engine.update, 1000/GameRules.framesPerSecond);
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

  updateBombs: function() {
    for (var i = 0; i < Engine.bombs.length; ++i) {
      var bomb = Engine.bombs[i];

      if ( bomb.direction != "none" ) {
        var now = GameRules.currentFrame;
        if ( (now-bomb.lastUpdate) > GameRules.bombSpeed ) {
          moveThis( bomb );
          bomb.lastUpdate = now;
        }
      }

      if (GameRules.currentFrame - bomb.spawnFrame  >= GameRules.bombLife) {
        bomb.burn();
        --i;
        continue;
      }
      
    }
  },

  updateFlames: function() {
    for (var i = 0; i < Engine.flames.length; ++i) {
      var flame = Engine.flames[i];
      var ct = Engine.matrices[flame.pos.x][flame.pos.y].content;
      for (var j = 0; j < ct.length; ++j) {
        if (!(ct[j].isBlocking === true)) {
          if (ct[j].burn) {
            ct[j].burn();
          }
        }
      }

      if (GameRules.currentFrame - flame.spawnFrame >= GameRules.flameLife) {
        spliceContent(flame);
        Engine.flames.splice(i, 1);
        --i;
      }
    }
  }
}

function spliceContent(x) {
  Engine.matrices[x.pos.x][x.pos.y].content.splice(
    Engine.matrices[x.pos.x][x.pos.y].content.indexOf(x)
  , 1);
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

function Player(_x, _y) {
  this.isBlocking = false;
  this.type = "player";
  this.pos = {
    x: _x,
    y: _y,
    c: Engine.matrices[_x][_y].content.push(this)-1
  };
  this.name = "Barman";
  this.lastUpdate = 0;
  this.direction = "none";
  Engine.players.push(this);
}
Player.prototype.burn =
function() {
  console.log("Player", this.name, "is dead!!!");
  spliceContent(this);
  Engine.players.splice(
    Engine.players.indexOf(this)
  , 1);
};


function Bomb(_x, _y) {
  this.isBlocking = "mov";
  this.type = "bomb";
  this.pos = {
    x: _x,
    y: _y,
    c: Engine.matrices[_x][_y].content.push(this)-1
  };
  this.range = GameRules.basicBombRange;
  this.spawnFrame = GameRules.currentFrame;
  this.lastUpdate = 0;
  this.direction = "none";

  Engine.bombs.push(this);
}
Bomb.prototype.explode =
function() {
  var bomb = this;

  new Flame(bomb.pos);

  // left
  function flame(key) {
    for (var i = 1; i <= bomb.range; ++i) {
      var new_pos = {};
      new_pos.x = bomb.pos.x + Engine.dir[key].x * i;
      new_pos.y = bomb.pos.y + Engine.dir[key].y * i;
      if (Engine.matrices[new_pos.x][new_pos.y].isBlocked() === true) {
        break;
      }
      new Flame(new_pos);
    }
  };

  flame("left");
  flame("up");
  flame("down");
  flame("right");
};

Bomb.prototype.burn =
function() {
  spliceContent(this);
  this.explode();
  Engine.bombs.splice(
    Engine.bombs.indexOf(this)
  , 1);
};

function Flame(pos) {
  this.isBlocking = false;
  this.type = "flame";
  this.pos = {
    x: pos.x,
    y: pos.y,
    c: Engine.matrices[pos.x][pos.y].content.push(this)-1
  };
  Engine.flames.push(this);
  this.spawnFrame = GameRules.currentFrame;
}
