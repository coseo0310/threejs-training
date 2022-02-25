<script setup lang="ts">
import { ref } from "vue";
import Space from "./components/Space.vue";
import SceneGraph from "./components/SceneGraph.vue";
import Cube from "./components/Cube.vue";
import Tank from "./components/Tank.vue";

type State = "space" | "cube" | "graph" | "tank";

const state = ref<State>("tank");

const onClick = (s: State) => {
  state.value = s;
};
</script>

<template>
  <header id="header">
    <button class="btn" @click="onClick('cube')">Cube</button>
    <button class="btn" @click="onClick('graph')">Graph</button>
    <button class="btn" @click="onClick('space')">Space</button>
    <button class="btn" @click="onClick('tank')">Tank</button>
  </header>
  <Cube v-if="state === 'cube'" />
  <Space v-if="state === 'space'" />
  <SceneGraph v-if="state === 'graph'" />
  <Tank v-if="state === 'tank'" />
</template>

<style>
body {
  margin: 0;
}

#header {
  background-color: transparent;
  position: absolute;
}

.btn {
  background-color: transparent;
  border: none;
  color: white;
  padding: 10px;
  cursor: pointer;
  font-size: 1.1rem;
  margin: 5px 0;
}
</style>
