(function() {
    function Sprite(url, pos, size, speed, frames, dir, once, stayOnLastFrame) {
        this.pos = pos;
        this.size = size;
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames;
        this._index = 0;
        this.url = url;
        this.dir = dir || 'horizontal';
        this.once = once || false;
		this.stayOnLastFrame = stayOnLastFrame || false;
		this.stayingOnLastFrame = false;
		this.currentFrame = 0;
    };

    Sprite.prototype = {
        update: function(dt) {
            this._index += this.speed*dt;
        },

        render: function(ctx, dx, dy) {
            var frame;
			if (this.stayingOnLastFrame) {
				frame = this.frames.length - 1;
			} else if (this.speed > 0) {
                var max = this.frames.length;
                var idx = Math.floor(this._index);
                frame = this.frames[idx % max];

                if (this.once && idx >= max && this.stayOnLastFrame == false) {
                    this.done = true;
                    return;
                } else if (this.once && idx == max - 1 && this.stayOnLastFrame == true) {
					this.stayingOnLastFrame = true;
				}
            } else {
                frame = 0;
            }
			this.currentFrame = frame;


            var x = this.pos[0];
            var y = this.pos[1];

            if(this.dir == 'vertical') {
                y += frame * this.size[1];
            }
            else {
                x += frame * this.size[0];
            }
            ctx.drawImage(resources.get(this.url),
                          x, y,
                          this.size[0], this.size[1],
                          dx, dy,
                          this.size[0], this.size[1]);
		}
    };

    window.Sprite = Sprite;
})();