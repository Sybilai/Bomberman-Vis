var Ticker = {
  queue: [],
  update: function() {
    ++GameRules.currentFrame;

    while (Ticker.queue.length) {
      Ticker.queue.shift()();
    }

    Engine.update();
    if (Draw) Draw.update();

    setTimeout(Ticker.update, 1000/GameRules.framesPerSecond);
  }
}
