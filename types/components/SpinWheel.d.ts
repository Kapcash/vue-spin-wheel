import { Vue } from "vue-property-decorator";

/**
 * Enable elements to spin with user click or touch drags.
 * 
 * Warning: on mobile browser, it avoids the page to scroll when the user touch the SpinWheel.
 */
export default class SpinWheel extends Vue {
    /** Reset origin and sets the previousAngle value (where the rotation stopped */
    resetOrigin(evt: any): void;

    /** On scroll, compute the angle of rotation for the spinner */
    spinScroll(evt: MouseEvent | TouchEvent): void;
}
