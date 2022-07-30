<template>
  <div class="spinner-wrapper" ref="spinnerWrap">
    <div
      class="spinner"
      ref="spinner"
      unselectable="on"
      onselectstart="return false;"
      @mousedown="startSpin"
      @mousemove="spinScroll"
      @mouseup="stopSpin"
      @touchend="stopSpin"
      @touchmove="spinScroll"
      :style="{ transform: `rotate(${angle}rad)` }"
    >
      <slot :angle="angle"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Point } from "../types/types";

/**
 * Enable elements to spin with user click or touch drags.
 * 
 * Warning: on mobile browser, it avoids the page to scroll when the user touch the SpinWheel.
 */
@Component
export default class SpinWheel extends Vue {
  /** The center point of the spinner div */
  spinnerCenter: Point = { x: 0, y: 0 };
  /** The current rotation radian angle */
  angle: number = -(Math.PI / 2); // Default value is 90º so that the first element is on top
  /** The last rotation radian angle before stopping rotating */
  previousAngle: number = -(Math.PI / 2);
  /** The first interaction radian angle before spinning */
  startAngle: number = 0;

  startSpin (evt: MouseEvent | TouchEvent) {
    const currentPoint = this.getCurrentPointFromCenter(evt);
    this.startAngle = -Math.atan2(currentPoint.y, currentPoint.x)
  }

  /** Reset origin and sets the previousAngle value (where the rotation stopped */
  stopSpin() {
    this.previousAngle = this.angle;
  }

  /**
   * On scroll, compute the angle of rotation for the spinner
   */
  spinScroll(evt: MouseEvent | TouchEvent) {
    if (evt instanceof MouseEvent && evt.buttons || evt instanceof TouchEvent) {
      const currentPoint = this.getCurrentPointFromCenter(evt);

      const newAngle = -Math.atan2(currentPoint.y, currentPoint.x)
      const angleOffset =  (newAngle - this.startAngle)
      this.angle = this.previousAngle + angleOffset;
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
  height: 1px;
  .spinner {
    position: relative;
    padding: 0;
    min-width: 100%;
    min-height: 100%;
    height: 1px;
  }
}
</style>
