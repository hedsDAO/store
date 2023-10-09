import * as THREE from 'three'
import assetStore from '../Utils/AssetStore.js'

import App from '../App.js'

export default class World{
    constructor() {
        this.app = new App()
        this.scene = this.app.scene
        this.storefrontAdded = false;

        assetStore.subscribe(
            state => {
              if (state.loadedAssets.storefront && !this.storefrontAdded) {
                this.scene.add(state.loadedAssets.storefront.scene);
                this.storefrontAdded = true; 
              }
            },
            state => state.loadedAssets
          );

        // this.setCube()
        this.setLights();
        this.loop()
    }

    setLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(directionalLight);
    }

    loop() {

        // this.cubeMesh.rotation.y += 0.01


    }
}