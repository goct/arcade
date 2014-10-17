//setup
var scoreDisplay = $("#score");
var highScoreDisplay = $("#highscore");
var score = 0;
var highScore = 0;
var allTimeHighScores;
var startTime;
var elapsedSeconds = 0;
var gameStarted = false;
var gameOver = false;
var paused = false;
var bgCtx;
var ctx;
var viewport = $(window);
var WIDTH = viewport.width();
var HEIGHT = viewport.height();
var player;

var landscape;
var cleanUpNeeded = false;
var lastTime;
var requestAnimFrame = window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
										window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

//input keycodes
var leftArrowKey = 37;
var upArrowKey = 38;
var rightArrowKey = 39;
var downArrowKey = 40;
var keysPressed = [];
var spaceBar = 32;
var zKey = 90;
var xKey = 88;
var cKey = 67;
var pKey = 80;
var oKey = 79;
var aKey = 65;

//entity lists
var landscapes;
var backgroundImages;
var bullets;
var bombs;
var rippleLasers;
var homingMissiles;
var enemyBullets;
var enemies;
var explosions;
var enemyWaves;
var gameOverScreen;

//game settings
var enemySpawnRate = 1.2; //sec per non-planned spawn
var secSinceLastEnemySpawn = enemySpawnRate;

//debug settings
//c key prevents enemies from moving/spawning
var enableEnemies = true;
var enableEnemyMovement = true;
var enablePlayerCollision = true;
var enableStopEnemiesButton = false;
var enableScoreCheating = false;

//audio
var rippleLaserSound = new Howl({urls: ['sounds/rippleLaser.mp3'], volume:0.1});
var bigExplosionSound = new Howl({urls: ['sounds/bigexplosion.wav'], volume:0.1});
var smallExplosionSound = new Howl({urls: ['sounds/smallexplosion.mp3'], volume:0.1});
var bombExplosionSound = new Howl({urls: ['sounds/bombexplosion.mp3'], volume:0.1});
var mainGunSound = new Howl({urls: ['sounds/maingun.mp3'], volume:0.1});
var homingMissileSound = new Howl({urls: ['sounds/homingmissile.mp3'], volume:0.1});
var homingMissileExplosionSound = new Howl({urls: ['sounds/homingmissileexplosion.mp3'], volume:0.1});


function enemyWave(spawnTime, enemyType, quantity, spacing, y, orientation) {
	this.spawnTime = spawnTime;
	this.enemyType = enemyType;
	this.quantity = quantity;
	this.spacing = spacing;
	this.y = y;
	this.orientation = orientation;
}


function init() {
	var canvas = $("#canvas");
	var bgCanvas = $("#canvas-background");
	canvas[0].height = HEIGHT;
	bgCanvas[0].height = canvas[0].height;
	canvas[0].width = WIDTH;
	bgCanvas[0].width = canvas[0].width
	ctx = canvas[0].getContext("2d");
	bgCtx = bgCanvas[0].getContext("2d");
	
	initInput();
	getAllTimeHighScores();
	reset();
	
	lastTime = Date.now();

	return requestAnimFrame(main);
}

function initInput() {
	$("body").keydown(function(event) {
		if ([leftArrowKey, rightArrowKey, upArrowKey, downArrowKey].indexOf(event.keyCode) != -1) {
			event.preventDefault();
			if (keysPressed.indexOf(event.keyCode) == -1) {
				keysPressed.push(event.keyCode);
			}
		} else {
			switch(event.keyCode) {
				case spaceBar:
					event.preventDefault();
					if (!gameOver) {
						player.primaryWeaponFiring = 'bullets';
					} else {
						gameOver = false;
						reset();
						requestAnimFrame(main);
					}
					break;
				case zKey:
					event.preventDefault();
					player.secondaryWeaponFiring = 'bombs';					
					break;
				case xKey:
					event.preventDefault();
					player.primaryWeaponFiring = 'ripple lasers';
					break;
				case cKey:
					if (enableStopEnemiesButton) {
						event.preventDefault();
						//gameOver = true;
						enableEnemies = false;
						enableEnemyMovement = false;
					}
					break;
				case pKey:
					event.preventDefault();
					if (!paused) {
						pause();
					} else {
						unpause();
					}
					break;
				case oKey:
					if (enableScoreCheating) {
						//for testing purposes
						event.preventDefault();
						score += 100;
						scoreDisplay.html(score);
					}
					break;
				case aKey:
					event.preventDefault();
					player.secondaryWeaponFiring = 'homing missiles';
			}
		}
	});
	$("body").keyup(function(event) {
		if (keysPressed.indexOf(event.keyCode) != -1) {
			event.preventDefault();
			keysPressed.splice(keysPressed.indexOf(event.keyCode), 1);
		} else if (event.keyCode == spaceBar && player.primaryWeaponFiring == 'bullets') {
			player.primaryWeaponFiring = '';
		} else if (event.keyCode == zKey && player.secondaryWeaponFiring == 'bombs') {
			player.secondaryWeaponFiring = '';
		} else if (event.keyCode == xKey && player.primaryWeaponFiring == 'ripple lasers') {
			player.primaryWeaponFiring = '';
		} else if (event.keyCode == aKey && player.secondaryWeaponFiring == 'homing missiles') {
			player.secondaryWeaponFiring = '';
		}
	});
}

