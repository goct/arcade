function gameOverScreen() {
	this.name = 'game over';
	this.width = 500;
	this.height = 400;
	this.x = WIDTH / 2 - this.width / 2;
	this.y = HEIGHT / 2 - this.height / 2;
	this.toRemove = false;
	this.sprite = new Sprite('images/game-over-screen.png', [0, 0], [this.width, this.height], 0, [0]);
}