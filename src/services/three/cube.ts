import * as THREE from "three";
import Utils from "./shared/utils";

type CubeProps = {
  boxWidth: number;
  boxHeight: number;
  boxDepth: number;
  color: number;
  x: number;
};

type CameraProps = {
  fov: number;
  aspect: number;
  neer: number;
  far: number;
  z: number;
};

type LightProps = {
  color: number;
  intensity: number;
};

export default class Cube extends Utils {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.DirectionalLight;
  private cubes: THREE.Mesh[];

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.camera = new THREE.PerspectiveCamera(75, 2, 0.1, 5);
    this.camera.position.z = 2;
    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.scene = new THREE.Scene();
    this.cubes = [];
  }

  setCamera({ fov, aspect, neer, far, z }: CameraProps) {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, neer, far);
    this.camera.position.z = z;
  }

  setLight({ color, intensity }: LightProps) {
    this.light = new THREE.DirectionalLight(color, intensity);
    this.scene.add(this.light);
  }

  setCube(cubeProps: CubeProps[]) {
    cubeProps.forEach(({ boxWidth, boxHeight, boxDepth, color, x }) => {
      const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
      const meterial = new THREE.MeshPhongMaterial({ color });
      const cube = new THREE.Mesh(geometry, meterial);
      cube.position.x = x;
      this.scene.add(cube);
      this.cubes.push(cube);
    });
  }

  resizeRendererToDisplaySize() {
    const canvas = this.renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = (canvas.clientWidth * pixelRatio) | 0;
    const height = (canvas.clientHeight * pixelRatio) | 0;
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
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }

    this.cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });
    this.light.position.set(-1, 2, 4);
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render.bind(this));
  }
}