function getAllTimeHighScores() {
	$.post('dbget.php', null, function(data) {
		allTimeHighScores = data.highScores;
	}, 'json');
}

function reset() {
	scoreDisplay.html(score);
	landscapes = [];
	backgroundImages = [];
	bullets = [];
	bombs = [];
	rippleLasers = [];
	homingMissiles = [];
	enemyBullets = [];
	enemies = [];
	explosions = [];
	
	//enemy waves
	enemyWaves = [
	new enemyWave(2, 'helicopter', 1, 2, HEIGHT - 111 - 30, 'h'),
	new enemyWave(2, 'bugship', 5, 2, 400, 'h'),
	new enemyWave(4, 'bugship', 5, 2, 200, 'h'),
	new enemyWave(6, 'redplane', 1, 2, 500, 'h'),
	new enemyWave(6, 'aagun', 1, 2, HEIGHT - 111 - 30, 'h'),
	new enemyWave(10, 'redplane', 1, 2, 100, 'h'),
	new enemyWave(12, 'bugship', 5, 2,100, 'v'),
	new enemyWave(13, 'aagun', 1, 2, HEIGHT - 111 - 30, 'h'),
	new enemyWave(14, 'bugship', 3, 2, 50, 'v'),
	new enemyWave(14, 'bugship', 3, 2, 400, 'v')
	];
	
	player = new playerf15(5, 5);
	landscapes.push(new landscapeGreen(0, HEIGHT - 150));
	backgroundImages.push(new backgroundStars(0, 0));
	gameOverScreenInstance = new gameOverScreen();
	
	startTime = Date.now();
}

function pause() {
	scoreDisplay.html('paused');
	paused = true;
}

function unpause() {
	var now = Date.now();
	startTime = now - elapsedSeconds * 1000;
	lastTime = now;
	paused = false;
	scoreDisplay.html(score);
	requestAnimFrame(main);
}

function main() {
	var now = Date.now();
	var secSinceLastUpdate = (now - lastTime) / 1000;
	if (secSinceLastUpdate > 0.16) {
		if (now - startTime > 1000 && gameStarted) {
			//user has probably minimized the window or focused on a different tab
			pause();
			return;
		}
	}
	update(secSinceLastUpdate);
	render();
	
	lastTime = now;
	gameStarted = true;
	
	if (!gameOver && !paused) {
		requestAnimFrame(main);
	} else if (gameOver) {
		stopGame();
	}
}

function update(secSinceLastUpdate) {
	elapsedSeconds = (Date.now() - startTime) / 1000;
	updateEntities(secSinceLastUpdate);
	checkCollisions();
	if (cleanUpNeeded) {
		cleanUp();
	}
}

