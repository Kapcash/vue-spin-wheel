<template>
  <div class="main">
    <div
      class="point"
      :style="{
        top: `${spinnerCenter.y}px`,
        left: `${spinnerCenter.x}px`
      }"
    ></div>
    <div
      class="spinner"
      ref="spinner"
      v-on:mousemove="spinScroll"
      unselectable="on"
      onselectstart="return false;"
      onmousedown="return false;"
      :style="{
        transform: `rotate(${angle}rad)`,
        width: `${circleSize}em`,
        height: `${circleSize}em`
      }"
    >
      <div
        v-for="item in t"
        :key="item.value"
        class="item"
        :style="{
          transform: `rotate(${item.rot1}rad) translate(${
            item.translate
          }em) rotate(${-item.rot1 - angle}rad)`,
          width: `${itemSize}em`,
          height: `${itemSize}em`,
          margin: `${-(itemSize / 2)}em`
        }"
      >
        {{ item.value }}
      </div>
    </div>
    <div>
      <p>Origin: {{ origin }}</p>
      <p>spinnerCenter: {{ spinnerCenter }}</p>
      <p>scalar: {{ scalar }}</p>
      <p>angle: {{ angle }} {{ (angle * 180) / Math.PI }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

interface Point {
  x: number;
  y: number;
}

// TODO Use JSX instead to render templates
@Component
export default class HelloWorld extends Vue {
  @Prop() private items!: string[];

  @Prop() private circleSize!: number;

  @Prop() private itemSize!: number;

  private origin: Point | null = null;
  private angle: number = 0;
  private t: any[] = [];

  private lenghtCenterOrigin: number = 0;
  private lenghtCenterNow: number = 0;
  private lenghtOriginNow: number = 0;

  private spinnerCenter: Point = { x: 0, y: 0 };
  private scalar: number = 0;

  mounted() {
    const initialAngle = 360 / this.items.length;
    let rot = 0;
    this.t = this.items.map(item => {
      const i = {
        value: item,
        rot1: rot * (Math.PI / 180),
        translate: this.circleSize / 2 - this.itemSize / 2
      };
      rot += initialAngle;
      return i;
    });
  }

  spinScroll(evt: MouseEvent) {
    if (evt.buttons) {
      this.spinnerCenter = this.getSpinnerCenterPoint();

      const currentPoint: Point = {
        x: evt.clientX - this.spinnerCenter.x,
        y: this.spinnerCenter.y - evt.clientY
      };
      if (!this.origin) this.origin = currentPoint;
      // Scalar product of vectors CO and CN (where C = center, O = origin, N = new current point)
      // As C = (0, 0), the vectors values are actually the position of their second point.
      this.scalar =
        this.origin.x * currentPoint.x + this.origin.y * currentPoint.y;

      this.lenghtCenterOrigin = this.computeLenght(this.origin, { x: 0, y: 0 });
      this.lenghtCenterNow = this.computeLenght(currentPoint, { x: 0, y: 0 });
      let newAngle = Math.acos(
        this.scalar / (2 * this.lenghtCenterOrigin * this.lenghtCenterNow)
      );
      this.angle = newAngle;
    } else {
      this.origin = null;
    }
  }

  private getSpinnerCenterPoint(): Point {
    const spinnerRef: HTMLElement = this.$refs.spinner as HTMLElement;
    return {
      x: spinnerRef.offsetLeft + spinnerRef.offsetWidth / 2,
      y: spinnerRef.offsetTop + spinnerRef.offsetHeight / 2
    };
  }

  private computeLenght(a: Point, b: Point): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
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

.point {
  position: absolute;
  background-color: blue;
  width: 2px;
  height: 2px;
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
