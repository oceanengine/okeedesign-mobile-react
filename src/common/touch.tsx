/**
 * Touch
 */
export type TouchFunction = (event: TouchEvent) => void;

export default class Touch {
  static MIN_DISTANCE = 5;
  static getDirection = function (x: number, y: number): string {
    if (x > y && x > Touch.MIN_DISTANCE) {
      return 'horizontal';
    }

    if (y > x && y > Touch.MIN_DISTANCE) {
      return 'vertical';
    }

    return '';
  };

  public startX: number;
  public startY: number;
  public deltaX: number;
  public deltaY: number;
  public offsetX: number;
  public offsetY: number;
  public direction: string;

  constructor() {
    this.startX = 0;
    this.startY = 0;
    this.deltaX = 0;
    this.deltaY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.direction = '';
  }

  resetTouchStatus: () => void = () => {
    this.direction = '';
    this.deltaX = 0;
    this.deltaY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
  };

  touchStart: TouchFunction = (event: TouchEvent) => {
    this.resetTouchStatus();
    this.startX = event.touches[0].clientX;
    this.startY = event.touches[0].clientY;
  };

  touchMove: TouchFunction = (event: TouchEvent) => {
    const touch = event.touches[0];
    this.deltaX = touch.clientX - this.startX;
    this.deltaY = touch.clientY - this.startY;
    this.offsetX = Math.abs(this.deltaX);
    this.offsetY = Math.abs(this.deltaY);
    this.direction = this.direction || Touch.getDirection(this.offsetX, this.offsetY);
  };
}
