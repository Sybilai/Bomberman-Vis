var Draw = {
  ctx: undefined,
  canvas: undefined,

  matrices: undefined,

  assets: {
    blocks: {
      width: 64,
      height: 64,
      solid: new Image(),
      tile: new Image()
    },

    bomb: new Image(),
    fire: new Image(),

    player: {
      left: new Image(),
      right: new Image(),
      up: new Image(),
      down: new Image(),
      none: new Image()
    }
  },

  init: function() {
    var body = document.getElementById("body");
    Draw.canvas = document.createElement("canvas");
    Draw.ctx = Draw.canvas.getContext("2d");


    Draw.canvas.setAttribute('width', 1);
    Draw.canvas.setAttribute('height', 1);

    Draw.assets.blocks.solid.src = "img/SolidBlock.png";
    Draw.assets.blocks.tile.src = "img/BackgroundTile.png";

    Draw.assets.player.left.src = "img/player_left.png";
    Draw.assets.player.right.src = "img/player_right.png";
    Draw.assets.player.up.src = "img/player_back.png";
    Draw.assets.player.down.src = "img/player_front.png";
    Draw.assets.player.none.src = "img/player_front.png";

    Draw.assets.bomb.src = "img/bomb.png";
    Draw.assets.fire.src = "img/fire.png";

    body.appendChild( Draw.canvas );
  },

  resize: function(N, M) {
    Draw.canvas.setAttribute('width', N*this.assets.blocks.width);
    Draw.canvas.setAttribute('height', M*this.assets.blocks.height);
  },

  update: function() {
    Draw.ctx.clearRect(0, 0, Draw.canvas.width, Draw.canvas.height);
    Draw.draw();
  },

  draw: function() {
    for (var i = 0, _ilen = Draw.matrices.length; i < _ilen; ++i) {
      for (var j = 0, _jlen = Draw.matrices[i].length; j < _jlen; ++j) {
        Draw.ctx.drawImage(
          Draw.assets.blocks.tile,
          Draw.assets.blocks.width*i,
          Draw.assets.blocks.height*j
        );

        for (var c = 0, _clen = Draw.matrices[i][j].content.length; c < _clen; ++c) {
          var el = Draw.matrices[i][j].content[c];
          switch (el.type) {
            case 'fixblock':
              Draw.ctx.drawImage(
                Draw.assets.blocks.solid,
                Draw.assets.blocks.width*i,
                Draw.assets.blocks.height*j
              );
              break;
            case "player":
	      var dir = "none";
	      if (typeof el.direction == "string") dir = el.direction;
              if (typeof el.direction == "object" && el.direction.length > 0) dir = el.direction[0];
              Draw.ctx.drawImage(
                Draw.assets.player[ "none" ],
                Draw.assets.blocks.width*i,
                Draw.assets.blocks.height*j-66
              );
              Draw.ctx.font="bold 14px sans-serif";
              Draw.ctx.textAlign = "center";
              Draw.ctx.fillText(
                el.name,
                Draw.assets.blocks.width*i + Draw.assets.blocks.width/2,
                Draw.assets.blocks.height*j-40
              );
              break;
            case "bomb":
              Draw.ctx.drawImage(
                Draw.assets.bomb,
                Draw.assets.blocks.width*i+8,
                Draw.assets.blocks.height*j+8
              );
              break;
            case "flame":
              Draw.ctx.drawImage(
                Draw.assets.fire,
                Draw.assets.blocks.width*i+8,
                Draw.assets.blocks.height*j+8
              );
              break;
          }
        }

      }
    }
  },

  destroy: function(a) {
    Draw.matrices[a.pos.x][a.pos.y].content.splice(
      Draw.matrices[a.pos.x][a.pos.y].content.indexOf(a)
    ,1);
  },
}
