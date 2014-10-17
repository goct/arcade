function playerf15(x, y) {
	this.name = 'playerf15';
	this.x = x;
	this.y = y;
	this.width = 61;
	this.height = 16;
	this.gunPort = [43, 10];
	this.manualSpeed = 600;
	this.bulletFireRate = 100 //ms per shot
	this.bombFireRate = 500; //ms per shot
	this.rippleLaserFireRate = 100; //ms per shot
	this.homingMissileFireRate = 900 //ms per shot
	this.lastFiredBullets = this.bulletFireRate;
	this.lastFiredBombs = this.bombFireRate;
	this.lastFiredRippleLasers = this.rippleLaserFireRate;
	this.lastFiredHomingMissiles = this.homingMissileFireRate;
	this.primaryWeaponFiring = '';
	this.secondaryWeaponFiring = '';
	this.toRemove = false;
	this.sprite = new Sprite('images/plane-stable', [0, 0], [this.width, this.height], 0, [0]);
}

playerf15.prototype.move = function(direction1, direction2, secSinceLastUpdate) {
	var entityObj = this;
	$.each([direction1, direction2], function(index, direction) {
		if (direction !== undefined) {
			switch(direction) {
				//each case will move the entity's coords if they don't put him off screen
				case leftArrowKey:
					if (entityObj.x - (entityObj.manualSpeed * secSinceLastUpdate) >= 0) {
						entityObj.x -= (entityObj.manualSpeed * secSinceLastUpdate);
					} else {
						entityObj.x = 0;
					}
					break;
				case rightArrowKey:
					if (entityObj.x + (entityObj.manualSpeed * secSinceLastUpdate) + entityObj.width <= WIDTH) {
						entityObj.x += (entityObj.manualSpeed * secSinceLastUpdate);
					} else {
						entityObj.x = WIDTH - entityObj.width;
					}
					break;
				case upArrowKey:
					if (entityObj.y - (entityObj.manualSpeed * secSinceLastUpdate) >= 0) {
						entityObj.y -= (entityObj.manualSpeed * secSinceLastUpdate);
					} else {
						entityObj.y = 0;
					}
					break;
				case downArrowKey:
					if (entityObj.y + (entityObj.manualSpeed * secSinceLastUpdate) + entityObj.height <= HEIGHT) {
						entityObj.y += (entityObj.manualSpeed * secSinceLastUpdate);
					} else {
						entityObj.y = HEIGHT - entityObj.height;
					}
					break;
			}
		}
	});
}

function redPlane(x, y) {
	this.name = 'redplane';
	this.x = parseInt(x);
	this.y = parseInt(y);
	this.width = 107;
	this.height = 30;
	this.damagedWidth = 106;
	this.damagedHeight = 26;
	this.speed = 150;
	this.maxHealth = 30;
	this.health = 30;
	this.fireRate = 3 //seconds per shot
	this.lastFired = this.fireRate;
	this.animated = false;
	this.toRemove = false;
	this.collisionOffsetX = 0;
	this.collisionOffsetY = 0;
	this.sprite = new Sprite('images/redplane.png', [0, 0], [this.width, this.height], 0, [0], null, false);
}

function bugShip(x, y) {
	this.name = 'bugship';
	this.x = parseInt(x);
	this.y = parseInt(y);
	this.width = 35;
	this.height = 37;
	this.speed = 100;
	this.health = 1;
	this.fireRate = 3 //seconds per shot
	this.lastFired = this.fireRate;
	this.animated = true;
	this.toRemove = false;
	this.collisionOffsetX = 0;
	this.collisionOffsetY = 0;
	this.sprite = new Sprite('images/bugship.png', [0, 0], [this.width, this.height], 8, [0, 1, 2], 'horizontal', false);
}

function helicopter(x, y) {
	this.name = 'helicopter';
	this.x = parseInt(x);
	this.y = parseInt(y);
	this.width = 193;
	this.height = 55;
	this.speed = 300;
	this.maxHealth = 16;
	this.health = 16;
	this.fireRate = 2;
	this.lastFired = this.fireRate;
	this.animated = false;
	this.toRemove = false;
	this.collisionOffsetX = 50;
	this.collisionOffsetY = 10;
	this.sprite = new Sprite('images/helicopter.png', [0, 0], [this.width, this.height], 0, [0]);
}

function aaGun(x, y) {
	this.name = 'aagun';
	this.x = parseInt(x);
	this.y = parseInt(y);
	this.width = 117;
	this.height = 111;
	this.speed = 0; //set it to landscape speed later
	this.health = 15;
	this.fireRate = 3; //seconds per shot
	this.lastFired = this.fireRate;
	this.animated = false;
	this.toRemove = false;
	this.collisionOffsetX = 0;
	this.collisionOffsetY = 0;
	this.sprite = new Sprite('images/aagun.png', [0, 0], [this.width, this.height], 0, [0]);
}