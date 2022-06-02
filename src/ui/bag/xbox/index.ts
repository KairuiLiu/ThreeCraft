import Bag from '..';
import { config } from '../../../controller/config';
import './css/style.less';

class BagXboxPlugin {
	bagOuterElem: HTMLElement;

	bagInnerElem: HTMLElement;

	bagItemsElem: HTMLElement[];

	host: Bag;

	keyPressed: boolean[];

	curHighlightAllBlockIdx: number;

	constructor(bagOuterElem: HTMLElement, host) {
		// 清除其他插件
		this.bagInnerElem = document.createElement('div');
		this.bagInnerElem.classList.add('xbox');
		this.bagOuterElem = bagOuterElem;
		[...this.bagOuterElem.children].forEach(d => !d.className.includes('bag-box') && d.remove());
		this.bagOuterElem.appendChild(this.bagInnerElem);
		this.host = host;

		this.keyPressed = new Array(20).fill(false);
		this.curHighlightAllBlockIdx = config.bag.bagItem[config.bag.activeIndex];
		this.host.bagBox.highlightAllBlockSelect(this.curHighlightAllBlockIdx);
	}

	checkAction(e) {
		const gamepad = e[0];
		if (gamepad === null) return;

		if (gamepad.buttons[4].pressed) {
			if (!this.keyPressed[4]) config.bag.activeIndex = (config.bag.activeIndex - 1 + 10) % 10;
			this.keyPressed[4] = true;
		} else this.keyPressed[4] = false;
		if (gamepad.buttons[5].pressed) {
			if (!this.keyPressed[5]) config.bag.activeIndex = (config.bag.activeIndex + 1 + 10) % 10;
			this.keyPressed[5] = true;
		} else this.keyPressed[5] = false;
		this.host.highlight();

		if (gamepad.buttons[2].pressed) {
			if (!this.keyPressed[2]) this.host.toggleBag();
			this.keyPressed[2] = true;
		} else this.keyPressed[2] = false;

		if (gamepad.buttons[1].pressed) {
			// 切换背包中激活者
			if (!this.keyPressed[1] && this.host.bagBox.working) {
				config.bag.bagBox.activeIdx = (config.bag.bagBox.activeIdx + 1) % 10;
				this.curHighlightAllBlockIdx = config.bag.bagItem[config.bag.bagBox.activeIdx];
				this.host.bagBox.highlightAllBlockSelect(this.curHighlightAllBlockIdx);
				this.host.bagBox.update();
			}
			this.keyPressed[1] = true;
		} else this.keyPressed[1] = false;

		if (gamepad.buttons[12].pressed) {
			// 上
			if (!this.keyPressed[12] && this.host.bagBox.working) {
				this.curHighlightAllBlockIdx = (this.curHighlightAllBlockIdx - 10 + 50) % 50;
				config.bag.bagItem[config.bag.bagBox.activeIdx] = this.curHighlightAllBlockIdx;
				this.host.bagBox.highlightAllBlockSelect(this.curHighlightAllBlockIdx);
				this.host.bagBox.update();
			}
			this.keyPressed[12] = true;
		} else this.keyPressed[12] = false;

		if (gamepad.buttons[13].pressed) {
			// 下
			if (!this.keyPressed[13] && this.host.bagBox.working) {
				this.curHighlightAllBlockIdx = (this.curHighlightAllBlockIdx + 10 + 50) % 50;
				config.bag.bagItem[config.bag.bagBox.activeIdx] = this.curHighlightAllBlockIdx;
				this.host.bagBox.highlightAllBlockSelect(this.curHighlightAllBlockIdx);
				this.host.bagBox.update();
			}
			this.keyPressed[13] = true;
		} else this.keyPressed[13] = false;

		if (gamepad.buttons[14].pressed) {
			// 左
			if (!this.keyPressed[14] && this.host.bagBox.working) {
				this.curHighlightAllBlockIdx = (this.curHighlightAllBlockIdx - 1 + 50) % 50;
				config.bag.bagItem[config.bag.bagBox.activeIdx] = this.curHighlightAllBlockIdx;
				this.host.bagBox.highlightAllBlockSelect(this.curHighlightAllBlockIdx);
				this.host.bagBox.update();
			}
			this.keyPressed[14] = true;
		} else this.keyPressed[14] = false;

		if (gamepad.buttons[15].pressed) {
			// 右
			if (!this.keyPressed[15] && this.host.bagBox.working) {
				this.curHighlightAllBlockIdx = (this.curHighlightAllBlockIdx + 1 + 50) % 50;
				config.bag.bagItem[config.bag.bagBox.activeIdx] = this.curHighlightAllBlockIdx;
				this.host.bagBox.highlightAllBlockSelect(this.curHighlightAllBlockIdx);
				this.host.bagBox.update();
			}
			this.keyPressed[15] = true;
		} else this.keyPressed[15] = false;

		this;
	}

	// 调整位置
	place() {
		window.addEventListener('gamepadconnected', () => null);
		this;
	}

	// 开启监听
	listen() {
		this;
	}

	// 关闭监听
	pause() {
		this;
	}

	destroy() {
		this.pause();
		this.bagInnerElem.remove();
	}
}

export default BagXboxPlugin;
