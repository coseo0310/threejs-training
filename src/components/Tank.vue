<script setup lang="ts">
import { ref, onMounted } from "vue";
import Tank from "../services/three/tank";

const canvas = ref<HTMLCanvasElement | null>(null);
const info = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!canvas.value || !info.value) {
    return;
  }
  const TankInstance = new Tank(canvas.value, info.value);
  TankInstance.setLight();
  TankInstance.setGround();
  TankInstance.setTank();
  TankInstance.render();
});
</script>

<template>
  <div id="container">
    <div id="info" ref="info"></div>
    <canvas id="c" ref="canvas"></canvas>
  </div>
</template>

<style scoped>
#container {
  display: flex;
  justify-content: center;
  /* align-items: center; */
}

#c {
  width: 100%;
  height: 100%;
  display: block;
}
#info {
  position: absolute;
  background-color: transparent;
  color: #fff;
  padding: 10px;
  border: 1px solid #fff;
  border-radius: 5px;
  margin: 10px;
}
</style>
