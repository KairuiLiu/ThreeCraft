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
		this.controller = controller;
		this.crosshair = new Crosshair(document.getElementById('HUD-stage'), config.controller.crosshair === 'dark');
		this.fps = new Fps(document.getElementById('HUD-stage'));
		this.actionControl = new ActonControl(document.getElementById('HUD-stage'), this.controller);
		this.bag = new Bag(document.getElementById('HUD-stage'));
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
