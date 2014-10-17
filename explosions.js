function smallExplosion(x, y) {
	this.name = 'small explosion';
	this.x = x;
	this.y = y;
	this.width = 32;
	this.height = 63;
	this.toRemove = false;
	this.sprite = new Sprite('images/explosions.png', [0, 0], [this.width, this.height], 16, [0, 1, 2, 3, 4, 5], 'horizontal', true);
}

function bigExplosion(x, y) {
	this.name = 'big explosion';
	this.x = x;
	this.y = y;
	this.width = 125;
	this.height = 93;
	this.toRemove = false;
	this.sprite = new Sprite('images/explosion-big.png', [0, 0], [this.width, this.height], 24, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 'horizontal', true);
}

function bombExplosion1(x, y) {
	this.name = 'bomb explosion 1';
	this.x = x;
	this.y = y;
	this.width = 43;
	this.height = 43;
	this.toRemove = false;
	this.sprite = new Sprite('images/explosion-bomb1.png', [0, 0], [this.width, this.height], 20, [0, 1, 2, 3, 4, 5, 6], 'horizontal', true);
}

function bombExplosion2(x, y) {
	this.name = 'bomb explosion 2';
	this.x = x;
	this.y = y;
	this.width = 36;
	this.height = 36;
	this.toRemove = false;
	this.sprite = new Sprite('images/explosion-bomb2.png', [0, 0], [this.width, this.height], 20, [0, 1, 2, 3, 4, 5, 6, 7], 'horizontal', true);
}