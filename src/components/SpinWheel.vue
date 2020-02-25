<template>
  <div
    class="spinner"
    ref="spinner"
    v-on:mousemove="spinScroll"
    unselectable="on"
    onselectstart="return false;"
    onmousedown="return false;"
    onmousemove="spinScroll(event)"
    onmouseup="resetOrigin(event)"
    ontouchend="resetOrigin(event)"
    ontouchmove="spinScroll(event)"
    :style="{
      width: `${circleSize}em`,
      height: `${circleSize}em`
    }">
    <a
      v-for="item in bubbles"
      :key="item.value"
      class="item"
      :style="{
        transform: `rotate(${item.rotation}rad) translate(${
          item.translate
        }em) rotate(${-item.rotation}rad)`,
        width: `${itemSize}em`,
        height: `${itemSize}em`,
        margin: `${-(itemSize / 2)}em`
      }"
    >
      {{ item.value }}
    </a>
    <a class="item spinner-center">CENTER</a>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Vector } from "ts-matrix";

interface Point {
  x: number;
  y: number;
}

interface Bubble {
  value: string;
  rotation: number;
  translate: number;
}

// TODO Use JSX instead to render templates
@Component
export default class SpinWheel extends Vue {
  @Prop() private items!: string[];

  @Prop() private circleSize!: number;

  @Prop() private itemSize!: number;

  /** Items enriched with style */
  private bubbles: Bubble[] = [];
  /** The point of first click before drag */
  private origin: Point | null = null;
  /** The center point of the spinner div */
  private spinnerCenter: Point = { x: 0, y: 0 };
  /** The current rotation radian angle */
  private angle: number = 0;
  /** The last rotation radian angle before stopping rotating */
  private previousAngle: number = 0;
  /** The radian angle between each elements */
  private initialAngle: number = 0;

  /** The length from circle center to the item center */
  get radiusToItemCenter() {
    return this.circleSize / 2 - this.itemSize / 2;
  }

  created() {
    this.initialAngle = (2 * Math.PI) / this.items.length; // One item angle in radians
    let rot = 0;
    this.bubbles = this.items.map(item => {
      const b: Bubble = {
        value: item,
        rotation: rot,
        translate: this.radiusToItemCenter
      };
      rot += this.initialAngle;
      return b;
    });
  }

  /** Reset origin and sets the previousAngle value (where the rotation stopped */
  resetOrigin() {
    this.origin = null;
    this.previousAngle = this.angle;
  }

  /** On scroll, compute the angle of rotation for the spinner */
  spinScroll(evt: MouseEvent | TouchEvent) {
    const pointClicked = this.getPointFromEvent(evt);
    if (evt instanceof MouseEvent && evt.buttons || evt instanceof TouchEvent) {
      this.spinnerCenter = this.getSpinnerCenterPoint();
      const currentPoint: Point = {
        x: pointClicked.x - this.spinnerCenter.x,
        y: this.spinnerCenter.y - pointClicked.y,
      };
      // If no origin, then this first click is the origin point.
      if (!this.origin) this.origin = currentPoint;

      // Compute the signed angle (i.e. on 360º) between the [center, origin] and [center, currentPoint] segments
      this.angle = (this.previousAngle + Vector.get360angle(
        new Vector([currentPoint.x, currentPoint.y, 0]),
        new Vector([this.origin.x, this.origin.y, 0])
      )) % (2 * Math.PI);

      // We update the style of each item using the new angle
      this.bubbles.forEach((bubble, index) => {
        const newItemAngle = this.initialAngle * index + this.angle;
        bubble.rotation = newItemAngle;
      });
    } else {
      this.resetOrigin();
    }
  }

  /** Get the clicked / touched point from mouse or touch event */
  private getPointFromEvent(evt: MouseEvent | TouchEvent): Point {
    if (evt instanceof MouseEvent) {
      return { x: evt.clientX, y: evt.clientY };
    } else if (evt instanceof TouchEvent) {
      return { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
    } else {
      return { x: 0, y: 0 };
    }
  }

  private getSpinnerCenterPoint(): Point {
    const spinnerRef: HTMLElement = this.$refs.spinner as HTMLElement;
    return {
      x: spinnerRef.getBoundingClientRect().left + spinnerRef.offsetWidth / 2,
      y: spinnerRef.getBoundingClientRect().top + spinnerRef.offsetHeight / 2
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: row;
  justify-content: center;
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
  .item {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: red;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .spinner-center {
    width: 5em;
    height: 5em;
    margin: calc(-5em/2);
  }
}
</style>
