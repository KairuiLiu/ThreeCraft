// 块类型声明
import * as THREE from 'three';

export interface iBlockFragmentSingleType {
	instancedMesh?: THREE.InstancedMesh;
	// meshGroup?: THREE.Group;
	blocks: {
		type: string;
		count: number;
		position: number[];
		newIdx?: number;
	};
}

export interface iBlockFragment {
	timestamp: number;
	posX: number;
	posZ: number;
	group: THREE.Group;
	templateMesh: THREE.Mesh[];
	types: iBlockFragmentSingleType[];
	idMap: Map<string, { temp: boolean; idx: number; typeIdx?: number }>;
	cloudPos?: number[];
	cloudMesh?: THREE.InstancedMesh;
}

// eslint-disable-next-line
export enum actionBlockEvent {
	ADD,
	REMOVE,
}

export interface BlockLog {
	type: string | null;
	posX: number;
	posY: number;
	posZ: number;
	action?: actionBlockEvent;
}
