<template>
  <div id="app">
    <spin-wheel circle-size="20" item-size="5" :items="items" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SpinWheel from "./components/SpinWheel.vue";

@Component({
  components: {
    SpinWheel
  }
})
export default class App extends Vue {
  private items = ["Hello", "There", "General", "Kenobi", "It's", "Grevious"];
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
