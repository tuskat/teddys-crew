import { Enemy } from "./enemy";

export class Boss extends Enemy {

  constructor(params) {
    super(params);
    // this.shouldRespawn = false;
    this.redrawLifebar();
  }

  updatLifeBarPosition(): void {
    return;
  }

  redrawLifebar(): void {
    if (this.lifeBar.alpha === 0 && this.life > 0) {
      this.lifeBar.alpha = 1;
    }
    this.lifeBar.clear();
    this.lifeBar.fillStyle(0xe66a28, 1);
    this.lifeBar.fillRect(
      this.scene.sys.canvas.width * 0.1, this.scene.sys.canvas.height - 120,
      (this.scene.sys.canvas.width * 0.8) * (this.life / this.maxLife),
      20
    );
    this.lifeBar.lineStyle(2, 0xffffff);
    this.lifeBar.strokeRect(this.scene.sys.canvas.width * 0.1, this.scene.sys.canvas.height - 120, this.scene.sys.canvas.width * 0.8, 20);
    this.lifeBar.setDepth(1);
  }
}
