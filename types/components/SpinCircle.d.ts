import { Vue } from "vue-property-decorator";
/**
 * Display a list of items on a circle.
 * The items can be anything and are fully customizable with slots.
 * By default, the item slot is a span with a static string.
 * 
 * Each item will be included into an <li> tag, that is rotated and translated
 * to make it appear as on a virtual circle.
 */
export default class SpinCircle<T> extends Vue {
    /**
     * Enables gravity on the items
     * If enabled, the items will rotate themself as much as their circle position make them rotate,
     * so that their always appear horizontal.
     */
    gravity: boolean;

    /** List of items data to display in the circle
     * Can be of any type, the display elements are to be defined using the 'bubble' slot
     */
    items: T[];
}
