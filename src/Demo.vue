<template>
  <div id="demo">
    <spin-wheel v-slot="{ angle }" class="flower">
      <spin-circle :gravity="gravity" :items="items">

        <template v-slot:bubble="{ item }">
          <spin-item :rotation="angle" class="bubble">
            <span>{{item}}</span>
          </spin-item>
        </template>

        <template #center>
          <spin-item :rotation="angle" class="bubble">
            <span>CENTER</span>
          </spin-item>
        </template>

      </spin-circle>
    </spin-wheel>
    <button @click="addItem">Add item</button>
    <button @click="removeItem">Remove item</button>
    <button @click="gravity = !gravity">{{gravity ? 'No gravity' : 'Gravity'}}</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SpinWheel from "./components/SpinWheel.vue";
import SpinItem from "./components/SpinItem.vue";
import SpinCircle from "./components/SpinCircle.vue";

@Component({
  components: {
    SpinWheel,
    SpinItem,
    SpinCircle,
  }
})
export default class Demo extends Vue {
  gravity = true;
  items = ['NEVER', 'GONNA', 'GIVE', 'YOU', 'UP'];
  index = 0;

  addItem(){
    this.items.push('TEST' + ++this.index);
  }

  removeItem(){
    this.items.splice(-1);
  }
}
</script>

<style lang="scss">
#demo {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .flower {
    margin: 150px;
    width: 200px;
    height: 200px;
  }
  .bubble {
    width: 75px;
    height: 75px;
    border-radius: 50%;
    background-color: #0079db;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
