<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import Three from "../services/three/space";

const el = ref<HTMLDivElement | null>(null);

const ThreeInstence = new Three(
  window.innerWidth,
  window.innerHeight,
  window.devicePixelRatio
);

const resize = () => {
  ThreeInstence.updateSize(
    window.innerWidth,
    window.innerHeight,
    window.devicePixelRatio
  );
  ThreeInstence.updateCamera();
  ThreeInstence.updateRender();
};

const mousemove = (event: MouseEvent) => {
  ThreeInstence.updateMouse(event.clientX, event.clientY);
};

onMounted(() => {
  if (el.value) {
    el.value.appendChild(ThreeInstence.getDomElement());
    if (ThreeInstence.isWebGLAvailable()) {
      ThreeInstence.setSpace();
      window.addEventListener("resize", resize);
      window.addEventListener("mousemove", mousemove);
    } else {
      console.log("WebGL not support!!");
    }
  }
});

onUnmounted(() => {
  el.value = null;
  window.removeEventListener("resize", resize);
  window.removeEventListener("mousemove", mousemove);
});
</script>

<template>
  <div ref="el"></div>
</template>

<style scoped></style>
