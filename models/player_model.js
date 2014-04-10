function Player(_x, _y) {
  this.isBlocking = false;
  this.mortal = true;
  this.type = "player";

  this.pos = {
    x: _x,
    y: _y
  };

  this.powerups = {
    canKick: true
  };

  this.name = "Barman";
  this.lastUpdate = 0;
  this.direction = "down";

  Engine.matrices[_x][_y].content.push(this)
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


