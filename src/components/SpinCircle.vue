<template>
  <div class="spin-circle" ref="circle">
    <ul>
      <li v-for="bubble in bubbles" :key="bubble.item" :style="bubble.style">
        <slot name="bubble" :item="bubble.item">
          <span class="default-bubble">BUBBLE</span> <!-- Default slot content -->
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

/**
 * Display a list of items on a circle.
 * The items can be anything and are fully customizable with slots.
 * By default, the item slot is a span with a static string.
 * 
 * Each item will be included into an <li> tag, that is rotated and translated
 * to make it appear as on a virtual circle.
 */
@Component
export default class SpinCircle<T> extends Vue {
  /**
   * Enables gravity on the items
   * If enabled, the items will rotate themself as much as their circle position make them rotate,
   * so that their always appear horizontal.
   */
  @Prop({ type: Boolean, default: false })
  gravity!: boolean;

  /** List of items data to display in the circle
   * Can be of any type, the display elements are to be defined using the 'bubble' slot
   */
  @Prop({ type: Array, required: true })
  items!: T[];
  
  /** The diameter in px of the circle on which we display the items */
  private diameter: number = 0;

  /** Return the items coupled with their circle style position */
  get bubbles(): Array<{ item: T, style: any }> {
    return this.items.map((item, index) => ({ item: item, style: this.transformBubbleStyle(index) }));
  }

  /** The angle in degrees between each element */
  get angle(): number {
    return 360 / this.items.length;
  }

  mounted() {
    this.diameter = (this.$refs.circle as HTMLElement).offsetWidth;
  }

  /**
   * Get the css transformations to rotate as on a circle
   * @param index the index of the element to display on the circle
   */
  private transformBubbleStyle(index: number) {
    return { transform: `rotate(${this.angle * index}deg) translate(${(this.diameter / 2)}px) ${this.gravity ? `rotate(-${this.angle * index}deg)` : ''}` };
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
      // Class to display a default bubble item in the circle slot
      .default-bubble {
        $size: 80px;
        height: $size;
        width: $size;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgb(0, 212, 177);
        color: black;
        border-radius: 100%;
      }
    }
  }
}
</style>
