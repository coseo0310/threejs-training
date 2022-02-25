<script setup lang="ts">
import { ref, onMounted } from "vue";
import Cube from "../services/three/cube";

const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (!canvas.value) {
    return;
  }
  const CubeInstance = new Cube(canvas.value);

  CubeInstance.setCamera({
    fov: 75,
    aspect: 2,
    neer: 0.1,
    far: 5,
    z: 2,
  });

  CubeInstance.setLight({ color: 0xffffff, intensity: 1 });

  CubeInstance.setCube([
    {
      boxWidth: 1,
      boxHeight: 1,
      boxDepth: 1,
      color: 0x44a88,
      x: 0,
    },
    {
      boxWidth: 1,
      boxHeight: 1,
      boxDepth: 1,
      color: 0x8844aa,
      x: -2,
    },
    {
      boxWidth: 1,
      boxHeight: 1,
      boxDepth: 1,
      color: 0xaa8844,
      x: 2,
    },
  ]);

  CubeInstance.render();
});
</script>

<template>
  <div id="container">
    <canvas id="c" ref="canvas"></canvas>
  </div>
</template>

<style scoped>
/* #container {
  width: 100vw;
  height: 100vh;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
} */
#c {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