function updateEntities(secSinceLastUpdate) {
	if (gameOver) {
		return;
	}

	/*##################
	        UPDATE PLAYER
	##################*/
	//change plane sprite as needed
	if (keysPressed.indexOf(upArrowKey) == -1 && keysPressed.indexOf(downArrowKey) == -1) {
		//plane should be stable
		if (player.sprite.url != 'images/plane-stable.png') {
			player.sprite.url = 'images/plane-stable.png';
			player.sprite.size[0] = 61;
			player.sprite.size[1] = 16;
			player.height = 16;
		}
	} else if (keysPressed.indexOf(upArrowKey) != -1) {
		//plane should be moving up
		if (player.sprite.url != 'images/plane-up.png') {
			player.sprite.url = 'images/plane-up.png';
			player.sprite.size[0] = 61;
			player.sprite.size[1] = 16;
			player.height = 16;
		}
	} else if (keysPressed.indexOf(downArrowKey) != -1) {
		//plane should be moving down
		if (player.sprite.url != 'images/plane-down.png') {
			player.sprite.url = 'images/plane-down.png';
			player.sprite.size[0] = 60;
			player.sprite.size[1] = 17;
			player.height = 16;
		}
	}
	
	if (player.primaryWeaponFiring) {
		var now = Date.now();
		switch(player.primaryWeaponFiring) {
			case 'bullets':
				var timeSinceLastFiredBullets = (now - player.lastFiredBullets);
				if (timeSinceLastFiredBullets >= player.bulletFireRate) {
					player.lastFiredBullets = Date.now();
					bullets.push(new playerBullet(player.x + player.gunPort[0] + 5, player.y + player.gunPort[1] - 7));
					mainGunSound.play();
				}
				break;
			case 'ripple lasers':
				var timeSinceLastFiredRippleLasers = (now - player.lastFiredRippleLasers);
				if (timeSinceLastFiredRippleLasers >= player.rippleLaserFireRate) {
					player.lastFiredRippleLasers = Date.now();
					rippleLasers.push(new playerRippleLaser(player.x + player.gunPort[0] + 3, player.y + player.gunPort[1] - 24));
					rippleLaserSound.play();
				}
				break;
		}
	}
	
	if (player.secondaryWeaponFiring) {
		var now = Date.now();
		switch(player.secondaryWeaponFiring) {
			case 'bombs':
				var timeSinceLastFiredBombs = (now - player.lastFiredBombs);
				if (timeSinceLastFiredBombs >= player.bombFireRate) {
					player.lastFiredBombs = Date.now();
					bombs.push(new playerBomb(player.x + 20, player.y + 7));
				}
				break;
			case 'homing missiles':
				var timeSinceLastFiredHomingMissiles = (now - player.lastFiredHomingMissiles);
				if (timeSinceLastFiredHomingMissiles >= player.homingMissileFireRate) {
					if (enemies.length) {
						//pick a random enemy target
						var target = enemies[Math.floor(Math.random() * enemies.length)];
					} else {
						var target = null;
					}
					player.lastFiredHomingMissiles = Date.now();
					homingMissiles.push(new playerHomingMissile(player.x + player.gunPort[0] -20, player.y + player.gunPort[1] - 10, target));
					homingMissiles[homingMissiles.length - 1].sound = homingMissileSound;
					homingMissiles[homingMissiles.length - 1].sound.play();
				}
				break;
		}		
	}
	
	if (keysPressed[0] !== undefined) {
		player.move(keysPressed[0], keysPressed[1], secSinceLastUpdate);
	}
	
	/*################
	UPDATE EXPLOSIONS
	################*/
	for (var i = 0; i < explosions.length; i++) {
		explosions[i].sprite.update(secSinceLastUpdate);
		if (explosions[i].sprite.done) {
			explosions[i].toRemove = true;
			cleanUpNeeded = true;
		}
	}
	/*###############
	UPDATE ENEMIES
	###############*/
	$.each(enemies, function(index, enemy) {
		//change redplane sprite to damaged version if low health
		if (enemy.sprite.url == 'images/redplane.png' && enemy.health <= enemy.maxHealth / 2) {
			enemy.sprite.url = 'images/redplane-damaged.png';
			enemy.sprite.size[0] = 106;
			enemy.sprite.size[1] = 26;
			enemy.width = enemy.damagedWidth;
			enemy.height = enemy.damagedHeight;
			enemy.y += 3;
		}
		//update animated sprites
		if (enemy.animated) {
			enemy.sprite.update(secSinceLastUpdate);
		}
		//move enemies
		if (enableEnemyMovement) {
			switch(enemy.name) {
				case 'bugship':
				case 'redplane':
				case 'helicopter':
					enemy.x -= (enemy.speed * secSinceLastUpdate);
					break;
				case 'aagun':
					enemy.x -= (landscapes[0].speed * secSinceLastUpdate);
					break;
			}
			
		}
		//make enemies shoot at the player
		enemy.lastFired += secSinceLastUpdate;
		//if (enableEnemies) {
			if (enemy.lastFired >= enemy.fireRate && enemy.x < WIDTH - enemy.width) {
				switch(enemy.name) {
					case 'bugship':
					case 'redplane':
					case 'helicopter':
					case 'aagun':
						//find angle to fire bullet at player
						var relativePositionX = (enemy.x + 22 - player.x);
						var relativePositionY = (enemy.y + 18 - player.y);
						var radians = Math.atan2(-relativePositionY, relativePositionX);
						enemyBullets.push(new enemyRegularLaser(enemy.x + 22, enemy.y + 18, radians));
						break;
					/*
					case 'aagun':
						//this projectile will update trajectory when it moves
						enemyBullets.push(new enemyHomingMissile(enemy.x, enemy.y));
						break;
					*/
				}

				enemy.lastFired = 0;
			}
		//}
		//remove enemy if offscreen
		if (enemy.x < enemy.width * -1) {
			$.each(homingMissiles, function(index, homingMissile) {
				if (homingMissile.target === enemy) {
					homingMissile.target = null;
				}
			});
			enemy.toRemove = true;
			cleanUpNeeded = true;
		}
	});
	
	//add enemies
	if (enableEnemies == true) {
		if (enemyWaves.length == 0) {
			//we've run out of pre-planned enemy waves, so just add random enemies
				if (secSinceLastEnemySpawn >= enemySpawnRate) {
					var enemyY = getRandomInt(0, HEIGHT - 37 - 150);
					var randomFloat = Math.random();
					if (randomFloat > 0.8) {
						enemies.push(new redPlane(WIDTH, enemyY));
					} else if (randomFloat > 0.6) {
						enemies.push(new bugShip(WIDTH, enemyY));
					} else if (randomFloat > 0.5) {
						enemies.push(new aaGun(WIDTH, HEIGHT - 111 - 15));
					} else if (randomFloat > 0.4) {
						enemies.push(new helicopter(WIDTH, enemyY));
					} else {
						//add a randomly generated enemy wave
						var quantity = getRandomInt(1, 6);
						if (Math.random() > 0.5) {
							var orientation = 'h';
						} else {
							var orientation = 'v';
						}
						var randomFloat = Math.random();
						if (randomFloat > 0.9) {
							var enemyType = 'redplane';
						} else if (randomFloat > 0.8) {
							var enemyType = 'helicopter';
						} else {
							var enemyType = 'bugship';
						}
						enemyWaves.push(new enemyWave(elapsedSeconds, enemyType, quantity, 2, getRandomInt(50, 500), orientation));
					}
					secSinceLastEnemySpawn = 0;
				} else {
					secSinceLastEnemySpawn += secSinceLastUpdate;
				}
		} else {
			//add pre-planned enemy waves
			for (var i = 0; enemyWaves[i] !== undefined; i++) {
				var wave = enemyWaves[i];
				if (elapsedSeconds >= wave.spawnTime) {
					switch(wave.enemyType) {
						case 'bugship':
							var enemy = bugShip;
							var entityWidth = 35;
							var entityHeight = 37;
							break;
						case 'redplane':
							var enemy = redPlane;
							var entityWidth = 107;
							var entityHeight = 30;
							break;
						case 'aagun':
							var enemy = aaGun;
							var entityWidth = 117;
							var entityHeight = 111;
							break;
						case 'helicopter':
							var enemy = helicopter;
							var entityWidth = 145;
							var entityHeight = 55;
							break;
					}
					for (var j = 0; j < wave.quantity; j++) {
						switch(wave.orientation) {
							case 'h':
								//left to right
								enemies.push(new enemy(entityWidth + WIDTH + wave.spacing * entityWidth * j, wave.y));
								break;
							case 'v':
								//going down vertically
								enemies.push(new enemy(entityWidth + WIDTH, wave.y + (wave.spacing * j * entityHeight)));
								break;
						}
					}
					enemyWaves.splice(i, 1);
					i--;
				} else {
					//stop looping through all possible spawns
					break;
				}
			}
		}
	}

	
	/*#################
	UPDATE PLAYERS BULLETS
	#################*/
	$.each(bullets, function(index, bullet) {
		bullet.x += bullet.speed * secSinceLastUpdate;
		if (bullet.x > WIDTH || bullet.finalLoop) {
			bullet.toRemove = true;
			cleanUpNeeded = true;
		}
	});
	
	/*################
	UPDATE PLAYERS BOMBS
	################*/
	$.each(bombs, function(index, bomb) {
		bomb.sprite.update(secSinceLastUpdate);
		if (bomb.impact) {
			explosions.push(new bombExplosion2(bomb.x + 4, bomb.y + 7));
			bombExplosionSound.play();
		}
		//move it diagonally down and to the right, but more down than right
		bomb.x += (bomb.speed / 2) * secSinceLastUpdate;
		bomb.y += bomb.speed * secSinceLastUpdate;
		if (bomb.y > HEIGHT - 50) {
			explosions.push(new bombExplosion2(bomb.x + 4, HEIGHT - 25));
			bombExplosionSound.play();
			bomb.toRemove = true;
			cleanUpNeeded = true;
		}
		if (bomb.x > WIDTH || bomb.y > HEIGHT || bomb.finalLoop) {
			bomb.toRemove = true;
			cleanUpNeeded = true;
		}
	});
	
	/*####################
	UPDATE PLAYERS RIPPLE LASER
	####################*/
	$.each(rippleLasers, function(index, rippleLaser) {
		var currentFrame = rippleLaser.currentFrame;
		if (currentFrame != 6) {
			rippleLaser.sprite.update(secSinceLastUpdate);
		}
		//adjust size of collision offset based on sprite frame progression
		switch(rippleLaser.sprite.currentFrame) {
			case 0:
				rippleLaser.height = 12;
				rippleLaser.collisionOffsetY = (48 - 12) / 2;
				break;
			case 1:
				rippleLaser.height = 16;
				rippleLaser.collisionOffsetY = (48 - 16) / 2;
				break;
			case 2:
				rippleLaser.height = 20;
				rippleLaser.collisionOffsetY = (48 - 20) / 2;
				break;
			case 3:
				rippleLaser.height = 26;
				rippleLaser.collisionOffsetY = (48 - 26) / 2;
				break;
			case 4:
				rippleLaser.height = 32;
				rippleLaser.collisionOffsetY = (48 - 32) / 2;
				break;
			case 5:
				rippleLaser.height = 40;
				rippleLaser.collisionOffsetY = (48 - 40) / 2;
				break;
			case 6:
				rippleLaser.height = 48;
				rippleLaser.collisionOffsetY = 0;
				break;
		}
		rippleLaser.x += rippleLaser.speed * secSinceLastUpdate;
		if (rippleLaser.x > WIDTH + rippleLaser.width || rippleLaser.finalLoop) {
			rippleLaser.toRemove = true;
			cleanUpNeeded = true;
		}
	});
	
	/*#######################
	UPDATE PLAYERS HOMING MISSILES
	#######################*/
	$.each(homingMissiles, function(index, homingMissile) {
		if (homingMissile.impact) {
			explosions.push(new bombExplosion1(homingMissile.x + homingMissile.width / 2, homingMissile.y + homingMissile.height / 2));
			homingMissileExplosionSound.play();
		}
		if (homingMissile.target !== null && typeof homingMissile.target.x == 'number') {
			//recalculate angle
			var relativePositionX = (homingMissile.x - homingMissile.target.x);
			var relativePositionY = (homingMissile.y - homingMissile.target.y);
			var radians = Math.atan2(-relativePositionY, relativePositionX);
			//var absRadians = Math.abs(radians);
			//update orientation of homing missile sprite
			if (radians <= 0.39 && radians >= -0.39) {
				if (homingMissile.sprite.url != 'images/homingmissile-left.png') {
					homingMissile.sprite.url = 'images/homingmissile-left.png';
					homingMissile.sprite.size[0] = 53;
					homingMissile.sprite.size[1] = 18;
					homingMissile.collisionOffsetX = 0;
					homingMissile.collisionOffsetY = 6;
				}
			} else if (radians <= -0.39 && radians > -1.175) {
				if (homingMissile.sprite.url != 'images/homingmissile-upleft.png') {
					homingMissile.sprite.url = 'images/homingmissile-upleft.png';
					homingMissile.sprite.size[0] = 38;
					homingMissile.sprite.size[1] = 40;
					homingMissile.collisionOffsetX = 1;
					homingMissile.collisionOffsetY = 1;
				}				
			} else if (radians <= -1.175 && radians > -1.96) {
				if (homingMissile.sprite.url != 'images/homingmissile-up.png') {
					homingMissile.sprite.url = 'images/homingmissile-up.png';
					homingMissile.sprite.size[0] = 18;
					homingMissile.sprite.size[1] = 53;
					homingMissile.collisionOffsetX = 3;
					homingMissile.collisionOffsetY = 0;
				}				
			} else if (radians <= -1.96 && radians > -2.745) {
				if (homingMissile.sprite.url != 'images/homingmissile-upright.png') {
					homingMissile.sprite.url = 'images/homingmissile-upright.png';
					homingMissile.sprite.size[0] = 38;
					homingMissile.sprite.size[1] = 40;
					homingMissile.collisionOffsetX = 29;
					homingMissile.collisionOffsetY = 0;
				}				
			} else if (radians <= -2.745 || radians > 2.75) {
				if (homingMissile.sprite.url != 'images/homingmissile-right.png') {
					homingMissile.sprite.url = 'images/homingmissile-right.png';
					homingMissile.sprite.size[0] = 53;
					homingMissile.sprite.size[1] = 18;
					homingMissile.collisionOffsetX = 44;
					homingMissile.collisionOffsetY = 6;
				}				
			} else if (radians <= 2.745 && radians > 1.965) {
				if (homingMissile.sprite.url != 'images/homingmissile-downright.png') {
					homingMissile.sprite.url = 'images/homingmissile-downright.png';
					homingMissile.sprite.size[0] = 38;
					homingMissile.sprite.size[1] = 40;
					homingMissile.collisionOffsetX = 29;
					homingMissile.collisionOffsetY = 30;
				}				
			} else if (radians <= 1.965 && radians > 1.18) {
				if (homingMissile.sprite.url != 'images/homingmissile-down.png') {
					homingMissile.sprite.url = 'images/homingmissile-down.png';
					homingMissile.sprite.size[0] = 18;
					homingMissile.sprite.size[1] = 53;
					homingMissile.collisionOffsetX = 6;
					homingMissile.collisionOffsetY = 44;
				}				
			} else if (radians <= 1.18 && radians > 0.39) {
				if (homingMissile.sprite.url != 'images/homingmissile-downleft.png') {
					homingMissile.sprite.url = 'images/homingmissile-downleft.png';
					homingMissile.sprite.size[0] = 39;
					homingMissile.sprite.size[1] = 39;
					homingMissile.collisionOffsetX = 1;
					homingMissile.collisionOffsetY = 29;
				}				
			}
			homingMissile.lastRadians = radians;
		} else {
			//move in previous direction
			var radians = homingMissile.lastRadians;
			//acquire new target for next update if possible
			if (enemies.length) {
				homingMissile.target = enemies[Math.floor(Math.random() * enemies.length)];				
			}
		}
		homingMissile.x -= homingMissile.speed * Math.cos(radians) * secSinceLastUpdate;
		homingMissile.y += homingMissile.speed * Math.sin(radians) * secSinceLastUpdate;
		if (homingMissile.x > WIDTH || homingMissile.x < 0 - homingMissile.width ||
			homingMissile.y > HEIGHT || homingMissile.y < 0 - homingMissile.height ||
			homingMissile.finalLoop) {
			homingMissile.sound.stop();
			homingMissile.toRemove = true;
			cleanUpNeeded = true;
		}
	});
	
	/*#################
	UPDATE ENEMY BULLETS
	#################*/
	$.each(enemyBullets, function(index, enemyBullet) {
		switch(enemyBullet.name) {
			case 'orb-red':
				enemyBullet.x -= enemyBullet.speed * Math.cos(enemyBullet.radians) * secSinceLastUpdate;
				enemyBullet.y += enemyBullet.speed * Math.sin(enemyBullet.radians) * secSinceLastUpdate;
				break;
		}
		if (enemyBullet.x <= enemyBullet.width * -1 || enemyBullet.x > WIDTH || enemyBullet.y < 0 - 1 || enemyBullet.y > HEIGHT) {
			enemyBullet.toRemove = true;
			cleanUpNeeded = true;
		}
	});
	
	/*#############
	UPDATE LANDSCAPES
	#############*/
	$.each(landscapes, function(index, landscape) {
		landscape.x -= landscape.speed * secSinceLastUpdate;
		if (landscape.x < 0) {
			if (landscapes.length == 1) {
				landscapes.push(new landscapeGreen(landscapes[0].x + landscapes[0].width, HEIGHT - 150));
			}
			if (landscape.x < landscape.width * -1) {
				landscape.toRemove = true;
				cleanUpNeeded = true;
			}
		}
	});
	
	/*###################
	UPDATE BACKGROUND IMAGE
	###################*/
	$.each(backgroundImages, function(index, backgroundImage) {
		backgroundImage.x -= backgroundImage.speed * secSinceLastUpdate;
		if (backgroundImage.x < (backgroundImage.width / 2) * -1) {
			if (backgroundImages.length == 1) {
				backgroundImages.push(new backgroundStars(backgroundImage.x + backgroundImage.width, 0));
			}
			if (backgroundImage.x < backgroundImage.width * -1) {
				backgroundImage.toRemove = true;
				cleanUpNeeded = true;
			}
		}
	});
}
 //boxCollides(pos, size, pos2, size2) {
