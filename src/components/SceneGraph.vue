<script setup lang="ts">
import { ref, onMounted } from "vue";
import SceneGraph from "../services/three/graph";

const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (!canvas.value) {
    return;
  }
  const GraphInstance = new SceneGraph(canvas.value);

  GraphInstance.setCamera({ fov: 40, aspect: 2, near: 0.1, far: 1000 });
  GraphInstance.setLight({ color: 0xffffff, intensity: 3 });
  GraphInstance.setObject();

  GraphInstance.render();
});
</script>

<template>
  <div id="container">
    <canvas id="c" ref="canvas"></canvas>
  </div>
</template>

<style scoped>
#c {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
