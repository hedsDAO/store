import { createStore } from "zustand/vanilla";

const assetsToLoad = [
  // {
  //   path: "/textures/2k_earth_daymap.jpg",
  //   id: "earth",
  //   type: "texture",
  // },
  // {
  //   path: "/textures/2k_mars.jpg",
  //   id: "mars",
  //   type: "texture",
  // },
  {
    path: "./hedstext.gltf",
    id: "sign",
    type: "model",
  },
  {
    // path: "cubeMap/",
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