function checkCollisions() {
	//check if players projectiles are colliding with enemies
	$.each(enemies, function(index, enemy) {
		if (boxCollides([enemy.x + enemy.collisionOffsetX, enemy.y + enemy.collisionOffsetY], [enemy.width, enemy.height], [player.x, player.y], [player.width, player.height])) {
			//player has collided with an enemy
			if (enablePlayerCollision) {
				gameOver = true;
				/*
				console.log('enemy coordinates are ' + enemy.x + enemy.collisionOffsetX + ', ' + (enemy.y + enemy.collisionOffsetY));
				console.log('enemy.collisionOffsetY = ' + enemy.collisionOffsetY);
				console.log('enemy.y is ' + enemy.y);
				console.log('enemy height is ' + (enemy.height - enemy.collisionOffsetY));
				console.log('player coordinates are ' + player.x + ', ' + player.y);
				console.log('player height is ' + player.height);
				alert('you got hit by an enemy ' + enemy.name);
				*/
				return false;
			}
		}
		$.each([bullets, bombs, rippleLasers, homingMissiles], function(index, projectileList) {
			$.each(projectileList, function(index, projectile) {
				if (projectile.finalLoop == false && boxCollides([projectile.x + projectile.collisionOffsetX, projectile.y + projectile.collisionOffsetY], [projectile.width, projectile.height], [enemy.x + enemy.collisionOffsetX, enemy.y + enemy.collisionOffsetY], [enemy.width, enemy.height])) {
					//enemy has been hit by a players projectile
					projectile.finalLoop = true;
					projectile.impact = true;
					enemy.health -= projectile.damage;
					if (enemy.health <= 0) {
						$.each(homingMissiles, function(index, homingMissile) {
							if (homingMissile.target === enemy) {
								homingMissile.target = null;
							}
						});
						switch(enemy.name) {
							case 'bugship':
								score += 50;
								break;
							case 'aagun':
							case 'helicopter':
								score += 75;
								break;
							case 'redplane':
								score += 100;
								break;
						}
						scoreDisplay.html(score);
						if (score > highScore && highScore > 0) {
							highScore = score;
							highScoreDisplay.html(highScore);
						}
						enemy.toRemove = true;
						cleanUpNeeded = true;
						switch(enemy.name) {
							case 'bugship':
								explosions.push(new smallExplosion(enemy.x + 7, enemy.y - 28));
								smallExplosionSound.play();
								break;
							case 'redplane':
							case 'aagun':
								explosions.push(new bigExplosion(enemy.x - 43, enemy.y - 31));
								bigExplosionSound.play();
								break;
							case 'helicopter':
								explosions.push(new bigExplosion(enemy.x, enemy.y));
								bigExplosionSound.play();
								break;
						}
					}
				}
			});
		});
	});
	$.each(enemyBullets, function(index, enemyBullet) {
		if (boxCollides([player.x, player.y], player.sprite.size, [enemyBullet.x + enemyBullet.collisionOffsetX, enemyBullet.y + enemyBullet.collisionOffsetY], [enemyBullet.width, enemyBullet.height])) {
			//player has been hit by an enemy bullet
			if (enablePlayerCollision) {
				gameOver = true;
				return false;
				enemyBullet.toRemove = true;
				cleanUpNeeded = true;
			}
		}
	});
}

