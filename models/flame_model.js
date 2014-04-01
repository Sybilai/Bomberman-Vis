function Flame(pos) {
  this.isBlocking = false;
  this.type = "flame";
  this.pos = {
    x: pos.x,
    y: pos.y
  };
  this.spawnFrame = GameRules.currentFrame;
  Engine.matrices[pos.x][pos.y].content.push(this);
  Engine.flames.push(this);
}

