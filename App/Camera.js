import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { sizesStore } from "./Utils/Store.js";
import { Pane } from "tweakpane";

import App from "./App.js";

export default class Camera {
  constructor() {
    this.app = new App();
    this.canvas = this.app.canvas;
    this.scene = this.app.scene;

    this.sizesStore = sizesStore;

    this.sizes = this.sizesStore.getState();

    this.setInstance();
    this.setControls();
    this.setResizeLister();

    this.initTweakpane();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      200
    );
    this.instance.position.set(11.5, -10, 19);
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    // this.controls.enabled = false;
    this.controls.minPolarAngle = 0 + 0.2; // prevent the camera from going over the top
    this.controls.maxPolarAngle = Math.PI / 2 + 1 // prevent the camera from going under the ground

    // Limit left-right movement
    this.controls.minAzimuthAngle = -Math.PI / 4; // radians
    this.controls.maxAzimuthAngle = Math.PI / 4; // radians
  }

  setResizeLister() {
    this.sizesStore.subscribe((sizes) => {
      this.instance.aspect = sizes.width / sizes.height;
      this.instance.updateProjectionMatrix();
    });
  }

  initTweakpane() {
    const container = document.getElementById('camera-pane-container');
    this.pane = new Pane({container});
    this.pane.addInput(this.instance.position, 'x', {min: 0, max: 20, step: 0.1});
    this.pane.addInput(this.instance.position, 'y', {min: -10, max: 10, step: 0.1});
    this.pane.addInput(this.instance.position, 'z', {min: -10, max: 30, step: 0.1});
  }


  loop() {
    this.controls.update();
  }
}
