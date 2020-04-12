import { Vue } from "vue-property-decorator";
/**
 * Component to display elements with a programmatic rotation
 * Mostly useful coupled with SpinCircle and SpinWheel.
 */
export default class SpinItem extends Vue {
    /** Optional rotation (in radian) of elements */
    rotation: number;
}