function cleanUp() {
	$.each([bullets, enemies, enemyBullets, explosions, bombs, landscapes, rippleLasers, homingMissiles, backgroundImages], function(index, objectList) {
		for (var i = 0; i < objectList.length; i++) {
			if (objectList[i].toRemove == true) {
				objectList.splice([i], 1);
				i--;
			}
		}		
	});
	cleanUpNeeded = false;
}

function render() {
	clear();
	//render foreground canvas stuff
	player.sprite.render(ctx, player.x, player.y);
	$.each([bullets, enemies, enemyBullets, explosions, bombs, rippleLasers, homingMissiles], function(index, objList) {
		$.each(objList, function(index, object) {
			object.sprite.render(ctx, object.x, object.y);
		});
	});
	
	//render background canvas stuff
	$.each([backgroundImages, landscapes], function(index, objList) {
		$.each(objList, function(index, object) {
			object.sprite.render(bgCtx, object.x, object.y);
		});
	});
	
}

function clear() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	bgCtx.clearRect(0, 0, WIDTH, HEIGHT);
}

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}



function findDistance(point1, point2) {
	//returns the distance between 2 points on a flat surface given the x y coordinates for each
	var xDiff = Math.abs(point1[0] - point2[0]);
	var yDiff = Math.abs(point1[1] - point2[1]);
	return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))
}

