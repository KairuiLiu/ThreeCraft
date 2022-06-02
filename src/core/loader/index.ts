/* eslint-disable */

// 引入image说明文件
import '../../utils/types/image.d.ts';
import * as THREE from 'three';

// 引入块的图标, 必须手动引入, 防止Vite忽略依赖
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

// 引入贴图
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
// import waterTextureAlphaImg from '../../assets/textures/blocks-clipped/water_alpha.png';
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

// 创建一个THREE加载器
let loader = new THREE.TextureLoader();

// 加载材质
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
// const waterTextureAlpha = loader.load(waterTextureAlphaImg);
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

// 指定材质不做模糊
acaciaLeavesTexture.magFilter = THREE.NearestFilter;
andesiteTexture.magFilter = THREE.NearestFilter;
bedrockTexture.magFilter = THREE.NearestFilter;
birchLeavesTexture.magFilter = THREE.NearestFilter;
brickBlockTexture.magFilter = THREE.NearestFilter;
clayBlockTexture.magFilter = THREE.NearestFilter;
coalOreTexture.magFilter = THREE.NearestFilter;
cobblestoneTexture.magFilter = THREE.NearestFilter;
blockDiamondTexture.magFilter = THREE.NearestFilter;
diamondOreTexture.magFilter = THREE.NearestFilter;
dioriteTexture.magFilter = THREE.NearestFilter;
dirtTexture.magFilter = THREE.NearestFilter;
endStoneTexture.magFilter = THREE.NearestFilter;
glassTexture.magFilter = THREE.NearestFilter;
glowstoneTexture.magFilter = THREE.NearestFilter;
blockGoldTexture.magFilter = THREE.NearestFilter;
graniteTexture.magFilter = THREE.NearestFilter;
gravelTexture.magFilter = THREE.NearestFilter;
iceTexture.magFilter = THREE.NearestFilter;
blockIronTexture.magFilter = THREE.NearestFilter;
ironOreTexture.magFilter = THREE.NearestFilter;
blockLapisLazuliTexture.magFilter = THREE.NearestFilter;
lapisLazuliOreTexture.magFilter = THREE.NearestFilter;
netherBrickBlockTexture.magFilter = THREE.NearestFilter;
netherQuartzOreTexture.magFilter = THREE.NearestFilter;
netherrackTexture.magFilter = THREE.NearestFilter;
noteBlockTexture.magFilter = THREE.NearestFilter;
polishedDioriteTexture.magFilter = THREE.NearestFilter;
polishedGraniteTexture.magFilter = THREE.NearestFilter;
blockQuartzTexture.magFilter = THREE.NearestFilter;
redSandTexture.magFilter = THREE.NearestFilter;
blockRedstoneTexture.magFilter = THREE.NearestFilter;
redstoneOreTexture.magFilter = THREE.NearestFilter;
sandTexture.magFilter = THREE.NearestFilter;
soulsandTexture.magFilter = THREE.NearestFilter;
stoneTexture.magFilter = THREE.NearestFilter;
terracottaTexture.magFilter = THREE.NearestFilter;
waterTexture.magFilter = THREE.NearestFilter;
emeraldOreTexture.magFilter = THREE.NearestFilter;
acaciaWoodTextureSide.magFilter = THREE.NearestFilter;
acaciaWoodTextureTop.magFilter = THREE.NearestFilter;
birchWoodTextureSide.magFilter = THREE.NearestFilter;
birchWoodTextureTop.magFilter = THREE.NearestFilter;
cactusTextureSide.magFilter = THREE.NearestFilter;
cactusTextureTop.magFilter = THREE.NearestFilter;
cactusTextureBottom.magFilter = THREE.NearestFilter;
chiseledSandstoneTextureSide.magFilter = THREE.NearestFilter;
chiseledSandstoneTextureTop.magFilter = THREE.NearestFilter;
dispenserTextureSide.magFilter = THREE.NearestFilter;
dispenserTextureTop.magFilter = THREE.NearestFilter;
grassBlockTextureSide.magFilter = THREE.NearestFilter;
grassBlockTextureTop.magFilter = THREE.NearestFilter;
myceliumTextureSide.magFilter = THREE.NearestFilter;
myceliumTextureTop.magFilter = THREE.NearestFilter;
podzolTextureSide.magFilter = THREE.NearestFilter;
podzolTextureTop.magFilter = THREE.NearestFilter;
pumpkinTextureFont.magFilter = THREE.NearestFilter;
pumpkinTextureSide.magFilter = THREE.NearestFilter;
pumpkinTextureTop.magFilter = THREE.NearestFilter;
redSandstoneTextureSide.magFilter = THREE.NearestFilter;
redSandstoneTextureTop.magFilter = THREE.NearestFilter;
snowblockTextureSide.magFilter = THREE.NearestFilter;
snowblockTextureTop.magFilter = THREE.NearestFilter;

// 块类型
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

