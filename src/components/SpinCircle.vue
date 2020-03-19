<template>
  <div class="spin-circle" ref="circle">
    <ul>
      <li v-for="bubble in bubbles" :key="bubble.item" :style="bubble.style">
        <slot name="bubble" :item="bubble.item">
          <span>BUBBLE</span> <!-- Default slot content -->
        </slot>
      </li>
      <!-- Center -->
      <li class="spinner-center">
        <slot name="center"></slot>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class SpinCircle extends Vue {

  /** The diameter in px of the circle on which we display the items */
  diameter: number = 0;

  @Prop({ type: Boolean, default: false })
  gravity!: boolean;

  @Prop({ type: Array, required: true })
  items!: any[];
  
  get bubbles() {
    return this.items.map((item, index) => ({item: item, style: this.transformBubbleStyle(index)}));
  }

  /** The angle in degrees between each element */
  get angle(): number {
    return 360 / this.items.length
  }

  mounted() {
    this.diameter = (this.$refs.circle as HTMLElement).offsetWidth;
  }

  /**
   * Get the css transformations to rotate as on a circle
   * @param angle the radian angle between each element
   * @param index the index of the element to display on the circle
   */
  transformBubbleStyle(index: number) {
    return {transform: `rotate(${this.angle * index}deg) translate(${(this.diameter / 2)}px) ${this.gravity ? `rotate(-${this.angle * index}deg)` : ''}`};
  }
}
</script>

<style scoped lang="scss">
.spin-circle {
  position: relative;
  width: 100%;
  height: 100%;
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
