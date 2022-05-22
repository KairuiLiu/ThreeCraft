import './common';
import Crosshair from './crosshair';
import Fps from './fps';
import Bag from './bag';
import Menu from './menu';
import ActonControl from './action';
import { Controller } from '../controller';

class UI {
	crosshair: Crosshair;

	fps: Fps;

	actionControl: ActonControl;

	bag: Bag;

	menu: Menu;

	controller: Controller;

	loadController(controller: Controller) {
		this.controller = controller;
		this.crosshair = new Crosshair(document.getElementById('HUD-stage'));
		this.fps = new Fps(document.getElementById('HUD-stage'));
		this.actionControl = new ActonControl(document.getElementById('HUD-stage'), this.controller); // todo
		this.bag = new Bag(document.getElementById('HUD-stage'));
		this.menu = new Menu(document.getElementById('app'), null); // TODO
		document.oncontextmenu = () => false;
	}
}

export default UI;
