import * as THREE from "three";
import Utils from "./shared/utils";
import AxisGridHelper from "./shared/axis-grid-helper";
import { GUI } from "lil-gui";

type CameraProps = {
  fov: number;
  aspect: number;
  near: number;
  far: number;
};

type LightProps = {
  color: number;
  intensity: number;
};

export default class Graph extends Utils {
  private objects:
    | THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhongMaterial>[] &
        THREE.Object3D<THREE.Event>[];
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private gui: GUI;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, 2, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.objects = [];
    this.gui = new GUI();
  }

  setCamera({ fov, aspect, near, far }: CameraProps) {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, 50, 0);
    this.camera.up.set(0, 0, 1);
    this.camera.lookAt(0, 0, 0);
  }

  setLight({ color, intensity }: LightProps) {
    const light = new THREE.PointLight(color, intensity);
    this.scene.add(light);
  }

  setObject() {
    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6;
    const sphereGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    );

    const solarSystem = new THREE.Object3D();
    this.scene.add(solarSystem);
    this.objects.push(solarSystem);

    const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5);
    solarSystem.add(sunMesh);
    this.objects.push(sunMesh);

    const earthOrbit = new THREE.Object3D();
    earthOrbit.position.x = 10;
    solarSystem.add(earthOrbit);
    this.objects.push(earthOrbit);

    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
    });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    earthOrbit.add(earthMesh);
    this.objects.push(earthMesh);

    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.x = 2;
    earthOrbit.add(moonOrbit);

    const moonMaterial = new THREE.MeshPhongMaterial({
      color: 0x888888,
      emissive: 0x222222,
    });
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonMesh.scale.set(0.5, 0.5, 0.5);
    moonOrbit.add(moonMesh);
    this.objects.push(moonMesh);

    this.makeAxesGrid(solarSystem, "solarSystem", 26);
    this.makeAxesGrid(sunMesh, "sunMesh");
    this.makeAxesGrid(earthOrbit, "earthOrbit");
    this.makeAxesGrid(earthMesh, "earthMesh");
    this.makeAxesGrid(moonOrbit, "moonOrbit");
    this.makeAxesGrid(moonMesh, "moonMesh");
  }

  resizeRendererToDisplaySize() {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      this.renderer.setSize(width, height, false);
    }
    return needResize;
  }

  render(time: number = 0) {
    time *= 0.001;

    if (this.resizeRendererToDisplaySize()) {
      const canvas = this.renderer.domElement;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    }

    this.objects.forEach((obj) => {
      obj.rotation.y = time;
    });

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render.bind(this));
  }

  setAxesHelper() {
    this.objects.forEach((node) => {
      const axes = new THREE.AxesHelper();
      let material = axes.material as THREE.Material;
      material["depthTest"] = false;
      axes.renderOrder = 1;
      node.add(axes);
    });
  }

  makeAxesGrid(
    node:
      | THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhongMaterial>
      | THREE.Object3D<THREE.Event>,
    label: string,
    units?: number
  ) {
    const helper = new AxisGridHelper(node, units);
    this.gui.add(helper, "visible").name(label);
  }
}
