export class Bullet extends Phaser.GameObjects.Sprite {
    speed;
    incX;
    incY;
    lifespan;
    entity;

    constructor(params) {
      super(params.scene, params.x, params.y, params.key);
    
      this.initVariables();
      this.initImage();
      this.initEvents();
  
      this.scene.add.existing(this);
    }
  
    private initVariables(): void {
        this.speed = Phaser.Math.GetSpeed(400, 1);
    }

    private initEvents(): void {

    }
  
    private initImage(): void {
      this.setOrigin(0.5, 0.5);
    }
  
    fire(x, y): void {
        this.setActive(true);
        this.setVisible(true);

        //  Bullets fire from the middle of the screen to the given x/y
        this.setPosition(this.entity.x, this.entity.y);

        var angle = Phaser.Math.Angle.Between(x, y, this.entity.x, this.entity.y);

        this.setRotation(angle);

        this.incX = Math.cos(angle);
        this.incY = Math.sin(angle);

        this.lifespan = 1000;
    }

    update(time, delta): void  {
        this.lifespan -= delta;

        this.x -= this.incX * (this.speed * delta);
        this.y -= this.incY * (this.speed * delta);

        if (this.lifespan <= 0)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}
