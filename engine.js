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
    move( "players" );
  },

  updateBombs: function() {
    move( "bombs" );

    for (var i = 0; i < Engine.bombs.length; ++i) {
      var bomb = Engine.bombs[i];
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

function move( key ) {
  for (var i = 0, _ilen = Engine[key].length; i < _ilen; ++i) {
    var aux = Engine[key][i];

    if (aux.direction != "none") {
      var now = GameRules.currentFrame;
      if (now - aux.lastUpdate > GameRules.speed[key]) {
        moveThis( aux );
        aux.lastUpdate = now;
      }
    }
  }
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
    Engine.matrices[new_pos.x][new_pos.y].content.push(aux);
  }
}

