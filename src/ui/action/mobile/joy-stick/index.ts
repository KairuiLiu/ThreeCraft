// reference from https://github.com/bobboteck/JoyStick
import { config } from '../../../../controller/config';

class JoyStick {
	el: HTMLElement;

	enable: boolean;

	canvas: HTMLCanvasElement;

	context: CanvasRenderingContext2D;

	pressed: boolean;

	movedX: number;

	movedY: number;

	dirX: number;

	dirY: number;

	internalRadius: number;

	emitFun: (unknown) => void;

	constructor(el: HTMLElement, jConfig, emitFun) {
		this.el = el;
		this.enable = true;
		this.emitFun = emitFun;
		this.canvas = document.createElement('canvas');
		this.canvas.setAttribute('id', 'mobile-joy-stick');
		this.canvas.setAttribute('width', `${jConfig.width}`);
		this.canvas.setAttribute('height', `${jConfig.height}`);
		this.context = this.canvas.getContext('2d');
		this.pressed = false;
		this.movedX = this.canvas.width / 2;
		this.movedY = this.canvas.height / 2;
		this.internalRadius = (this.canvas.width - (this.canvas.width / 2 + 40)) / 2;
		this.el.appendChild(this.canvas);
		this.drawExternal();
		this.drawInternal();
		this.dirX = 0;
		this.dirY = 0;
	}

	listen() {
		this.canvas.addEventListener('touchstart', () => this.onTouchStart(), false);
		document.addEventListener('touchmove', e => this.onTouchMove(e), false);
		document.addEventListener('touchend', e => this.onTouchEnd(e), false);
		if (config.controller.dev) {
			this.canvas.addEventListener('mousedown', () => this.onTouchStart(), false);
			document.addEventListener('mousemove', e => this.onTouchMove(e), false);
			document.addEventListener('mouseup', e => this.onTouchEnd(e), false);
		}
	}

	drawExternal() {
		this.context.beginPath();
		this.context.arc(this.canvas.width / 2, this.canvas.height / 2, this.internalRadius + 50, 0, 2 * Math.PI);
		this.context.lineWidth = 10;
		this.context.strokeStyle = '#ffffffcc';
		this.context.stroke();
	}

	drawInternal() {
		this.context.beginPath();
		if (this.movedX < this.internalRadius) this.movedX = this.internalRadius + 10;
		if (this.movedX + this.internalRadius > this.canvas.width) this.movedX = this.canvas.width - (this.internalRadius + 10);
		if (this.movedY < this.internalRadius) this.movedY = this.internalRadius + 10;
		if (this.movedY + this.internalRadius > this.canvas.height) this.movedY = this.canvas.height - this.internalRadius - 10;
		this.context.arc(this.movedX, this.movedY, this.internalRadius, 0, 2 * Math.PI, false);
		const grd = this.context.createRadialGradient(this.canvas.width / 2, this.canvas.height / 2, 5, this.canvas.width / 2, this.canvas.height / 2, 200);
		grd.addColorStop(0, '#ffffffff');
		grd.addColorStop(1, '#ffffff88');
		this.context.fillStyle = grd;
		this.context.fill();
		this.context.lineWidth = 20;
		this.context.strokeStyle = '#ffffff88';
		this.context.stroke();
	}

	onTouchStart() {
		if (!this.enable) return;
		this.pressed = true;
	}

	onTouchMove(e: TouchEvent | MouseEvent) {
		if (!this.enable || !this.pressed) return;
		const targetTouches = (e as TouchEvent)?.targetTouches ? (e as TouchEvent).targetTouches[0] : e;
		if (this.pressed && targetTouches.target === this.canvas) {
			this.movedX = (targetTouches as MouseEvent).pageX;
			this.movedY = (targetTouches as MouseEvent).pageY;
			this.movedX -= this.canvas.offsetLeft;
			this.movedY -= this.canvas.offsetTop;
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.drawExternal();
			this.drawInternal();
			this.dirX = 100 * ((this.movedX - this.canvas.width / 2) / (this.internalRadius + 30));
			this.dirY = 100 * ((this.movedY - this.canvas.height / 2) / (this.canvas.height / 2 - 40)) * -1;
			this.emitFun({ font: this.dirY / 100, left: -this.dirX / 100, up: 0 });
		}
	}

	onTouchEnd(e: TouchEvent | MouseEvent) {
		if (!config.controller.dev && (!this.enable || !this.pressed || e.target !== this.canvas)) return;
		this.pressed = false;
		this.movedX = this.canvas.width / 2;
		this.movedY = this.canvas.height / 2;
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.dirX = 100 * ((this.movedX - this.canvas.width / 2) / (this.internalRadius + 30));
		this.dirY = 100 * ((this.movedY - this.canvas.height / 2) / (this.canvas.height / 2 - 40)) * -1;
		this.emitFun({ font: this.dirY / 100, left: -this.dirX / 100, up: 0 });
		this.drawExternal();
		this.drawInternal();
	}

	getDirection() {
		return {
			dirX: this.dirX,
			dirY: this.dirY,
		};
	}
}

export default JoyStick;