function stopGame() {
	gameOver = true;
	if (!highScore || score > highScore) {
		highScore = score;
	}
	$.ajax({
		type: "POST",
		url: "dbentry.php",
		data: {playersHighScore: score}
	});
	
	explosions.push(new bigExplosion(player.x - 33, player.y - 39));

	
	var highScoresDisplay = '';
	allTimeHighScores.push(score);
	allTimeHighScores.sort(function(a, b) { return a - b}); // improve this at some point
	allTimeHighScores.reverse();
	allTimeHighScores.pop();
	
	//blur
	stackBlurCanvasRGB('canvas-background', 0, 0, WIDTH, HEIGHT, 20);
	gameOverScreenInstance.sprite.render(ctx, gameOverScreenInstance.x, gameOverScreenInstance.y);
	
	var scoreHeight = 206;
	var ifNew = '';
	var i = 0;
	ctx.font = 'bold 14pt sans-serif';
	$.each(allTimeHighScores, function(index, value) {
		i++;
		if (value == score && ifNew == '') {
			ctx.fillStyle = '#A34100';
			ifNew = ' (new!)';
		} else {
			ctx.fillStyle = 'black';
		}
		ctx.fillText(i + ': ' + value + ifNew, gameOverScreenInstance.x + 196, gameOverScreenInstance.y + scoreHeight);
		scoreHeight += 19;
		ifNew = '';
	});
	
	highScoreDisplay.html(highScore);
	score = 0;
}

