import * as THREE from 'three';
import BodyPart from './bodyPart';

function setUVs(box: THREE.BoxGeometry, u: number, v: number, width: number, height: number, depth: number, TextureWidth: number, TextureHeight: number): void {
	const toFaceVertices = (x1: number, y1: number, x2: number, y2: number) => [
		new THREE.Vector2(x1 / TextureWidth, 1.0 - y2 / TextureHeight),
		new THREE.Vector2(x2 / TextureWidth, 1.0 - y2 / TextureHeight),
		new THREE.Vector2(x2 / TextureWidth, 1.0 - y1 / TextureHeight),
		new THREE.Vector2(x1 / TextureWidth, 1.0 - y1 / TextureHeight),
	];

	const top = toFaceVertices(u + depth, v, u + width + depth, v + depth);
	const bottom = toFaceVertices(u + width + depth, v, u + width * 2 + depth, v + depth);
	const left = toFaceVertices(u, v + depth, u + depth, v + depth + height);
	const front = toFaceVertices(u + depth, v + depth, u + width + depth, v + depth + height);
	const right = toFaceVertices(u + width + depth, v + depth, u + width + depth * 2, v + height + depth);
	const back = toFaceVertices(u + width + depth * 2, v + depth, u + width * 2 + depth * 2, v + height + depth);

	const uvAttr = box.attributes.uv as THREE.BufferAttribute;
	uvAttr.copyVector2sArray([
		right[3],
		right[2],
		right[0],
		right[1],
		left[3],
		left[2],
		left[0],
		left[1],
		top[3],
		top[2],
		top[0],
		top[1],
		bottom[0],
		bottom[1],
		bottom[3],
		bottom[2],
		front[3],
		front[2],
		front[0],
		front[1],
		back[3],
		back[2],
		back[0],
		back[1],
	]);
	uvAttr.needsUpdate = true;
}

function setSkinUVs(box: THREE.BoxGeometry, u: number, v: number, width: number, height: number, depth: number): void {
	setUVs(box, u, v, width, height, depth, 64, 64);
}

export class PlayerObject extends THREE.Group {
	// body parts
	readonly head: BodyPart;

	readonly body: BodyPart;

	readonly rightArm: BodyPart;

	readonly leftArm: BodyPart;

	readonly rightLeg: BodyPart;

	readonly leftLeg: BodyPart;

	private modelListeners: Array<() => void> = []; // called when model(slim property) is changed

