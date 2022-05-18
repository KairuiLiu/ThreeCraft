import './common';
import Crosshair from './crosshair';
import Fps from './fps';
import Bag from './bag';
import Menu from './menu';

const fps = new Fps(document.getElementById('HUD-stage'));
const bag = new Bag(document.getElementById('HUD-stage'));
const crosshair = new Crosshair(document.getElementById('HUD-stage'));
const menu = new Menu(document.getElementById('app'));

export default { fps, bag, crosshair, menu };
