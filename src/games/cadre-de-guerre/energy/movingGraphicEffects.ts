import { GraphicEffects } from "./graphicEffects";

export class MovingGraphicEffects extends GraphicEffects {
  parent = null;
  constructor(params) {
    super(params);
    this.parent = params.parent;
  }

  update(time, delta): void {
    this.x = this.parent.x;
    this.y = this.parent.y;
  }
}