// 指定块的名称, 对应的图标, 材质
export const blockLoader = {
	acaciaLeaves: {
		name: 'acaciaLeaves',
		block3d: acaciaLeaves3d,
		textureTypes: ['background'],
		textureImg: acaciaLeavesTexture,
		material: new THREE.MeshStandardMaterial({
			map: acaciaLeavesTexture,
			color: 0x00bb00,
			transparent: true,
		}),
		accessible: true,
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
		material: new THREE.MeshStandardMaterial({
			map: birchLeavesTexture,
			color: 0xffbb00,
			transparent: true,
		}),
		accessible: true,
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
		material: new THREE.MeshStandardMaterial({
			map: acaciaLeavesTexture,
			transparent: true,
		}),
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
		material: new THREE.MeshStandardMaterial({ map: iceTexture, color: 0x00698e, transparent: true, opacity: 0.3 }),
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
		material: new THREE.MeshStandardMaterial({ map: waterTexture, color: 0x00799e, transparent: true, opacity: 0.3 }),
		accessible: true,
	},
	acaciaWood: {
		name: 'acaciaWood',
		block3d: acaciaWood3d,
		textureTypes: ['background'],
		textureImg: [acaciaWoodTextureSide, acaciaWoodTextureSide, acaciaWoodTextureTop, acaciaWoodTextureTop, acaciaWoodTextureSide, acaciaWoodTextureSide],
	},
	birchWood: {
		name: 'birchWood',
		block3d: birchWood3d,
		textureTypes: ['background'],
		textureImg: [birchWoodTextureSide, birchWoodTextureSide, birchWoodTextureTop, birchWoodTextureTop, birchWoodTextureSide, birchWoodTextureSide],
	},
	cactus: {
		name: 'cactus',
		block3d: cactus3d,
		textureTypes: ['background'],
		textureImg: [cactusTextureSide, cactusTextureSide, cactusTextureTop, cactusTextureBottom, cactusTextureSide, cactusTextureSide],
	},
	chiseledSandstone: {
		name: 'chiseledSandstone',
		block3d: chiseledSandstone3d,
		textureTypes: ['background'],
		textureImg: [chiseledSandstoneTextureSide, chiseledSandstoneTextureSide, chiseledSandstoneTextureTop, chiseledSandstoneTextureTop, chiseledSandstoneTextureSide, chiseledSandstoneTextureSide],
	},
	dispenser: {
		name: 'dispenser',
		block3d: dispenser3d,
		textureTypes: ['background'],
		textureImg: [dispenserTextureSide, dispenserTextureSide, dispenserTextureTop, dispenserTextureTop, dispenserTextureSide, dispenserTextureSide],
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
		textureImg: [grassBlockTextureSide, grassBlockTextureSide, grassBlockTextureTop, dirtTexture, grassBlockTextureSide, grassBlockTextureSide],
	},
	mycelium: {
		name: 'mycelium',
		block3d: mycelium3d,
		textureTypes: ['background'],
		textureImg: [myceliumTextureSide, myceliumTextureSide, myceliumTextureTop, myceliumTextureTop, myceliumTextureSide, myceliumTextureSide],
	},
	podzol: {
		name: 'podzol',
		block3d: podzol3d,
		textureTypes: ['background'],
		textureImg: [podzolTextureSide, podzolTextureSide, podzolTextureTop, podzolTextureTop, podzolTextureSide, podzolTextureSide],
	},
	pumpkin: {
		name: 'pumpkin',
		block3d: pumpkin3d,
		textureTypes: ['background'],
		textureImg: [pumpkinTextureSide, pumpkinTextureSide, pumpkinTextureTop, pumpkinTextureTop, pumpkinTextureFont, pumpkinTextureSide],
	},
	redSandstone: {
		name: 'redSandstone',
		block3d: redSandstone3d,
		textureTypes: ['background'],
		textureImg: [redSandstoneTextureSide, redSandstoneTextureSide, redSandstoneTextureTop, redSandstoneTextureTop, redSandstoneTextureSide, redSandstoneTextureSide],
	},
	snowblock: {
		name: 'snowblock',
		block3d: snowblock3d,
		textureTypes: ['background'],
		textureImg: [snowblockTextureSide, snowblockTextureSide, snowblockTextureTop, snowblockTextureTop, snowblockTextureSide, snowblockTextureSide],
	},
};

// 为块生成材质
blockTypes.forEach(
	(d, i) =>
		blockLoader[d].material ||
		(blockLoader[d].material =
			blockLoader[d].textureImg instanceof Array ? blockLoader[d].textureImg.map(d => new THREE.MeshStandardMaterial({ map: d })) : new THREE.MeshStandardMaterial({ map: blockLoader[d].textureImg }))
);

// 块几何体
export const blockGeom = new THREE.BoxBufferGeometry(1, 1, 1);
// 云几何体
export const cloudGeom = new THREE.BoxBufferGeometry(4, 3, 6);
// 云材质
export const cloudMaterial = new THREE.MeshBasicMaterial({ color: 0x959595, opacity: 0.8, transparent: true });
// 两种类型树的[树干, 树叶]
export const treeTypes = [
	[38, 0],
	[39, 3],
];
// 高亮块
export const highLightBlockMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(1.05, 1.05, 1.05), new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.6, transparent: true }));
