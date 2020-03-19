<template>
  <div class="spinner-wrapper" ref="spinnerWrap">
    <div
      class="spinner"
      ref="spinner"
      unselectable="on"
      onselectstart="return false;"
      onmousedown="return false;"
      @mousemove="spinScroll"
      @mouseup="resetOrigin"
      @touchend="resetOrigin"
      @touchmove="spinScroll"
      :style="{ transform: `rotate(${angle}rad)` }">
      <slot :angle="angle"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Vector } from "ts-matrix";
import { Bubble, Point } from "../types/types";

@Component
export default class SpinWheel extends Vue {

  /** The point of first click before drag */
  private origin: Point | null = null;
  /** The center point of the spinner div */
  private spinnerCenter: Point = { x: 0, y: 0 };
  /** The current rotation radian angle */
  private angle: number = -(Math.PI / 2); // Default value is 90º so that the first element is on top
  /** The last rotation radian angle before stopping rotating */
  private previousAngle: number = -(Math.PI / 2);

  /** Reset origin and sets the previousAngle value (where the rotation stopped */
  resetOrigin(evt: any) {
    this.origin = null;
    this.previousAngle = this.angle;
    (this.$refs.spinner as HTMLElement).style.transition = `transform 2s cubic-bezier(0.28, 0.44, 0.57, 1) 0s`;
    // this.angle += Math.PI;
  }

  /**
   * On scroll, compute the angle of rotation for the spinner
   */
  spinScroll(evt: MouseEvent | TouchEvent) {
    if (evt instanceof MouseEvent && evt.buttons || evt instanceof TouchEvent) {
      (this.$refs.spinner as HTMLElement).style.transition = '';
      const currentPoint = this.getCurrentPointFromCenter(evt);

      // If no origin, then this first click is the origin point.
      if (!this.origin) this.origin = currentPoint;

      // Compute the signed angle (i.e. on 360º) between the [center, origin] and [center, currentPoint] segments
      this.angle = (this.previousAngle + Vector.get360angle(
        new Vector([currentPoint.x, currentPoint.y, 0]),
        new Vector([this.origin.x, this.origin.y, 0])
      )) % (2 * Math.PI);
    }
  }

  /**
   * Get the point where the cursor currently click / touch
   * @param evt The event from a click or touch
   */
  private getCurrentPointFromCenter(evt: MouseEvent | TouchEvent): Point {
    const pointClicked = this.getPointFromEvent(evt);
    this.spinnerCenter = this.getSpinnerCenterPoint();
    return {
      x: pointClicked.x - this.spinnerCenter.x,
      y: this.spinnerCenter.y - pointClicked.y,
    };
  }

  /**
   * Get the clicked / touched point from mouse or touch event
   * @param evt The event from a click or touch
   */
  private getPointFromEvent(evt: MouseEvent | TouchEvent): Point {
    if (evt instanceof MouseEvent) {
      return { x: evt.clientX, y: evt.clientY };
    } else if (evt instanceof TouchEvent) {
      return { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
    } else {
      return { x: 0, y: 0 };
    }
  }

  /** Get the center point of the spinner element */
  private getSpinnerCenterPoint(): Point {
    const spinnerRef: HTMLElement = this.$refs.spinnerWrap as HTMLElement;
    return {
      x: spinnerRef.getBoundingClientRect().left + spinnerRef.offsetWidth / 2,
      y: spinnerRef.getBoundingClientRect().top + spinnerRef.offsetHeight / 2
    };
  }
}
</script>

<style scoped lang="scss">
.spinner-wrapper {
  .spinner {
    position: relative;
    padding: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
