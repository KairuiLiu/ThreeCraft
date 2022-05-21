import './common';
import Crosshair from './crosshair';
import Fps from './fps';
import Bag from './bag';
import Menu from './menu';
import ActonControl from './action';
import { Controller } from '../controller';

const crosshair = new Crosshair(document.getElementById('HUD-stage'));
const fps = new Fps(document.getElementById('HUD-stage'));
const actionControl = new ActonControl(document.getElementById('HUD-stage'), new Controller());
const bag = new Bag(document.getElementById('HUD-stage'));
const menu = new Menu(document.getElementById('app'), null); // TODO

// others
document.oncontextmenu = () => false;

export default {
	fps,
	bag,
	crosshair,
	menu,
	actionControl,
};
