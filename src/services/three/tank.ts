import * as THREE from "three";
import Utils from "./shared/utils";

type Targets = {
  targetOrbit: THREE.Object3D;
  targetBob: THREE.Object3D;
  targetMesh: THREE.Mesh;
  targetMaterial: THREE.MeshPhongMaterial;
} | null;

type Vectors = {
  targetPosition: THREE.Vector3;
  tankPosition: THREE.Vector2;
  tankTarget: THREE.Vector2;
};

export default class Tank extends Utils {
  private renderer: THREE.WebGLRenderer;
  private cameras: {
    name: "camera" | "turretCamera" | "targetCamera" | "tankCamera";
    cam: THREE.PerspectiveCamera;
    desc: string;
  }[] = [];
  private scene: THREE.Scene;
  private targets: Targets = null;
  private vectors: Vectors;
  private curve: THREE.SplineCurve;
  private tank: THREE.Object3D;
  private turretPivot: THREE.Object3D;
  private targetCameraPivot: THREE.Object3D;
  private infoEl: HTMLDivElement;
  private wheelMeshes: THREE.Mesh<
    THREE.CylinderGeometry,
    THREE.MeshPhongMaterial
  >[] = [];

  constructor(canvas: HTMLCanvasElement, info: HTMLDivElement) {
    super();
    this.infoEl = info;
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    this.renderer.setClearColor(0xaaaaaa);
    this.renderer.shadowMap.enabled = true;
    this.scene = new THREE.Scene();
    this.vectors = {
      targetPosition: new THREE.Vector3(),
      tankPosition: new THREE.Vector2(),
      tankTarget: new THREE.Vector2(),
    };

    this.curve = new THREE.SplineCurve([
      new THREE.Vector2(-10, 0),
      new THREE.Vector2(-5, 5),
      new THREE.Vector2(0, 0),
      new THREE.Vector2(5, -5),
      new THREE.Vector2(10, 0),
      new THREE.Vector2(5, 10),
      new THREE.Vector2(-5, 10),
      new THREE.Vector2(-10, -10),
      new THREE.Vector2(-15, 8),
      new THREE.Vector2(-10, 0),
    ]);
    this.tank = new THREE.Object3D();
    this.turretPivot = new THREE.Object3D();
    this.targetCameraPivot = new THREE.Object3D();
  }

  makeCamera(fov: number = 40) {
    const aspect = 2;
    const zNear = 0.1;
    const zFar = 1000;
    return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
  }

  setLight() {
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(0, 20, 0);
    this.scene.add(light1);
    light1.castShadow = true;
    light1.shadow.mapSize.width = 2048;
    light1.shadow.mapSize.height = 2048;

    const d = 50;
    light1.shadow.camera.left = -d;
    light1.shadow.camera.right = d;
    light1.shadow.camera.top = d;
    light1.shadow.camera.bottom = -d;
    light1.shadow.camera.near = 1;
    light1.shadow.camera.far = 50;
    light1.shadow.bias = 0.001;

    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(1, 2, 4);
    this.scene.add(light2);
  }

