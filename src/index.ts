import UI from './ui';
import Core from './core';
import { Controller } from './controller';

const ui = new UI();
const core = new Core();
const controller = new Controller(ui, core);

// TODO: 开始游戏流程
