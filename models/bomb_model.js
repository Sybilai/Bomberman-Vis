function Bomb(_x, _y) {
  this.isBlocking = "mov";
  this.mortal = true;
  this.type = "bomb";
  this.pos = {
    x: _x,
    y: _y
  };
  this.range = GameRules.basicBombRange;
  this.spawnFrame = GameRules.currentFrame;
  this.lastUpdate = 0;
  this.direction = "none";
  
  Engine.matrices[_x][_y].content.push(this)
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

