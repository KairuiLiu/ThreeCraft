import * as THREE from 'three';

export interface iBlockFragmentSingleType {
	instancedMesh: THREE.InstancedMesh;
	blocks: {
		type: string;
		count: number;
		position: number[];
	};
}

export interface iBlockFragment {
	timestamp: number;
	group: THREE.Group;
	posX: number;
	posZ: number;
	cloudPos?: number[];
	cloudMesh?: THREE.InstancedMesh;
	types: iBlockFragmentSingleType[];
}
