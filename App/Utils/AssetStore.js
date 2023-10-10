import { createStore } from "zustand/vanilla";

const assetsToLoad = [
  {
    path: "space-cruiser-panels2",
    id: "cruiser",
    type: "texture",
    textureNames: ['albedo', 'ao', 'height', 'metallic', 'normal-ogl', 'roughness']
  },
  {
    path: "space-ship-monitor",
    id: "monitor",
    type: "texture",
    textureNames: ['albedo', 'ao', 'height', 'metallic', 'normal-ogl', 'roughness']
  },
  {
    path: "spaceship-panels",
    id: "panels",
    type: "texture",
    textureNames: ['albedo', 'ao', 'height', 'metallic', 'roughness']
  },
  {
    path: "./hedstext.gltf",
    id: "sign",
    type: "model",
  },
  {
    id: "background",
    type: "cubeMap",
  },
  {
    path: "./genhead.gltf",
    id: "hed",
    type: "model",
  }
];

const assetStore = createStore((set) => ({
  assetsToLoad,
  loadedAssets: {},
  addLoadedAsset: (asset, id) =>
    set((state) => ({
      loadedAssets: {
        ...state.loadedAssets,
        [id]: asset,
      },
    })),
}));

export default assetStore;
