class Obstacle extends Phaser.GameObjects.Sprite
{
	constructor(scene, x, y)
	{
        var random = Phaser.Math.Between(1, 2);
        var texture;

        if (random === 1)
            texture = "oilSlick";
        else
            texture = "rock";

		super(scene, x, y, texture);

        this.type = texture;
	}

    setSpeed(speed) {
        this.speed = speed;
    }

    getObstacleType() {
        return this.type.toString();
    }

	update()
	{
        if (!this.speed)
            return;

		this.setY(this.y + this.speed);
	}
}