	constructor(Texture: THREE.Texture) {
		super();

		const layer1Material = new THREE.MeshStandardMaterial({
			map: Texture,
			side: THREE.FrontSide,
		});
		const layer2Material = new THREE.MeshStandardMaterial({
			map: Texture,
			side: THREE.DoubleSide,
			transparent: true,
			alphaTest: 1e-5,
		});

		const layer1MaterialBiased = layer1Material.clone();
		layer1MaterialBiased.polygonOffset = true;
		layer1MaterialBiased.polygonOffsetFactor = 1.0;
		layer1MaterialBiased.polygonOffsetUnits = 1.0;

		const layer2MaterialBiased = layer2Material.clone();
		layer2MaterialBiased.polygonOffset = true;
		layer2MaterialBiased.polygonOffsetFactor = 1.0;
		layer2MaterialBiased.polygonOffsetUnits = 1.0;

		// Head
		const headBox = new THREE.BoxGeometry(8, 8, 8);
		setSkinUVs(headBox, 0, 0, 8, 8, 8);
		const headMesh = new THREE.Mesh(headBox, layer1Material);

		const head2Box = new THREE.BoxGeometry(9, 9, 9);
		setSkinUVs(head2Box, 32, 0, 8, 8, 8);
		const head2Mesh = new THREE.Mesh(head2Box, layer2Material);

		this.head = new BodyPart(headMesh, head2Mesh);
		this.head.name = 'head';
		this.head.add(headMesh, head2Mesh);
		headMesh.position.y = 4;
		head2Mesh.position.y = 4;
		this.add(this.head);

		// Body
		const bodyBox = new THREE.BoxGeometry(8, 12, 4);
		setSkinUVs(bodyBox, 16, 16, 8, 12, 4);
		const bodyMesh = new THREE.Mesh(bodyBox, layer1Material);

		const body2Box = new THREE.BoxGeometry(8.5, 12.5, 4.5);
		setSkinUVs(body2Box, 16, 32, 8, 12, 4);
		const body2Mesh = new THREE.Mesh(body2Box, layer2Material);

		this.body = new BodyPart(bodyMesh, body2Mesh);
		this.body.name = 'body';
		this.body.add(bodyMesh, body2Mesh);
		this.body.position.y = -6;
		this.add(this.body);

		// Right Arm
		const rightArmBox = new THREE.BoxGeometry();
		const rightArmMesh = new THREE.Mesh(rightArmBox, layer1MaterialBiased);
		this.modelListeners.push(() => {
			rightArmMesh.scale.x = 3;
			rightArmMesh.scale.y = 12;
			rightArmMesh.scale.z = 4;
			setSkinUVs(rightArmBox, 40, 16, 3, 12, 4);
		});

		const rightArm2Box = new THREE.BoxGeometry();
		const rightArm2Mesh = new THREE.Mesh(rightArm2Box, layer2MaterialBiased);
		this.modelListeners.push(() => {
			rightArm2Mesh.scale.x = 3.5;
			rightArm2Mesh.scale.y = 12.5;
			rightArm2Mesh.scale.z = 4.5;
			setSkinUVs(rightArm2Box, 40, 32, 3, 12, 4);
		});

		const rightArmPivot = new THREE.Group();
		rightArmPivot.add(rightArmMesh, rightArm2Mesh);
		this.modelListeners.push(() => {
			rightArmPivot.position.x = -0.5;
		});
		rightArmPivot.position.y = -4;

		this.rightArm = new BodyPart(rightArmMesh, rightArm2Mesh);
		this.rightArm.name = 'rightArm';
		this.rightArm.add(rightArmPivot);
		this.rightArm.position.x = -5;
		this.rightArm.position.y = -2;
		this.add(this.rightArm);

		// Left Arm
		const leftArmBox = new THREE.BoxGeometry();
		const leftArmMesh = new THREE.Mesh(leftArmBox, layer1MaterialBiased);
		this.modelListeners.push(() => {
			leftArmMesh.scale.x = 3;
			leftArmMesh.scale.y = 12;
			leftArmMesh.scale.z = 4;
			setSkinUVs(leftArmBox, 32, 48, 3, 12, 4);
		});

		const leftArm2Box = new THREE.BoxGeometry();
		const leftArm2Mesh = new THREE.Mesh(leftArm2Box, layer2MaterialBiased);
		this.modelListeners.push(() => {
			leftArm2Mesh.scale.x = 3.5;
			leftArm2Mesh.scale.y = 12.5;
			leftArm2Mesh.scale.z = 4.5;
			setSkinUVs(leftArm2Box, 48, 48, 3, 12, 4);
		});

		const leftArmPivot = new THREE.Group();
		leftArmPivot.add(leftArmMesh, leftArm2Mesh);
		this.modelListeners.push(() => {
			leftArmPivot.position.x = 0.5;
		});
		leftArmPivot.position.y = -4;

		this.leftArm = new BodyPart(leftArmMesh, leftArm2Mesh);
		this.leftArm.name = 'leftArm';
		this.leftArm.add(leftArmPivot);
		this.leftArm.position.x = 5;
		this.leftArm.position.y = -2;
		this.add(this.leftArm);

		// Right Leg
		const rightLegBox = new THREE.BoxGeometry(4, 12, 4);
		setSkinUVs(rightLegBox, 0, 16, 4, 12, 4);
		const rightLegMesh = new THREE.Mesh(rightLegBox, layer1MaterialBiased);

		const rightLeg2Box = new THREE.BoxGeometry(4.5, 12.5, 4.5);
		setSkinUVs(rightLeg2Box, 0, 32, 4, 12, 4);
		const rightLeg2Mesh = new THREE.Mesh(rightLeg2Box, layer2MaterialBiased);

		const rightLegPivot = new THREE.Group();
		rightLegPivot.add(rightLegMesh, rightLeg2Mesh);
		rightLegPivot.position.y = -6;

		this.rightLeg = new BodyPart(rightLegMesh, rightLeg2Mesh);
		this.rightLeg.name = 'rightLeg';
		this.rightLeg.add(rightLegPivot);
		this.rightLeg.position.x = -1.9;
		this.rightLeg.position.y = -12;
		this.rightLeg.position.z = -0.1;
		this.add(this.rightLeg);

		// Left Leg
		const leftLegBox = new THREE.BoxGeometry(4, 12, 4);
		setSkinUVs(leftLegBox, 16, 48, 4, 12, 4);
		const leftLegMesh = new THREE.Mesh(leftLegBox, layer1MaterialBiased);

		const leftLeg2Box = new THREE.BoxGeometry(4.5, 12.5, 4.5);
		setSkinUVs(leftLeg2Box, 0, 48, 4, 12, 4);
		const leftLeg2Mesh = new THREE.Mesh(leftLeg2Box, layer2MaterialBiased);

		const leftLegPivot = new THREE.Group();
		leftLegPivot.add(leftLegMesh, leftLeg2Mesh);
		leftLegPivot.position.y = -6;

		this.leftLeg = new BodyPart(leftLegMesh, leftLeg2Mesh);
		this.leftLeg.name = 'leftLeg';
		this.leftLeg.add(leftLegPivot);
		this.leftLeg.position.x = 1.9;
		this.leftLeg.position.y = -12;
		this.leftLeg.position.z = -0.1;
		this.add(this.leftLeg);

		this.modelListeners.forEach(d => d());
	}
}
