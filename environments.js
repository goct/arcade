function landscapeGreen(x, y) {
	this.name = 'green landscape';
	this.x = x;
	this.y = y;
	this.width = 3840;
	this.height = 150;
	this.speed = 200;
	this.animated = false;
	this.toRemove = false;
	this.sprite = new Sprite('images/landscape.png', [0, 0], [this.width, this.height], 0, [0]);
}

function backgroundRainClouds(x, y) {
	this.name = 'clouds';
	this.x = x;
	this.y = y;
	this.width = 1920;
	this.height = 1080;
	this.speed = 0;
	this.animated = false;
	this.toRemove = false;
	this.sprite = new Sprite('images/clouds.jpg', [0, 0], [this.width, this.height], 0, [0]);
}

function backgroundDarkBlueSky(x, y) {
	this.name = 'dark blue sky';
	this.x = x;
	this.y = y;
	this.width = 1920;
	this.height = 1080;
	this.speed = 0;
	this.animated = false;
	this.toRemove = false;
	this.sprite = new Sprite('images/darkbluesky.jpg', [0, 0], [this.width, this.height], 0, [0]);
}

function backgroundClearBlueSky(x, y) {
	this.name = 'clear blue sky';
	this.x = x;
	this.y = y;
	this.width = 1920;
	this.height = 1080;
	this.speed = 0;
	this.animated = false;
	this.toRemove = false;
	this.sprite = new Sprite('images/clearbluesky.jpg', [0, 0], [this.width, this.height], 0, [0]);
}

function backgroundBrightClouds(x, y) {
	this.name = 'clear blue sky';
	this.x = x;
	this.y = y;
	this.width = 1920;
	this.height = 1080;
	this.speed = 0;
	this.animated = false;
	this.toRemove = false;
	this.sprite = new Sprite('images/brightclouds.jpg', [0, 0], [this.width, this.height], 0, [0]);
}
/*
function backgroundDeepFieldSlice1(x, y) {
	this.name = 'deep field slice 1';
	this.x = x;
	this.y = y;
	this.width = 6200;
	this.height = 1080;
	this.speed = 200;
	this.animated = false;
	this.toRemove = false;
	this.sprite = new Sprite('images/deepfieldslice1.png', [0, 0], [this.width, this.height], 0, [0]);
}
*/

function backgroundStars(x, y) {
	this.name = 'stars';
	this.x = x;
	this.y = y;
	this.width = 5000;
	this.height = 1080;
	this.speed = 50;
	this.animated = false;
	this.toRemove = false;
	this.sprite = new Sprite('images/stars.png', [0, 0], [this.width, this.height], 0, [0]);
}