/* eslint-disable */

import './image.d.ts';
import * as THREE from 'three';

// 手动引入, 防止Vite忽略...

// Blocks3D
import acaciaLeaves3d from '../../assets/pictures/blocks-3d-clipped/acaciaLeaves.png';
import andesite3d from '../../assets/pictures/blocks-3d-clipped/andesite.png';
import bedrock3d from '../../assets/pictures/blocks-3d-clipped/bedrock.png';
import birchLeaves3d from '../../assets/pictures/blocks-3d-clipped/birchLeaves.png';
import brickBlock3d from '../../assets/pictures/blocks-3d-clipped/brickBlock.png';
import clayBlock3d from '../../assets/pictures/blocks-3d-clipped/clayBlock.png';
import coalOre3d from '../../assets/pictures/blocks-3d-clipped/coalOre.png';
import cobblestone3d from '../../assets/pictures/blocks-3d-clipped/cobblestone.png';
import blockDiamond3d from '../../assets/pictures/blocks-3d-clipped/blockDiamond.png';
import diamondOre3d from '../../assets/pictures/blocks-3d-clipped/diamondOre.png';
import diorite3d from '../../assets/pictures/blocks-3d-clipped/diorite.png';
import dirt3d from '../../assets/pictures/blocks-3d-clipped/dirt.png';
import endStone3d from '../../assets/pictures/blocks-3d-clipped/endStone.png';
import glass3d from '../../assets/pictures/blocks-3d-clipped/glass.png';
import glowstone3d from '../../assets/pictures/blocks-3d-clipped/glowstone.png';
import blockGold3d from '../../assets/pictures/blocks-3d-clipped/blockGold.png';
import granite3d from '../../assets/pictures/blocks-3d-clipped/granite.png';
import gravel3d from '../../assets/pictures/blocks-3d-clipped/gravel.png';
import ice3d from '../../assets/pictures/blocks-3d-clipped/ice.png';
import blockIron3d from '../../assets/pictures/blocks-3d-clipped/blockIron.png';
import ironOre3d from '../../assets/pictures/blocks-3d-clipped/ironOre.png';
import blockLapisLazuli3d from '../../assets/pictures/blocks-3d-clipped/blockLapisLazuli.png';
import lapisLazuliOre3d from '../../assets/pictures/blocks-3d-clipped/lapisLazuliOre.png';
import netherBrickBlock3d from '../../assets/pictures/blocks-3d-clipped/netherBrickBlock.png';
import netherQuartzOre3d from '../../assets/pictures/blocks-3d-clipped/netherQuartzOre.png';
import netherrack3d from '../../assets/pictures/blocks-3d-clipped/netherrack.png';
import noteBlock3d from '../../assets/pictures/blocks-3d-clipped/noteBlock.png';
import polishedDiorite3d from '../../assets/pictures/blocks-3d-clipped/polishedDiorite.png';
import polishedGranite3d from '../../assets/pictures/blocks-3d-clipped/polishedGranite.png';
import blockQuartz3d from '../../assets/pictures/blocks-3d-clipped/blockQuartz.png';
import redSand3d from '../../assets/pictures/blocks-3d-clipped/redSand.png';
import blockRedstone3d from '../../assets/pictures/blocks-3d-clipped/blockRedstone.png';
import redstoneOre3d from '../../assets/pictures/blocks-3d-clipped/redstoneOre.png';
import sand3d from '../../assets/pictures/blocks-3d-clipped/sand.png';
import soulsand3d from '../../assets/pictures/blocks-3d-clipped/soulsand.png';
import stone3d from '../../assets/pictures/blocks-3d-clipped/stone.png';
import terracotta3d from '../../assets/pictures/blocks-3d-clipped/terracotta.png';
import water3d from '../../assets/pictures/blocks-3d-clipped/water.png';
import acaciaWood3d from '../../assets/pictures/blocks-3d-clipped/acaciaWood.png';
import birchWood3d from '../../assets/pictures/blocks-3d-clipped/birchWood.png';
import cactus3d from '../../assets/pictures/blocks-3d-clipped/cactus.png';
import chiseledSandstone3d from '../../assets/pictures/blocks-3d-clipped/chiseledSandstone.png';
import dispenser3d from '../../assets/pictures/blocks-3d-clipped/dispenser.png';
import emeraldOre3d from '../../assets/pictures/blocks-3d-clipped/emeraldOre.png';
import grassBlock3d from '../../assets/pictures/blocks-3d-clipped/grassBlock.png';
import mycelium3d from '../../assets/pictures/blocks-3d-clipped/mycelium.png';
import podzol3d from '../../assets/pictures/blocks-3d-clipped/podzol.png';
import pumpkin3d from '../../assets/pictures/blocks-3d-clipped/pumpkin.png';
import redSandstone3d from '../../assets/pictures/blocks-3d-clipped/redSandstone.png';
import snowblock3d from '../../assets/pictures/blocks-3d-clipped/snowblock.png';

