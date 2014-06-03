var Draw = {
  ctx: undefined,
  canvas: undefined,
  stage: undefined,
  layers: {
    green: undefined,
    fixblocks: undefined,
    blocks: undefined,
    players: undefined,
    bombs: undefined
  },

  matrices: undefined,

  assets: {
    blocks: {
      width: 64,
      height: 64,
      solid: new Image(),
      tile: new Image()
    },

    bomb: new Image(),
    flame: new Image(),

    player: new Image()
  },

  loadImages: function(callback) {
    Draw.assets.blocks.solid.src = "img/SolidBlock.png";
    Draw.assets.blocks.tile.src = "img/BackgroundTile.png";

    Draw.assets.player.src = "img/player.png";

    Draw.assets.bomb.src = "img/bomb.png";
    Draw.assets.flame.src = "img/flame.png";
    Draw.assets.flame.onload = callback;
  },

  init: function(N, M) {
    Draw.stage = new Kinetic.Stage({
      container: 'container',
      width: N*Draw.assets.blocks.width,
      height: M*this.assets.blocks.height
    });

    Draw.layers.green = new Kinetic.Layer();
    Draw.layers.fixblocks = new Kinetic.Layer();
    Draw.layers.blocks = new Kinetic.Layer();
    Draw.layers.players = new Kinetic.Layer();
    Draw.layers.bombs = new Kinetic.Layer();

    Draw.stage.add(Draw.layers.green);
    Draw.stage.add(Draw.layers.fixblocks);
    Draw.stage.add(Draw.layers.blocks);
    Draw.stage.add(Draw.layers.players);
    Draw.stage.add(Draw.layers.bombs);
  },

  initDraw: function() {
    for (var i = 0, _ilen = Draw.matrices.length; i < _ilen; ++i) {
      for (var j = 0, _jlen = Draw.matrices[i].length; j < _jlen; ++j) {
        Draw.layers.green.add(new Kinetic.Image({
          image: Draw.assets.blocks.tile,
          x: Draw.assets.blocks.width*i,
          y: Draw.assets.blocks.height*j
        }));

        for (var c = 0, _clen = Draw.matrices[i][j].content.length; c < _clen; ++c) {
          Draw.drawEl( Draw.matrices[i][j].content[c] );
        }
      }
    }
    Draw.stage.draw();
  },

  drawEl: function(el) {
    Entities[ el.object_id ] = el;
    switch (el.type) {
      case 'fixblock':
        el.obj = new Kinetic.Image({
          image: Draw.assets.blocks.solid,
          x: Draw.assets.blocks.width*el.pos.x,
          y: Draw.assets.blocks.height*el.pos.y
        });
        Draw.layers.fixblocks.add( el.obj );
        break;
      case "player":
        el.obj = new Kinetic.Sprite({
          x: Draw.assets.blocks.width*el.pos.x+7,
          y: Draw.assets.blocks.height*el.pos.y-30,
          image: Draw.assets.player,
          animation: "none",
          animations: {
            none: [
              351,89,48,86
            ],
            up: [
              1,89,48,86,
              51,89,48,86,
              101,89,48,86,
              151,89,48,86,
              1,89,48,86,
              201,89,48,86,
              251,89,48,86,
              301,89,48,86
            ],
            down: [
              351,89,48,86,
              1,177,48,86,
              51,177,48,86,
              101,177,48,86,
              151,177,48,86,
              201,177,48,86,
              251,177,48,86,
              301,177,48,86
            ],
            left: [
              351,177,48,86,
              1,265,48,86,
              51,265,48,86,
              101,265,48,86,
              151,265,48,86,
              201,265,48,86,
              251,265,48,86,
              301,265,48,86
            ],
            right: [
              1,1,48,86,
              51,1,48,86,
              101,1,48,86,
              151,1,48,86,
              201,1,48,86,
              251,1,48,86,
              301,1,48,86,
              351,1,48,86
            ]
          },
          frameRate: 60,
          frameIndex: 0
        });
        Draw.layers.players.add( el.obj );
        /*Draw.ctx.font="bold 14px sans-serif";
        Draw.ctx.textAlign = "center";
        Draw.ctx.fillText(
          el.name,
          Draw.assets.blocks.width*i + Draw.assets.blocks.width/2,
          Draw.assets.blocks.height*j-40
        );*/
        break;
      case "bomb":
        el.obj = new Kinetic.Image({
          image: Draw.assets.bomb,
          x: Draw.assets.blocks.width*el.pos.x+8,
          y: Draw.assets.blocks.height*el.pos.y+8
        });
        Draw.layers.bombs.add( el.obj );
        break;
      case "flame":
        el.obj = new Kinetic.Sprite({
          image: Draw.assets.flame,
          x: Draw.assets.blocks.width*el.pos.x+8,
          y: Draw.assets.blocks.height*el.pos.y+8,
          animation: "flame",
          animations: {
            flame: [
              2,2,48,4,
              52,2,48,48,
              102,2,48,48,
              152,2,48,48,
              202,2,48,48
            ]
          },
          frameRate: 4,
          frameIndex: 1
        });
        Draw.layers.bombs.add( el.obj );
        break;
    }
    if (el.obj.start) el.obj.start();
  },

  moveEl: function(id, _x, _y) {
    var v = Entities[id];
    switch(v.type) {
      default:
        v.obj.move({
          x: (_x - v.pos.x)*Draw.assets.blocks.width,
          y: (_y - v.pos.y)*Draw.assets.blocks.height
        });
        v.pos = {x: _x, y: _y};
        break;
    }
  },

  animEl: function(id, _x, _y, layer) {
    var v = Entities[id];
    var d = {
      x: (_x - v.pos.x)*Draw.assets.blocks.width,
      y: (_y - v.pos.y)*Draw.assets.blocks.height
    };

    var target = {
      x: Math.abs(d.x),
      y: Math.abs(d.y)
    };

    var anim = new Kinetic.Animation(function(frame) {
      var q = d.x * (frame.timeDiff/150);
      var w = d.y * (frame.timeDiff/150);
      target.x -= Math.abs(q);
      target.y -= Math.abs(w);
      if (target.x < 0) {
        if (q < 0) { q -= target.x; }
        else { q += target.x; }
      }
      if (target.y < 0) {
        if (w < 0) { w -= target.y; }
        else { w += target.y; }
      }
      v.obj.setX( v.obj.getX() + q);
      v.obj.setY( v.obj.getY() + w);
      if (target.x <= 0 && target.y <= 0) {
        this.stop();
        if (v.obj.stop) {
          v.obj.stop();
          v.obj.animation("none");
        }
        v.pos = { x: _x, y: _y };
      }
    }, Draw.layers[layer]);

    if (v.obj.stop) {
      v.obj.stop();
      if (_y < v.pos.y) {
        v.obj.animation("up");
      } else if (_y > v.pos.y) {
        v.obj.animation("down");
      } else if (_x < v.pos.x) {
        v.obj.animation("left");
      } else if (_x > v.pos.x) {
        v.obj.animation("right");
      }
    }
    anim.start();
  },

  destroy: function(a) {
    Draw.matrices[a.pos.x][a.pos.y].content.splice(
      Draw.matrices[a.pos.x][a.pos.y].content.indexOf(a)
    ,1);
  },
}
