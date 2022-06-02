import './common';
import Crosshair from './crosshair';
import Fps from './fps';
import Bag from './bag';
import Menu from './menu';
import ActonControl from './action';
import { Controller } from '../controller';
import { config } from '../controller/config';

class UI {
	crosshair: Crosshair;

	fps: Fps;

	actionControl: ActonControl;

	bag: Bag;

	menu: Menu;

	controller: Controller;

	loadController(controller: Controller) {
		// UI控制器
		this.controller = controller;
		// 十字准星对象
		this.crosshair = new Crosshair(document.getElementById('HUD-stage'), config.controller.crosshair === 'dark');
		// FPS对象
		this.fps = new Fps(document.getElementById('HUD-stage'));
		// 动作捕获对象
		this.actionControl = new ActonControl(document.getElementById('HUD-stage'), this.controller);
		// 物品框& 背包对象
		this.bag = new Bag(document.getElementById('HUD-stage'));
		// 菜单对象
		this.menu = new Menu(document.getElementById('app'), this.controller);
		document.oncontextmenu = () => false;
	}

	listenAll() {
		this.fps.listen();
		this.actionControl.listen();
		this.bag.listen();
	}

	pauseAll() {
		this.fps.pause();
		this.actionControl.pause();
		this.bag.pause();
	}
}

export default UI;