// texture

import acaciaLeavesTextureImg from '../../assets/textures/blocks-clipped/acaciaLeaves.png';
import andesiteTextureImg from '../../assets/textures/blocks-clipped/andesite.png';
import bedrockTextureImg from '../../assets/textures/blocks-clipped/bedrock.png';
import birchLeavesTextureImg from '../../assets/textures/blocks-clipped/birchLeaves.png';
import brickBlockTextureImg from '../../assets/textures/blocks-clipped/brickBlock.png';
import clayBlockTextureImg from '../../assets/textures/blocks-clipped/clayBlock.png';
import coalOreTextureImg from '../../assets/textures/blocks-clipped/coalOre.png';
import cobblestoneTextureImg from '../../assets/textures/blocks-clipped/cobblestone.png';
import blockDiamondTextureImg from '../../assets/textures/blocks-clipped/blockDiamond.png';
import diamondOreTextureImg from '../../assets/textures/blocks-clipped/diamondOre.png';
import dioriteTextureImg from '../../assets/textures/blocks-clipped/diorite.png';
import dirtTextureImg from '../../assets/textures/blocks-clipped/dirt.png';
import endStoneTextureImg from '../../assets/textures/blocks-clipped/endStone.png';
import glassTextureImg from '../../assets/textures/blocks-clipped/glass.png';
import glowstoneTextureImg from '../../assets/textures/blocks-clipped/glowstone.png';
import blockGoldTextureImg from '../../assets/textures/blocks-clipped/blockGold.png';
import graniteTextureImg from '../../assets/textures/blocks-clipped/granite.png';
import gravelTextureImg from '../../assets/textures/blocks-clipped/gravel.png';
import iceTextureImg from '../../assets/textures/blocks-clipped/ice.png';
import blockIronTextureImg from '../../assets/textures/blocks-clipped/blockIron.png';
import ironOreTextureImg from '../../assets/textures/blocks-clipped/ironOre.png';
import blockLapisLazuliTextureImg from '../../assets/textures/blocks-clipped/blockLapisLazuli.png';
import lapisLazuliOreTextureImg from '../../assets/textures/blocks-clipped/lapisLazuliOre.png';
import netherBrickBlockTextureImg from '../../assets/textures/blocks-clipped/netherBrickBlock.png';
import netherQuartzOreTextureImg from '../../assets/textures/blocks-clipped/netherQuartzOre.png';
import netherrackTextureImg from '../../assets/textures/blocks-clipped/netherrack.png';
import noteBlockTextureImg from '../../assets/textures/blocks-clipped/noteBlock.png';
import polishedDioriteTextureImg from '../../assets/textures/blocks-clipped/polishedDiorite.png';
import polishedGraniteTextureImg from '../../assets/textures/blocks-clipped/polishedGranite.png';
import blockQuartzTextureImg from '../../assets/textures/blocks-clipped/blockQuartz.png';
import redSandTextureImg from '../../assets/textures/blocks-clipped/redSand.png';
import blockRedstoneTextureImg from '../../assets/textures/blocks-clipped/blockRedstone.png';
import redstoneOreTextureImg from '../../assets/textures/blocks-clipped/redstoneOre.png';
import sandTextureImg from '../../assets/textures/blocks-clipped/sand.png';
import soulsandTextureImg from '../../assets/textures/blocks-clipped/soulsand.png';
import stoneTextureImg from '../../assets/textures/blocks-clipped/stone.png';
import terracottaTextureImg from '../../assets/textures/blocks-clipped/terracotta.png';
import waterTextureImg from '../../assets/textures/blocks-clipped/water.png';
import emeraldOreTextureImg from '../../assets/textures/blocks-clipped/emeraldOre.png';
import acaciaWoodTextureSideImg from '../../assets/textures/blocks-clipped/acaciaWood.png';
import acaciaWoodTextureTopImg from '../../assets/textures/blocks-clipped/acaciaWoodTop.png';
import birchWoodTextureSideImg from '../../assets/textures/blocks-clipped/birchWood.png';
import birchWoodTextureTopImg from '../../assets/textures/blocks-clipped/birchWoodTop.png';
import cactusTextureSideImg from '../../assets/textures/blocks-clipped/cactus.png';
import cactusTextureTopImg from '../../assets/textures/blocks-clipped/cactusTop.png';
import cactusTextureBottomImg from '../../assets/textures/blocks-clipped/cactusBottom.png';
import chiseledSandstoneTextureSideImg from '../../assets/textures/blocks-clipped/chiseledSandstone.png';
import chiseledSandstoneTextureTopImg from '../../assets/textures/blocks-clipped/chiseledSandstoneTop.png';
import dispenserTextureSideImg from '../../assets/textures/blocks-clipped/dispenserSide.png';
import dispenserTextureTopImg from '../../assets/textures/blocks-clipped/dispenserTop.png';
import grassBlockTextureSideImg from '../../assets/textures/blocks-clipped/grassBlockSide.png';
import grassBlockTextureTopImg from '../../assets/textures/blocks-clipped/grassBlockTop.png';
import myceliumTextureSideImg from '../../assets/textures/blocks-clipped/myceliumSide.png';
import myceliumTextureTopImg from '../../assets/textures/blocks-clipped/myceliumTop.png';
import podzolTextureSideImg from '../../assets/textures/blocks-clipped/podzolSide.png';
import podzolTextureTopImg from '../../assets/textures/blocks-clipped/podzolTop.png';
import pumpkinTextureFontImg from '../../assets/textures/blocks-clipped/pumpkinFont.png';
import pumpkinTextureSideImg from '../../assets/textures/blocks-clipped/pumpkinSide.png';
import pumpkinTextureTopImg from '../../assets/textures/blocks-clipped/pumpkinTop.png';
import redSandstoneTextureSideImg from '../../assets/textures/blocks-clipped/redSandstoneSide.png';
import redSandstoneTextureTopImg from '../../assets/textures/blocks-clipped/redSandstoneTop.png';
import snowblockTextureSideImg from '../../assets/textures/blocks-clipped/snowblockSide.png';
import snowblockTextureTopImg from '../../assets/textures/blocks-clipped/snowblockTop.png';

