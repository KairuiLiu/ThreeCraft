import * as THREE from 'three';

export default class BodyPart extends THREE.Group {
	constructor(readonly innerLayer: THREE.Object3D, readonly outerLayer: THREE.Object3D) {
		super();
		innerLayer.name = 'inner';
		outerLayer.name = 'outer';
	}
}
