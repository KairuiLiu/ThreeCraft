import UI from './ui';
import Gl from './gl';
import { Controller } from './controller';

const ui = new UI();
const gl = new Gl();
const controller = new Controller(ui, gl);
