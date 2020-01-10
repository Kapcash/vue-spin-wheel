<template>
  <div>
    <p>Origin: {{ origin }}</p>
    <div
      class="spinner"
      v-on:mousemove="spinScroll"
      unselectable="on"
      onselectstart="return false;"
      onmousedown="return false;"
      :style="{
        transform: `rotate(${angle}deg)`,
        width: `${circleSize}em`,
        height: `${circleSize}em`
      }"
    >
      <div
        v-for="item in t"
        :key="item.value"
        class="item"
        :style="{
          transform: `rotate(${item.rot1}deg) translate(${
            item.translate
          }em) rotate(${-item.rot1 - angle}deg)`,
          width: `${itemSize}em`,
          height: `${itemSize}em`,
          margin: `${-(itemSize / 2)}em`
        }"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

interface Point {
  x: number;
  y: number;
}

@Component
export default class HelloWorld extends Vue {
  @Prop() private items!: string[];

  @Prop() private circleSize!: number;

  @Prop() private itemSize!: number;

  private origin: Point | null = null;
  private angle: number = 0;
  private t: any[] = [];
  private hDiff: number = 0;

  mounted() {
    const initialAngle = 360 / this.items.length;
    let rot = 0;
    this.t = this.items.map(item => {
      const i = {
        value: item,
        rot1: rot,
        translate: this.circleSize / 2 - this.itemSize / 2
      };
      rot += initialAngle;
      return i;
    });
  }

  spinScroll(evt: MouseEvent) {
    if (evt.buttons) {
      if (!this.origin) this.origin = { x: evt.clientX, y: evt.clientY };
      const newHDiff = -(this.origin.y - evt.clientY);
      this.angle = (this.angle + (newHDiff - this.hDiff)) % 360;
      this.hDiff = newHDiff;
    } else {
      this.origin = null;
      this.hDiff = 0;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.item {
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background-color: red;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

/// Mixin to place items on a circle
/// @author Hugo Giraudel
/// @author Ana Tudor
/// @param {Integer} $item-count - Number of items on the circle
/// @param {Length} $circle-size - Large circle size
/// @param {Length} $item-size - Single item size
@mixin on-circle($item-count, $circle-size, $item-size) {
  position: relative;
  width: $circle-size;
  height: $circle-size;
  padding: 0;
  border-radius: 50%;
  list-style: none;

  > * {
    position: absolute;
    top: 50%;
    left: 50%;
    width: $item-size;
    height: $item-size;
    margin: -($item-size / 2);

    $angle: (360 / $item-count);
    $rot: 0;

    // @for $i from 1 through $item-count {
    //   &:nth-of-type(#{$i}):not(.center) {
    //     transform: rotate($rot * 1deg)
    //       translate(($circle-size / 2) - ($item-size / 2))
    //       rotate($rot * -1deg); // Last rotate is the item itself
    //   }

    //   $rot: $rot + $angle;
    // }
  }
}

@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.spinner {
  position: relative;
  padding: 0;
  border-radius: 50%;
  list-style: none;
  > * {
    position: absolute;
    top: 50%;
    left: 50%;
  }
  // @include on-circle($item-count: 6, $circle-size: 20em, $item-size: 5em);
  // animation: spin 1s linear 1s;
}
</style>
