import * as THREE from 'three';

export interface iBlockFragmentSingleType {
	instancedMesh: THREE.InstancedMesh;
	blocks: {
		type: string;
		count: number;
		position: THREE.Matrix4[];
	};
}

export interface iBlockFragment {
	timestamp: number;
	group: THREE.Group;
	posX: number;
	posZ: number;
	types: iBlockFragmentSingleType[];
}
