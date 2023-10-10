function randomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

class Color {
  constructor(level = 1, maxLevel = 100) {
    this.maxLevel = maxLevel;
    this.level = level;
    this.color = Array.from({ length: 3 }, () =>
    randomNumber(this.maxLevel, 255));

    this.colorVariant = this._makeColorVariant();
  }

  _makeColorVariant() {
    const newColor = [...this.color];
    return newColor.map(a => a - (10 + this.maxLevel - this.level));
  }

  print(color) {
    return `rgb(${color.join()})`;
  }

  fake() {
    return this.print(this.color);
  }

  correct() {
    return this.print(this.colorVariant);
  }}


class Game {
  constructor() {
    this.gameWidth = window.innerWidth - 10;
    if (this.gameWidth > 500) this.gameWidth = 500;

    this.scene = [];

    this.stage = new Konva.Stage({
      container: "#app",
      width: this.gameWidth,
      height: this.gameWidth });


    this.levelLayer = new Konva.Layer();
    this.gameOverLayer = new Konva.Layer();
    this.gameWinLayer = new Konva.Layer();

    this.stage.add(this.levelLayer);
    this.stage.add(this.gameOverLayer);
    this.stage.add(this.gameWinLayer);

    this._newGame();
  }

  _newGame() {
    this.difficulty = 1;
    this.difficultyLevel = 30;
    this.size = 4;
    this.dateStart = new Date();
    this.level = [];

    this._createLevel();
  }

  _gameWin() {
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      fill: "black",
      width: this.gameWidth,
      height: this.gameWidth });


    // add the shapes to the layer
    this.gameWinLayer.add(background);

    const text = new Konva.Text({
      text: `YOU WON!

Are you magician? Well done!

If you like it, I'd appreciate your ❤️

(click to restart)
`,
      fontSize: 13,
      opacity: 0,
      width: this.gameWidth,
      fill: "white",
      align: "center" });


    text.y(this.gameWidth / 2 - text.getHeight());

    const emoji = new Konva.Text({
      y: this.gameWidth / 2,
      text: `🎉`,
      width: this.gameWidth,
      fontSize: 10,
      opacity: 0,
      fill: "white",
      align: "center" });


    emoji.y(this.gameWidth / 2 - emoji.getHeight() + this.gameWidth / 4);

    this.gameWinLayer.add(text, emoji);

    text.to({
      easing: Konva.Easings.ElasticEaseOut,
      opacity: 1,
      duration: 0.7,
      fontSize: 20 });


    emoji.to({
      easing: Konva.Easings.EaseIn,
      opacity: 1,
      duration: 0.4,
      fontSize: 50 });


    this.gameWinLayer.draw();

    this.gameWinLayer.on("mousedown touchstart", () => {
      // hide the game over screen
      this.gameWinLayer.clear();
      // start new game
      this._newGame();
    });
  }

  _gameOver() {
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      fill: "black",
      width: this.gameWidth,
      height: this.gameWidth });


    // add the shapes to the layer
    this.gameOverLayer.add(background);

    const text = new Konva.Text({
      text: `GAME OVER!

Your score is: ${this.difficulty - 1}

If you like it, I'd appreciated your ❤️

(click to restart)
`,
      fontSize: 13,
      opacity: 0,
      width: this.gameWidth,
      fill: "white",
      align: "center" });


    text.y(this.gameWidth / 2 - text.getHeight());

    const emoji = new Konva.Text({
      y: this.gameWidth / 2,
      text: `🤓`,
      width: this.gameWidth,
      fontSize: 10,
      opacity: 0,
      fill: "white",
      align: "center" });


    emoji.y(this.gameWidth / 2 - emoji.getHeight() + this.gameWidth / 4);

    this.gameOverLayer.add(text, emoji);

    text.to({
      easing: Konva.Easings.ElasticEaseOut,
      opacity: 1,
      duration: 0.7,
      fontSize: 20 });


    emoji.to({
      easing: Konva.Easings.EaseIn,
      opacity: 1,
      duration: 0.4,
      fontSize: 50 });


    this.gameOverLayer.draw();

    this.gameOverLayer.on("mousedown touchstart", () => {
      // hide the game over screen
      this.gameOverLayer.clear();
      // start new game
      this._newGame();
    });
  }

  _clickHandler(id) {
    const isCorrectTile = this.level[id].win;
    if (isCorrectTile) {
      this._levelUp();
    } else {
      this._gameOver();
    }
  }

  _levelUp() {
    this.difficulty++;

    if (this.difficulty > this.difficultyLevel) {
      this._gameWin();
      return;
    }

    if (this.difficulty % 4 === 0) this.size++;
    this._createLevel();
  }

  _clearLevel() {
    this.scene.forEach(tile => {
      tile.destroy();
    });
    this.level = [];
  }

  _createLevel() {
    const color = new Color(this.difficulty, this.difficultyLevel);
    const mapSize = this.size ** 2;
    const tileGutter = 10;
    const tileWidth =
    Math.round(this.gameWidth / this.size) - tileGutter / this.size;
    const correctTile = randomNumber(0, mapSize);

    this._clearLevel();

    for (let i = 0; i < mapSize; i++) {
      this.level.push({
        x: i % this.size,
        y: Math.floor(i / this.size),
        win: i === correctTile });

    }

    this.scene = this.level.map(({ x, y, win }, id) => {
      const tileColor = win ? color.correct() : color.fake();
      return new Konva.Rect({
        id,
        x: x * tileWidth + tileGutter,
        y: y * tileWidth + tileGutter,
        width: tileWidth - tileGutter,
        height: tileWidth - tileGutter,
        fill: tileColor }).

      on("mousedown touchstart", () => this._clickHandler(id)).
      on("mouseenter", ({ target }) => {
        this.stage.container().style.cursor = "pointer";
      }).
      on("mouseleave", ({ target }) => {
        this.stage.container().style.cursor = "default";
      });
    });

    this.scene.forEach(tile => {
      this.levelLayer.add(tile);
    });

    this.levelLayer.draw();
  }}


new Game();