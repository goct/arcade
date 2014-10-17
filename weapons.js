function enemyRegularLaser(x, y, radians) {
	this.name = 'orb-red';
	this.x = x;
	this.y = y;
	this.radians = radians;
	this.width = 12;
	this.height = 12;
	this.speed = 400;
	this.animated = false;
	this.toRemove = false;
	this.collisionOffsetX = 6;
	this.collisionOffsetY = 6;
	this.sprite = new Sprite('images/bullet-red.png', [0, 0], [24, 24], 0, [0]);
}

function playerBullet(x, y) {
	this.name = 'bullet-blue';
	this.x = x;
	this.y = y;
	this.width = 27;
	this.height = 14;
	this.speed = 1000;
	this.damage = 3;
	this.animated = false;
	this.finalLoop = false;
	this.toRemove = false;
	this.emanationPoint = [5, 6];
	this.collisionOffsetX = 0;
	this.collisionOffsetY = 0;
	this.sprite = new Sprite('images/bullet-blue.png', [0, 0], [this.width, this.height], 0, [0]);
}

function playerBomb(x, y) {
	this.name = 'bomb';
	this.x = x;
	this.y = y;
	this.width = 9;
	this.height = 8;
	this.speed = 800;
	this.damage = 15;
	this.animated = true;
	this.finalLoop = false;
	this.toRemove = false;
	this.impact = false;
	this.collisionOffsetX = 0;
	this.collisionOffsetY = 0;
	this.sprite = new Sprite('images/bomb.png', [0, 0], [this.width, this.height], 5, [0, 1, 2, 3, 4], null, true, true);
}

function playerRippleLaser(x, y) {
	this.name = 'laser-ripple';
	this.x = x;
	this.y = y;
	this.width = 16;
	this.height = 48;
	this.speed = 800;
	this.damage = 3
	this.animated = true;
	this.finalLoop = false;
	this.toRemove = false;
	this.collisionOffsetX = 0;
	this.collisionOffsetY = 0;
	this.sprite = new Sprite('images/laser-ripple.png', [0, 0], [this.width, this.height], 12, [0, 1, 2, 3, 4, 5, 6], 'horizontal', true, true);
}

function playerHomingMissile(x, y, target) {
	this.name = 'homing missile';
	this.x = x;
	this.y = y;
	//this.radians = radians;
	//this.maxTurnRate = 20; //degrees
	this.lastRadians = -3.14;
	this.width = 9;
	this.height = 9; //height and width are collision box at tip of missile
	this.speed = 1000;
	this.damage = 15;
	this.target = target;
	this.impact = false;
	this.finalLoop = false;
	this.animated = false;
	this.toRemove = false;
	this.collisionOffsetX = 44;
	this.collisionOffsetY = 6;
	this.sprite = new Sprite('images/homingmissile-right.png', [0, 0], [53, 18], 0, [0]);
}