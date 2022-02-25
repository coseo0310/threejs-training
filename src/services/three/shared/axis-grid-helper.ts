import * as THREE from "three";

export default class AxisGridHelper {
  private grid: THREE.GridHelper;
  private axes: THREE.AxesHelper;
  private _visible: boolean = false;

  constructor(
    node:
      | THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhongMaterial>
      | THREE.Object3D<THREE.Event>,
    units = 10
  ) {
    const axes = new THREE.AxesHelper();
    let material = axes.material as THREE.Material;
    material.depthTest = false;
    axes.renderOrder = 2; // after the grid
    node.add(axes);

    const grid = new THREE.GridHelper(units, units);
    const material2 = grid.material as THREE.Material;
    material2.depthTest = false;
    grid.renderOrder = 1;
    node.add(grid);

    this.grid = grid;
    this.axes = axes;
    this.visible = false;
  }
  get visible() {
    return this._visible;
  }
  set visible(v: boolean) {
    this._visible = v;
    this.grid.visible = v;
    this.axes.visible = v;
  }
}
