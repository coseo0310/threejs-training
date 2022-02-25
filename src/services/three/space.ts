import * as THREE from "three";
import Utils from "./shared/utils";

export default class Three extends Utils {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera | null;
  private renderer: THREE.WebGLRenderer;
  private width: number;
  private height: number;
  private ratio: number;
  private mouseX: number = 0;
  private mouseY: number = 0;

  constructor(width: number, height: number, ratio: number) {
    super();
    this.width = width;
    this.height = height;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.ratio = ratio;
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(this.ratio, 2));
    this.renderer.setClearColor(new THREE.Color("#21282a"), 1);
  }

  updateSize(width: number, height: number, ratio: number) {
    this.width = width;
    this.height = height;
    this.ratio = ratio;
  }

  updateCamera() {
    if (!this.camera) {
      return;
    }
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  updateRender() {
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(this.ratio, 2));
  }

  updateMouse(mouseX: number, mouseY: number) {
    this.mouseX = mouseX;
    this.mouseY = mouseY;
  }

  setSpace() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      100
    );
    this.camera.position.z = 2;
    this.scene.add(this.camera);
    const geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);
    const material = new THREE.PointsMaterial({
      size: 0.005,
      color: 0x87a7ca,
    });
    const sphere = new THREE.Points(geometry, material);
    this.scene.add(sphere);

    //particle
    const particlesGeometry = new THREE.BufferGeometry();
    const loader = new THREE.TextureLoader();
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d")!;
    canvas.height = 100;
    canvas.width = 100;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(50, 50, 25, 0, 2 * Math.PI);
    ctx.fill();
    let img = canvas.toDataURL("./star.png");
    const star = loader.load(img);
    const particlesmaterial = new THREE.PointsMaterial({
      size: 0.01,
      map: star,
      transparent: true,
    });
    const particlesCnt = 2000;
    const posArray = new Float32Array(particlesCnt * 3);
    // xyz,xyz,xyz , xyz
    for (let i = 0; i < particlesCnt * 3; i++) {
      //posArray[i] = Math.random()
      //   posArray[i] = Math.random() - 0.5
      //   posArray[i] = (Math.random() - 0.5) * 5
      posArray[i] = (Math.random() - 0.5) * (Math.random() * 5);
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesmaterial
    );
    this.scene.add(particlesMesh);

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      // 경과시간

      sphere.rotation.y = 0.5 * elapsedTime;
      //도넛형 도형의 y축을 회전
      particlesMesh.rotation.y = -1 * (elapsedTime * 0.1);
      //별들이 경과시간마다 음의 방향으로 이동
      if (this.mouseX > 0) {
        particlesMesh.rotation.x = -this.mouseY * (elapsedTime * 0.00008);
        particlesMesh.rotation.y = -this.mouseX * (elapsedTime * 0.00008);
      }

      this.renderer.render(this.scene, this.camera!);
    };
    animate();
  }

  getDomElement() {
    return this.renderer.domElement;
  }
}
