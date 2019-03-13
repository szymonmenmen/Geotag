import { MDCTopAppBar } from "@material/top-app-bar";

export default class AppBarComponent {

  constructor(elementId) {
    this.id = elementId;
    this.onMenuButtonClick = function () {
      console.log('sdf');
      
    }

    const topAppBar = MDCTopAppBar.attachTo(document.getElementById(this.id));
    topAppBar.setScrollTarget(document.getElementById('main-content'));
    topAppBar.listen('MDCTopAppBar:nav', () => {
      this.drawer.toogle();
    });
  }

  setSideDrawer(drawer) {
    this.drawer = drawer;  
  }
}