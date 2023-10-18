import * as THREE from "three";
import App from "./App.js";
import { sizesStore } from "./Utils/SizesStore.js";
// import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
// import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
// import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { Pane } from "tweakpane";
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

export default class Renderer {
  constructor() {
    this.app = new App();
    this.canvas = this.app.canvas;
    this.camera = this.app.camera;
    this.scene = this.app.scene;
    this.sizesStore = sizesStore;
    this.sizes = this.sizesStore.getState();
    this.time = 0;

    this.setInstance();
    this.setResizeLister();
    this.initTweakpane();
    this.setupPostProcessing();
    // this.setupCSS3DRenderer();
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  setResizeLister() {
    this.sizesStore.subscribe((sizes) => {
      this.instance.setSize(sizes.width, sizes.height);
      this.instance.setPixelRatio(sizes.pixelRatio);
    });
  }

  initTweakpane() {
    // Initialize Pane
    const container = document.getElementById('renderer-pane-container');
    this.pane = new Pane({container});

    // Define parameters
    this.bloomParams = {
      threshold: 0.1,
      strength: 1.2,
      radius: 0.78,
    };

    // Bind parameters to UnrealBloomPass properties
    this.pane.addInput(this.bloomParams, 'threshold', {min: -2, max: 4, step: 0.01}).on('change', (value) => {
        this.bloomPass.threshold = value;
    });
    // this.pane.addInput(this.bloomParams, 'strength', {min: 0, max: 2, step: 0.01}).on('change', (value) => {
    //     this.bloomPass.strength = value;
    // });
    this.pane.addInput(this.bloomParams, 'radius', {min: 0, max: 4, step: 0.01}).on('change', (value) => {
        this.bloomPass.radius = value;
    });
  }

  setupPostProcessing() {
    const renderPass = new RenderPass(this.scene, this.camera.instance);
    renderPass.renderToScreen = true;

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight)
    );
    // Set any bloom pass parameters you need here
    // For example:
    this.bloomPass.threshold = this.bloomParams.threshold;
    this.bloomPass.strength = this.bloomParams.strength;
    this.bloomPass.radius = this.bloomParams.radius;

    this.composer = new EffectComposer(this.instance);
    this.composer.addPass(renderPass);
    this.composer.addPass(this.bloomPass);
    // this.scene.add(pane)
  }

  // setupCSS3DRenderer() {
  //   // Create CSS3DRenderer
  //   this.cssRenderer = new CSS3DRenderer();
  //   this.cssRenderer.setSize(window.innerWidth, window.innerHeight);
  //   // console.log(this.cssRenderer.domElement)
  //   document.getElementById('three').appendChild(this.cssRenderer.domElement);

  //   // Create iframe element
  //   const iframeElement = document.createElement('iframe');
  //   iframeElement.src = 'https://www.heds.app/';
  //   iframeElement.style.width = '640px';
  //   iframeElement.style.height = '360px';

  //   // Create CSS3DObject and set position
  //   this.cssObject = new CSS3DObject(iframeElement);
  //   this.cssObject.position.set(0, 0, 0); // Set the position where you want the iframe to appear
  //   this.scene.add(this.cssObject);
  // }

  loop() {
    this.time += 0.02; // Adjust the increment value to speed up or slow down the oscillation

    // // Update bloomPass strength with oscillating value between 0 and 1
    this.bloomPass.strength = (Math.sin(this.time) + 0.5) / 2;
    // this.instance.render(this.scene, this.camera.instance);
    this.bloomPass.threshold = this.bloomParams.threshold;
    // this.bloomPass.strength = this.bloomParams.strength;
    this.bloomPass.radius = this.bloomParams.radius;
    this.composer.render();
    // this.cssRenderer.render(this.scene, this.camera.instance);
    // this.instance.render(this.scene, this.camera.instance)
  }
}