let loader = new THREE.TextureLoader();

const acaciaLeavesTexture = loader.load(acaciaLeavesTextureImg);
const andesiteTexture = loader.load(andesiteTextureImg);
const bedrockTexture = loader.load(bedrockTextureImg);
const birchLeavesTexture = loader.load(birchLeavesTextureImg);
const brickBlockTexture = loader.load(brickBlockTextureImg);
const clayBlockTexture = loader.load(clayBlockTextureImg);
const coalOreTexture = loader.load(coalOreTextureImg);
const cobblestoneTexture = loader.load(cobblestoneTextureImg);
const blockDiamondTexture = loader.load(blockDiamondTextureImg);
const diamondOreTexture = loader.load(diamondOreTextureImg);
const dioriteTexture = loader.load(dioriteTextureImg);
const dirtTexture = loader.load(dirtTextureImg);
const endStoneTexture = loader.load(endStoneTextureImg);
const glassTexture = loader.load(glassTextureImg);
const glowstoneTexture = loader.load(glowstoneTextureImg);
const blockGoldTexture = loader.load(blockGoldTextureImg);
const graniteTexture = loader.load(graniteTextureImg);
const gravelTexture = loader.load(gravelTextureImg);
const iceTexture = loader.load(iceTextureImg);
const blockIronTexture = loader.load(blockIronTextureImg);
const ironOreTexture = loader.load(ironOreTextureImg);
const blockLapisLazuliTexture = loader.load(blockLapisLazuliTextureImg);
const lapisLazuliOreTexture = loader.load(lapisLazuliOreTextureImg);
const netherBrickBlockTexture = loader.load(netherBrickBlockTextureImg);
const netherQuartzOreTexture = loader.load(netherQuartzOreTextureImg);
const netherrackTexture = loader.load(netherrackTextureImg);
const noteBlockTexture = loader.load(noteBlockTextureImg);
const polishedDioriteTexture = loader.load(polishedDioriteTextureImg);
const polishedGraniteTexture = loader.load(polishedGraniteTextureImg);
const blockQuartzTexture = loader.load(blockQuartzTextureImg);
const redSandTexture = loader.load(redSandTextureImg);
const blockRedstoneTexture = loader.load(blockRedstoneTextureImg);
const redstoneOreTexture = loader.load(redstoneOreTextureImg);
const sandTexture = loader.load(sandTextureImg);
const soulsandTexture = loader.load(soulsandTextureImg);
const stoneTexture = loader.load(stoneTextureImg);
const terracottaTexture = loader.load(terracottaTextureImg);
const waterTexture = loader.load(waterTextureImg);
const emeraldOreTexture = loader.load(emeraldOreTextureImg);
const acaciaWoodTextureSide = loader.load(acaciaWoodTextureSideImg);
const acaciaWoodTextureTop = loader.load(acaciaWoodTextureTopImg);
const birchWoodTextureSide = loader.load(birchWoodTextureSideImg);
const birchWoodTextureTop = loader.load(birchWoodTextureTopImg);
const cactusTextureSide = loader.load(cactusTextureSideImg);
const cactusTextureTop = loader.load(cactusTextureTopImg);
const cactusTextureBottom = loader.load(cactusTextureBottomImg);
const chiseledSandstoneTextureSide = loader.load(chiseledSandstoneTextureSideImg);
const chiseledSandstoneTextureTop = loader.load(chiseledSandstoneTextureTopImg);
const dispenserTextureSide = loader.load(dispenserTextureSideImg);
const dispenserTextureTop = loader.load(dispenserTextureTopImg);
const grassBlockTextureSide = loader.load(grassBlockTextureSideImg);
const grassBlockTextureTop = loader.load(grassBlockTextureTopImg);
const myceliumTextureSide = loader.load(myceliumTextureSideImg);
const myceliumTextureTop = loader.load(myceliumTextureTopImg);
const podzolTextureSide = loader.load(podzolTextureSideImg);
const podzolTextureTop = loader.load(podzolTextureTopImg);
const pumpkinTextureFont = loader.load(pumpkinTextureFontImg);
const pumpkinTextureSide = loader.load(pumpkinTextureSideImg);
const pumpkinTextureTop = loader.load(pumpkinTextureTopImg);
const redSandstoneTextureSide = loader.load(redSandstoneTextureSideImg);
const redSandstoneTextureTop = loader.load(redSandstoneTextureTopImg);
const snowblockTextureSide = loader.load(snowblockTextureSideImg);
const snowblockTextureTop = loader.load(snowblockTextureTopImg);