function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
}


resources.load([
	'images/explosions.png',
	'images/plane-up.png',
	'images/plane-down.png',
	'images/plane-stable.png',
	'images/bugship.png',
	'images/redplane.png',
	'images/redplane-damaged.png',
	'images/laser-green.png',
	'images/laser-red.png',
	'images/explosion-big.png',
	'images/bomb.png',
	'images/landscape.png',
	'images/laser-ripple.png',
	'images/explosion-bomb1.png',
	'images/explosion-bomb2.png',
	//'images/clouds.jpg',
	'images/game-over-screen.png',
	'images/bullet-blue.png',
	'images/bullet-red.png',
	'images/aagun.png',
	//'images/darkbluesky.jpg',
	//'images/clearbluesky.jpg',
	//'images/brightclouds.jpg',
	'images/stars.png',
	'images/homingmissile-right.png',
	'images/homingmissile-left.png',
	'images/homingmissile-upleft.png',
	'images/homingmissile-upright.png',
	'images/homingmissile-up.png',
	'images/homingmissile-down.png',
	'images/homingmissile-downleft.png',
	'images/homingmissile-downright.png',
	'images/helicopter.png'
]);

resources.onReady(init);


		/*
			//experimental!
		var relativePositionX = (enemyBullet.x - player.x);
		var relativePositionY = (enemyBullet.y - player.y);
		var radians = Math.atan2(-relativePositionY, relativePositionX);
		var degrees = radians * (180 / Math.PI)
		//console.log(degrees);
		console.log('xVelocity = speed * cos(radian)' + enemyBullet.speed * Math.cos(radians));
		console.log('yVelocity = speed * cos(radian)' + enemyBullet.speed * Math.sin(radians));
		*/