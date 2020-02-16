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
        transform: `rotate(${signedAngle}rad)`,
        width: `${circleSize}em`,
        height: `${circleSize}em`
      }"
    >
      <a
        v-for="item in bubbles"
        :key="item.value"
        class="item"
        :style="{
          transform: `rotate(${item.rot1}rad) translate(${
            item.translate
          }em) rotate(${-item.rot1 - signedAngle}rad)`,
          width: `${itemSize}em`,
          height: `${itemSize}em`,
          margin: `${-(itemSize / 2)}em`
        }"
      >
        {{ item.value }}
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Vector } from "ts-matrix";

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

  /** The point of first click before drag */
  private origin: Point | null = null;
  /** The center point of the spinner div */
  private spinnerCenter: Point = { x: 0, y: 0 };
  private signedAngle: number = 0;
  private bubbles: any[] = [];

  created() {
    const initialAngle = 360 / this.items.length;
    let rot = 0;
    this.bubbles = this.items.map(item => {
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
      // If no origin, then this first click is the origin point.
      if (!this.origin) this.origin = currentPoint;

      this.signedAngle = this.get360angle(
        new Vector([currentPoint.x, currentPoint.y, 0]),
        new Vector([this.origin.x, this.origin.y, 0])
      );
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

  private get360angle(Va: Vector, Vb: Vector) {
    return -Math.atan2(
      Vb.cross(Va).dot(new Vector([0, 0, 1]).normalize()),
      Va.dot(Vb)
    );
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