export const blockTypes = [
	'acaciaLeaves',
	'andesite',
	'bedrock',
	'birchLeaves',
	'brickBlock',
	'clayBlock',
	'coalOre',
	'cobblestone',
	'blockDiamond',
	'diamondOre',
	'diorite',
	'dirt',
	'endStone',
	'glass',
	'glowstone',
	'blockGold',
	'granite',
	'gravel',
	'ice',
	'blockIron',
	'ironOre',
	'blockLapisLazuli',
	'lapisLazuliOre',
	'netherBrickBlock',
	'netherQuartzOre',
	'netherrack',
	'noteBlock',
	'polishedDiorite',
	'polishedGranite',
	'blockQuartz',
	'redSand',
	'blockRedstone',
	'redstoneOre',
	'sand',
	'soulsand',
	'stone',
	'terracotta',
	'water',
	'acaciaWood',
	'birchWood',
	'cactus',
	'chiseledSandstone',
	'dispenser',
	'emeraldOre',
	'grassBlock',
	'mycelium',
	'podzol',
	'pumpkin',
	'redSandstone',
	'snowblock',
];

export const blockLoader = {
	acaciaLeaves: {
		name: 'acaciaLeaves',
		block3d: acaciaLeaves3d,
		textureTypes: ['background'],
		textureImg: acaciaLeavesTexture,
	},
	andesite: {
		name: 'andesite',
		block3d: andesite3d,
		textureTypes: ['background'],
		textureImg: andesiteTexture,
	},
	bedrock: {
		name: 'bedrock',
		block3d: bedrock3d,
		textureTypes: ['background'],
		textureImg: bedrockTexture,
	},
	birchLeaves: {
		name: 'birchLeaves',
		block3d: birchLeaves3d,
		textureTypes: ['background'],
		textureImg: birchLeavesTexture,
	},
	brickBlock: {
		name: 'brickBlock',
		block3d: brickBlock3d,
		textureTypes: ['background'],
		textureImg: brickBlockTexture,
	},
	clayBlock: {
		name: 'clayBlock',
		block3d: clayBlock3d,
		textureTypes: ['background'],
		textureImg: clayBlockTexture,
	},
	coalOre: {
		name: 'coalOre',
		block3d: coalOre3d,
		textureTypes: ['background'],
		textureImg: coalOreTexture,
	},
	cobblestone: {
		name: 'cobblestone',
		block3d: cobblestone3d,
		textureTypes: ['background'],
		textureImg: cobblestoneTexture,
	},
	blockDiamond: {
		name: 'blockDiamond',
		block3d: blockDiamond3d,
		textureTypes: ['background'],
		textureImg: blockDiamondTexture,
	},
	diamondOre: {
		name: 'diamondOre',
		block3d: diamondOre3d,
		textureTypes: ['background'],
		textureImg: diamondOreTexture,
	},
	diorite: {
		name: 'diorite',
		block3d: diorite3d,
		textureTypes: ['background'],
		textureImg: dioriteTexture,
	},
	dirt: {
		name: 'dirt',
		block3d: dirt3d,
		textureTypes: ['background'],
		textureImg: dirtTexture,
	},
	endStone: {
		name: 'endStone',
		block3d: endStone3d,
		textureTypes: ['background'],
		textureImg: endStoneTexture,
	},
	glass: {
		name: 'glass',
		block3d: glass3d,
		textureTypes: ['background'],
		textureImg: glassTexture,
	},
	glowstone: {
		name: 'glowstone',
		block3d: glowstone3d,
		textureTypes: ['background'],
		textureImg: glowstoneTexture,
	},
	blockGold: {
		name: 'blockGold',
		block3d: blockGold3d,
		textureTypes: ['background'],
		textureImg: blockGoldTexture,
	},
	granite: {
		name: 'granite',
		block3d: granite3d,
		textureTypes: ['background'],
		textureImg: graniteTexture,
	},
	gravel: {
		name: 'gravel',
		block3d: gravel3d,
		textureTypes: ['background'],
		textureImg: gravelTexture,
	},
	ice: {
		name: 'ice',
		block3d: ice3d,
		textureTypes: ['background'],
		textureImg: iceTexture,
	},
	blockIron: {
		name: 'blockIron',
		block3d: blockIron3d,
		textureTypes: ['background'],
		textureImg: blockIronTexture,
	},
	ironOre: {
		name: 'ironOre',
		block3d: ironOre3d,
		textureTypes: ['background'],
		textureImg: ironOreTexture,
	},
	blockLapisLazuli: {
		name: 'blockLapisLazuli',
		block3d: blockLapisLazuli3d,
		textureTypes: ['background'],
		textureImg: blockLapisLazuliTexture,
	},
	lapisLazuliOre: {
		name: 'lapisLazuliOre',
		block3d: lapisLazuliOre3d,
		textureTypes: ['background'],
		textureImg: lapisLazuliOreTexture,
	},
	netherBrickBlock: {
		name: 'netherBrickBlock',
		block3d: netherBrickBlock3d,
		textureTypes: ['background'],
		textureImg: netherBrickBlockTexture,
	},
	netherQuartzOre: {
		name: 'netherQuartzOre',
		block3d: netherQuartzOre3d,
		textureTypes: ['background'],
		textureImg: netherQuartzOreTexture,
	},
	netherrack: {
		name: 'netherrack',
		block3d: netherrack3d,
		textureTypes: ['background'],
		textureImg: netherrackTexture,
	},
	noteBlock: {
		name: 'noteBlock',
		block3d: noteBlock3d,
		textureTypes: ['background'],
		textureImg: noteBlockTexture,
	},
	polishedDiorite: {
		name: 'polishedDiorite',
		block3d: polishedDiorite3d,
		textureTypes: ['background'],
		textureImg: polishedDioriteTexture,
	},
	polishedGranite: {
		name: 'polishedGranite',
		block3d: polishedGranite3d,
		textureTypes: ['background'],
		textureImg: polishedGraniteTexture,
	},
	blockQuartz: {
		name: 'blockQuartz',
		block3d: blockQuartz3d,
		textureTypes: ['background'],
		textureImg: blockQuartzTexture,
	},
	redSand: {
		name: 'redSand',
		block3d: redSand3d,
		textureTypes: ['background'],
		textureImg: redSandTexture,
	},
	blockRedstone: {
		name: 'blockRedstone',
		block3d: blockRedstone3d,
		textureTypes: ['background'],
		textureImg: blockRedstoneTexture,
	},
	redstoneOre: {
		name: 'redstoneOre',
		block3d: redstoneOre3d,
		textureTypes: ['background'],
		textureImg: redstoneOreTexture,
	},
	sand: {
		name: 'sand',
		block3d: sand3d,
		textureTypes: ['background'],
		textureImg: sandTexture,
	},
	soulsand: {
		name: 'soulsand',
		block3d: soulsand3d,
		textureTypes: ['background'],
		textureImg: soulsandTexture,
	},
	stone: {
		name: 'stone',
		block3d: stone3d,
		textureTypes: ['background'],
		textureImg: stoneTexture,
	},
	terracotta: {
		name: 'terracotta',
		block3d: terracotta3d,
		textureTypes: ['background'],
		textureImg: terracottaTexture,
	},
	water: {
		name: 'water',
		block3d: water3d,
		textureTypes: ['background'],
		textureImg: waterTexture,
		accessible: true,
	},
	acaciaWood: {
		name: 'acaciaWood',
		block3d: acaciaWood3d,
		textureTypes: ['background'],
		textureImg: [acaciaWoodTextureTop, acaciaWoodTextureSide, acaciaWoodTextureSide, acaciaWoodTextureSide, acaciaWoodTextureSide, acaciaWoodTextureTop],
	},
	birchWood: {
		name: 'birchWood',
		block3d: birchWood3d,
		textureTypes: ['background'],
		textureImg: [birchWoodTextureTop, birchWoodTextureSide, birchWoodTextureSide, birchWoodTextureSide, birchWoodTextureSide, birchWoodTextureTop],
	},
	cactus: {
		name: 'cactus',
		block3d: cactus3d,
		textureTypes: ['background'],
		textureImg: [cactusTextureTop, cactusTextureSide, cactusTextureSide, cactusTextureSide, cactusTextureSide, cactusTextureBottom],
	},
	chiseledSandstone: {
		name: 'chiseledSandstone',
		block3d: chiseledSandstone3d,
		textureTypes: ['background'],
		textureImg: [chiseledSandstoneTextureTop, chiseledSandstoneTextureSide, chiseledSandstoneTextureSide, chiseledSandstoneTextureSide, chiseledSandstoneTextureSide, chiseledSandstoneTextureTop],
	},
	dispenser: {
		name: 'dispenser',
		block3d: dispenser3d,
		textureTypes: ['background'],
		textureImg: [dispenserTextureTop, dispenserTextureSide, dispenserTextureSide, dispenserTextureSide, dispenserTextureSide, dispenserTextureTop],
	},
	emeraldOre: {
		name: 'emeraldOre',
		block3d: emeraldOre3d,
		textureTypes: ['background'],
		textureImg: emeraldOreTexture,
	},
	grassBlock: {
		name: 'grassBlock',
		block3d: grassBlock3d,
		textureTypes: ['background'],
		textureImg: [grassBlockTextureTop, grassBlockTextureSide, grassBlockTextureSide, grassBlockTextureSide, grassBlockTextureSide, grassBlockTextureTop],
	},
	mycelium: {
		name: 'mycelium',
		block3d: mycelium3d,
		textureTypes: ['background'],
		textureImg: [myceliumTextureTop, myceliumTextureSide, myceliumTextureSide, myceliumTextureSide, myceliumTextureSide, myceliumTextureTop],
	},
	podzol: {
		name: 'podzol',
		block3d: podzol3d,
		textureTypes: ['background'],
		textureImg: [podzolTextureTop, podzolTextureSide, podzolTextureSide, podzolTextureSide, podzolTextureSide, podzolTextureTop],
	},
	pumpkin: {
		name: 'pumpkin',
		block3d: pumpkin3d,
		textureTypes: ['background'],
		textureImg: [pumpkinTextureTop, pumpkinTextureFont, pumpkinTextureSide, pumpkinTextureSide, pumpkinTextureSide, pumpkinTextureTop],
	},
	redSandstone: {
		name: 'redSandstone',
		block3d: redSandstone3d,
		textureTypes: ['background'],
		textureImg: [redSandstoneTextureTop, redSandstoneTextureSide, redSandstoneTextureSide, redSandstoneTextureSide, redSandstoneTextureSide, redSandstoneTextureTop],
	},
	snowblock: {
		name: 'snowblock',
		block3d: snowblock3d,
		textureTypes: ['background'],
		textureImg: [snowblockTextureTop, snowblockTextureSide, snowblockTextureSide, snowblockTextureSide, snowblockTextureSide, snowblockTextureTop],
	},
};