  setGround() {
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xcc8866 });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = Math.PI * -0.5;
    groundMesh.receiveShadow = true;
    this.scene.add(groundMesh);
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

  setTank() {
    const camera = this.makeCamera(40);
    camera.position.set(8, 4, 10).multiplyScalar(3);
    camera.lookAt(0, 0, 0);

    const carWidth = 4;
    const carHeight = 1;
    const carLength = 8;

    // const tank = new THREE.Object3D();
    this.scene.add(this.tank);

    const bodyGeometry = new THREE.BoxGeometry(carWidth, carHeight, carLength);
    const bodyMertaial = new THREE.MeshPhongMaterial({ color: 0x6688aa });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMertaial);
    bodyMesh.position.y = 1.4;
    bodyMesh.castShadow = true;
    this.tank.add(bodyMesh);

    const tankCameraFov = 75;
    const tankCamera = this.makeCamera(tankCameraFov);
    tankCamera.position.y = 3;
    tankCamera.position.z = -6;
    tankCamera.rotation.y = Math.PI;
    bodyMesh.add(tankCamera);

    const wheelRadius = 1;
    const wheelThickness = 0.5;
    const wheelSegments = 6;
    const wheelGeometry = new THREE.CylinderGeometry(
      wheelRadius, // top radius
      wheelRadius, // bottom radius
      wheelThickness, // height of cylinder
      wheelSegments
    );

    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const wheelPositions = [
      [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, carLength / 3],
      [carWidth / 2 + wheelThickness / 2, -carHeight / 2, carLength / 3],
      [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, 0],
      [carWidth / 2 + wheelThickness / 2, -carHeight / 2, 0],
      [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, -carLength / 3],
      [carWidth / 2 + wheelThickness / 2, -carHeight / 2, -carLength / 3],
    ];

    this.wheelMeshes = wheelPositions.map((position) => {
      const mesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
      mesh.position.set(position[0], position[1], position[2]);
      mesh.rotation.z = Math.PI * 0.5;
      bodyMesh.add(mesh);
      return mesh;
    });

    const domeRadius = 2;
    const domeWidthSubdivisions = 12;
    const domeHeightSubdivisions = 12;
    const domePhiStart = 0;
    const domePhiend = Math.PI * 2;
    const domeThetaStart = 0;
    const domeThetaEnd = Math.PI * 0.5;
    const domeGeometry = new THREE.SphereGeometry(
      domeRadius,
      domeWidthSubdivisions,
      domeHeightSubdivisions,
      domePhiStart,
      domePhiend,
      domeThetaStart,
      domeThetaEnd
    );
    const domeMesh = new THREE.Mesh(domeGeometry, bodyMertaial);
    domeMesh.castShadow = true;
    bodyMesh.add(domeMesh);
    domeMesh.position.y = 0.5;

    const turretWidth = 0.1;
    const turretHeight = 0.1;
    const turretLength = carLength * 0.75 * 0.2;
    const turretGeometry = new THREE.BoxGeometry(
      turretWidth,
      turretHeight,
      turretLength
    );

    const turretMesh = new THREE.Mesh(turretGeometry, bodyMertaial);
    // const turretPivot = new THREE.Object3D();
    turretMesh.castShadow = true;
    this.turretPivot.scale.set(5, 5, 5);
    this.turretPivot.position.y = 0.5;
    turretMesh.position.z = turretLength * 0.5;
    this.turretPivot.add(turretMesh);
    bodyMesh.add(this.turretPivot);

    const turretCamera = this.makeCamera();
    turretCamera.position.y = 0.75 * 0.2;
    turretMesh.add(turretCamera);

    const targetGeometry = new THREE.SphereGeometry(0.5, 6, 3);
    const targetMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      flatShading: true,
    });
    const targetMesh = new THREE.Mesh(targetGeometry, targetMaterial);
    const targetOrbit = new THREE.Object3D();
    const targetElevation = new THREE.Object3D();
    const targetBob = new THREE.Object3D();
    targetMesh.castShadow = true;
    this.scene.add(targetOrbit);
    targetOrbit.add(targetElevation);
    targetElevation.position.z = carLength * 2;
    targetElevation.position.y = 8;
    targetElevation.add(targetBob);
    targetBob.add(targetMesh);
    this.targets = {
      targetOrbit,
      targetBob,
      targetMesh,
      targetMaterial,
    };

    const targetCamera = this.makeCamera();
    // const targetCameraPivot = new THREE.Object3D();
    targetCamera.position.y = 1;
    targetCamera.position.z = -2;
    targetCamera.rotation.y = Math.PI;
    targetBob.add(this.targetCameraPivot);
    this.targetCameraPivot.add(targetCamera);

    // Create a sine-like wave

    const points = this.curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xf0000 });
    const splineObject = new THREE.Line(geometry, material);
    splineObject.rotation.x = Math.PI * 0.5;
    splineObject.position.y = 0.05;
    this.scene.add(splineObject);

    this.cameras = [
      { name: "camera", cam: camera, desc: "detached camea" },
      {
        name: "turretCamera",
        cam: turretCamera,
        desc: "on turret looking at target",
      },
      {
        name: "targetCamera",
        cam: targetCamera,
        desc: "near target looking at tank",
      },
      { name: "tankCamera", cam: tankCamera, desc: "about back of tank" },
    ];
  }

  render(time: number = 0) {
    time *= 0.001;

    let cams: {
      [k in
        | "camera"
        | "turretCamera"
        | "targetCamera"
        | "tankCamera"]: THREE.PerspectiveCamera | null;
    } = {
      camera: null,
      turretCamera: null,
      targetCamera: null,
      tankCamera: null,
    };

    if (this.resizeRendererToDisplaySize()) {
      const canvas = this.renderer.domElement;
      this.cameras.forEach((cameraInfo) => {
        const camera = cameraInfo.cam;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        cams[cameraInfo.name] = camera;
      });
    }

    if (!this.targets) {
      return;
    }
    const { targetOrbit, targetBob, targetMesh, targetMaterial } = this.targets;
    const { tankPosition, tankTarget, targetPosition } = this.vectors;
    // move target
    targetOrbit.rotation.y = time * 0.27;
    targetBob.position.y = Math.sin(time * 2) * 4;
    targetMesh.rotation.x = time * 7;
    targetMesh.rotation.y = time * 13;
    targetMaterial.emissive.setHSL((time * 10) % 1, 1, 0.25);
    targetMaterial.color.setHSL((time * 10) % 1, 1, 0.25);

    // move tank
    const tankTime = time * 0.05;
    this.curve.getPointAt(tankTime % 1, tankPosition);
    this.curve.getPointAt((tankTime + 0.01) % 1, tankTarget);
    this.tank.position.set(tankPosition.x, 0, tankPosition.y);
    this.tank.lookAt(tankTarget.x, 0, tankTarget.y);

    // face turret at target
    targetMesh.getWorldPosition(targetPosition);
    this.turretPivot.lookAt(targetPosition);

    // make the turretCamera look at target
    cams.turretCamera?.lookAt(targetPosition);

    // make the targetCameraPivot look at the at the tank
    this.tank.getWorldPosition(targetPosition);
    this.targetCameraPivot.lookAt(targetPosition);

    this.wheelMeshes.forEach((obj) => {
      obj.rotation.x = time * 3;
    });

    const camera = this.cameras[(time * 0.25) % this.cameras.length | 0];

    this.infoEl.textContent = camera.desc;

    this.renderer.render(this.scene, camera.cam);

    requestAnimationFrame(this.render.bind(this));
  }
}
