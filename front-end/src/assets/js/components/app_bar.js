import { MDCTopAppBar } from "@material/top-app-bar";

/**
 * Komponent górnego paska aplikacji
 */
export default class AppBarComponent {

  /**
   * Konstruktor
   * 
   * @param {*} elementId id elementu DOM
   */
  constructor(elementId) {
    this.id = elementId;
    const topAppBar = MDCTopAppBar.attachTo(document.getElementById(this.id));
    topAppBar.setScrollTarget(document.getElementById('main-content'));
    topAppBar.listen('MDCTopAppBar:nav', () => {
      this.drawer.toogle();
    });
  }
}