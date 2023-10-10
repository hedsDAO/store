import * as THREE from "three";
import assetStore from "../Utils/AssetStore.js";
// import { Pane } from 'tweakpane';

import App from "../App.js";
import { Vector3 } from "three";

export default class World {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.hedLoaded = false;
    this.initTweakpane();

    assetStore.subscribe(
      (state) => {
        this.hed = state.loadedAssets.hed;
        this.sign = state.loadedAssets.sign;
        // console.log(this.hed)
        this.loadedAssets = state.loadedAssets;

        const isFinishedLoading = Object.keys(state.loadedAssets).length === 20;
        // console.log({assetsToLoad: state.assetsToLoad.length, loadedAssets: Object.keys(state.loadedAssets).length})
        // console.log(isFinishedLoading)

        if (isFinishedLoading && this.sign.scene ) {
          this.sign.scene.children[0].position.set(0, 2, 0);
          this.sign.scene.children[0].scale.set(3.5, 3.5, 3.5);
          this.sign.scene.children[0].material.side = THREE.DoubleSide;
          this.hed.scene.position.set(0, -5, 0);
          this.hed.scene.scale.set(1.25, 1.25, 1.25);
          this.scene.add(this.hed.scene);
          this.scene.add(this.sign.scene);
          this.scene.background = state.loadedAssets.background;
          this.enableWireframe(this.hed);
          this.hedLoaded = true;
          this.initGlobe();
        }
      },
      (state) => state.loadedAssets
    );

    // this.initGlobe();
    this.oscillationSpeed = 0.0015;
    this.oscillationDistance = 5;
    this.setLights();
    this.loop();
  }

  initTweakpane() {
    // Initialize Tweakpane
    // const container = document.getElementById('world-pane-container');
    // this.pane = new Pane({container});

    // Create an object to hold the parameters
    this.params = {
      globeX: 0,
      globeY: 0,
      globeZ: 0,
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

    const directionalLight = new THREE.DirectionalLight(0xffffff, 6);
    directionalLight.position.set(10, 10, 10);
    this.scene.add(directionalLight);
  }

  getMaterialTextures(prefix) {
    return prefix === 'monitor' ? {
      // roughness: 0.8,
      // metalness: 0.2,
      wireframe: true,
      map: this.loadedAssets[`${prefix}-albedo`],
      aoMap: this.loadedAssets[`${prefix}-ao`],
      // displacementMap: this.loadedAssets[`${prefix}-height`],
      metalnessMap: this.loadedAssets[`${prefix}-metallic`],
      // normalMap: this.loadedAssets[`${prefix}-normal-ogl`],
      roughnessMap: this.loadedAssets[`${prefix}-roughness`]
    } :
    {
      // roughness: 0.8,
      // metalness: 0.2,
      color: prefix === 'panels' ? new THREE.Color(0x3d85c6) : new THREE.Color(0x67c25a),
      wireframe: true,
      map: this.loadedAssets[`${prefix}-albedo`],
      aoMap: this.loadedAssets[`${prefix}-ao`],
      // displacementMap: this.loadedAssets[`${prefix}-height`],
      metalnessMap: this.loadedAssets[`${prefix}-metallic`],
      // normalMap: this.loadedAssets[`${prefix}-normal-ogl`],
      roughnessMap: this.loadedAssets[`${prefix}-roughness`]
    }
  }

  initGlobe() {
    // Create globe geometry and material
    const globeGeometry = new THREE.SphereGeometry(0.35, 32, 32); // Adjust size as needed
    // globeGeometry.scale = new Vector3(.1, .1, .1);
    const cruiserTextures = this.getMaterialTextures('cruiser');
    const panelTextures = this.getMaterialTextures('panels');
    const monitorTextures = this.getMaterialTextures('monitor');
    // console.log(panelTextures)
    const globeMaterial = new THREE.MeshStandardMaterial(cruiserTextures);
    const globeMaterial2 = new THREE.MeshStandardMaterial(panelTextures);
    const globeMaterial3 = new THREE.MeshStandardMaterial(monitorTextures);

    // Create globe mesh
    this.globe = new THREE.Mesh(globeGeometry, globeMaterial);
    this.globe2 = new THREE.Mesh(globeGeometry, globeMaterial2);
    this.globe3 = new THREE.Mesh(globeGeometry, globeMaterial3);
    this.globe3.position.set(
      this.params.globeX + 10,
      this.params.globeY - 6,
      this.params.globeZ + 5
    );
    this.globe2.position.set(
      this.params.globeX + 10,
      this.params.globeY - 3,
      this.params.globeZ + 5
    );
    this.globe.position.set(
      this.params.globeX,
      this.params.globeY,
      this.params.globeZ
    );
    this.globeInitialPositionZ = this.globe.position.z;
    this.globeInitialPositionX = this.globe.position.x;
    // Add globe to scene
    this.scene.add(this.globe);
    this.scene.add(this.globe2);
    this.scene.add(this.globe3)
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
    if (this.hed && this.globe) {
        const time = Date.now();
  
        // Phase offsets for each globe
        const phaseOffset1 = 0; // No offset for the first globe
        const phaseOffset2 = Math.PI / 2; // Start at a different point for the second globe
        const phaseOffset3 = Math.PI; // Start at another different point for the third globe
  
        // Oscillation calculations with phase offsets
        this.globe.position.z = this.globeInitialPositionZ + Math.sin(this.oscillationSpeed * time + phaseOffset1) * this.oscillationDistance;
        this.globe.position.x = this.globeInitialPositionX + Math.cos(this.oscillationSpeed * time + phaseOffset1) * this.oscillationDistance;
  
        this.globe2.position.z = this.globeInitialPositionZ + Math.sin(this.oscillationSpeed * time + phaseOffset2) * this.oscillationDistance;
        this.globe2.position.x = this.globeInitialPositionX + Math.cos(this.oscillationSpeed * time + phaseOffset2) * this.oscillationDistance;
  
        this.globe3.position.z = this.globeInitialPositionZ + Math.sin(this.oscillationSpeed * time + phaseOffset3) * this.oscillationDistance;
        this.globe3.position.x = this.globeInitialPositionX + Math.cos(this.oscillationSpeed * time + phaseOffset3) * this.oscillationDistance;
  
        this.hed.scene.traverse((node) => {
          if (node.isMesh && node.material.color.equals(new THREE.Color(0xb3ffff))) {
            node.rotation.z += 0.001;
          }
        });
      }
  }
}
