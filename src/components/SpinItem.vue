<template>
  <div class="spin-item" :style="`transform: rotate(${-rotation}rad)`">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

/**
 * Component to display elements with a programmatic rotation
 * Mostly useful coupled with SpinCircle and SpinWheel.
 */
@Component
export default class SpinItem extends Vue {
  /** Optional rotation (in radian) of elements */
  @Prop({ type: Number, required: false })
  rotation!: number;
}
</script>
