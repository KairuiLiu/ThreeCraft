import './css/style.less';
import config from '../../../core/config';

class BagBoxPlugin {
	constructor() {
		config.bag.availableBlock.forEach(d => console.log(d));
	}
}

export default BagBoxPlugin;
