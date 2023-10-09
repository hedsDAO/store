import * as THREE from 'three'
import assetStore from '../Utils/AssetStore.js'
// import { Pane } from 'tweakpane'

import App from '../App.js'
import { Vector3 } from 'three'

export default class World{
    constructor() {
        this.app = new App()
        this.scene = this.app.scene
        this.hedLoaded = false;
        this.initTweakpane();

        assetStore.subscribe(
            state => {
              this.hed = state.loadedAssets.hed;
              this.sign = state.loadedAssets.sign;
              
              if (state.loadedAssets.hed && !this.hedLoaded && this.sign.scene) {
                this.sign.scene.children[0].position.set(0,5.5,0);
                this.sign.scene.children[0].scale.set(3,3,3)
                this.scene.add(this.hed.scene);
                this.scene.add(this.sign.scene);
                this.scene.background = state.loadedAssets.background
                this.initGlobe();
                this.enableWireframe(this.hed);
                this.hedLoaded = true; 
              }
            },
            state => state.loadedAssets
          );

        // this.initGlobe();
        this.oscillationSpeed = 0.001;
        this.oscillationDistance = 15
        this.setLights();
        this.loop()
    }

    initTweakpane() {
      // Initialize Tweakpane
      // this.pane = new Pane();

      // Create an object to hold the parameters
      this.params = {
          globeX: 0,
          globeY: 0,
          globeZ: 0
      };

      // // Add parameters to Tweakpane
      // this.pane.addInput(this.params, 'globeX').on('change', (value) => {
      //     if (this.globe) this.globe.position.x = value;
      // });
      // this.pane.addInput(this.params, 'globeY').on('change', (value) => {
      //     if (this.globe) this.globe.position.y = value;
      // });
      // this.pane.addInput(this.params, 'globeZ').on('change', (value) => {
      //     if (this.globe) this.globe.position.z = value;
      // });
  }

    setLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(directionalLight);
    }

    initGlobe() {
      // Create globe geometry and material
      const globeGeometry = new THREE.SphereGeometry(1, 32, 32); // Adjust size as needed
       globeGeometry.scale = new Vector3(4,4,4);

      const globeMaterial = new THREE.MeshStandardMaterial({color: "green", roughness: 0.8, metalness: 0.2});
      const globalMaterial2 = new THREE.MeshStandardMaterial({color: "blue", roughness: 0.8, metalness: 0.2});

      // Create globe mesh
      this.globe = new THREE.Mesh(globeGeometry, globeMaterial);
      this.globe2 = new THREE.Mesh(globeGeometry, globalMaterial2);
      this.globe2.position.set(this.params.globeX + 10, this.params.globeY - 10, this.params.globeZ + 5);
      this.globe.position.set(this.params.globeX, this.params.globeY, this.params.globeZ);
      this.globeInitialPositionZ = this.globe.position.z;
      this.globeInitialPositionX = this.globe.position.x;
      // Add globe to scene
      this.scene.add(this.globe);
      this.scene.add(this.globe2);
  }

    enableWireframe(object) {
      object.scene.traverse((node) => {
          if (node.isMesh) {
              if (Array.isArray(node.material)) {
                  // Handle meshes with multiple materials
                  node.material.forEach((material) => {
                      material.wireframe = true;
                      // material.color = new THREE.Color(0xb3ffff);
                  });
              } else {
                  // Handle meshes with a single material
                  node.material.wireframe = true;
                  node.material.color = new THREE.Color(0xb3ffff);
              }
          }
      });
  }

    loop() {

    //   if (this.globe && this.globe2) {
    //     const time = Date.now() * 0.001; // Get time for oscillation
    //     this.globe.position.x = this.params.globeX;
    //     this.globe.position.y = this.params.globeY;
    //     this.globe.position.z = this.globeInitialPosition + Math.sin(this.oscillationSpeed * time) * this.oscillationDistance + this.params.globeZ;
    //     this.globe2.position.x = this.params.globeX + 5;
    //     this.globe2.position.y = this.params.globeY - 5;
    //     this.globe2.position.z = this.globeInitialPosition + Math.sin(this.oscillationSpeed * time) * this.oscillationDistance + this.params.globeZ;
    //     // console.log(this.globe2.position)
    // }

      if (this.hed) {
        this.globe.position.z = this.globeInitialPositionZ + Math.sin(this.oscillationSpeed * Date.now()) * this.oscillationDistance;
        this.globe.position.x = this.globeInitialPositionX + Math.cos(this.oscillationSpeed * Date.now()) * this.oscillationDistance;
        this.globe2.position.z = this.globeInitialPositionZ + Math.sin((this.oscillationSpeed - .0002) * Date.now()) * this.oscillationDistance;
        this.globe2.position.x = this.globeInitialPositionX + Math.cos((this.oscillationSpeed- .0002) * Date.now()) * this.oscillationDistance;
        this.hed.scene.traverse((node) => {
            if (node.isMesh && node.material.color.equals(new THREE.Color(0xb3ffff))) {
                node.rotation.z += 0.01; // Adjust the value for different rotation speed
            }
        });
    }
        // this.cubeMesh.rotation.y += 0.01


    }
}