import { MDCTopAppBar } from "@material/top-app-bar";
import { MDCTextField } from '@material/textfield';

/**
 * Komponent górnego paska aplikacji
 */
export default class AppBarComponent {

  /**
   * Konstruktor
   * 
   * @param {*} elementId id elementu DOM
   */
  constructor(elementId, locationService) {
    this.id = elementId;
    this.locationService = locationService;
    const topAppBar = MDCTopAppBar.attachTo(document.getElementById(this.id));
    topAppBar.setScrollTarget(document.getElementById('main-content'));
    topAppBar.listen('MDCTopAppBar:nav', () => {
      this.drawer.toogle();
    });
    this.initLocationSearchBox();
  }

  initLocationSearchBox() {
    this.locationSearchbox = new MDCTextField(document.getElementById('location-searchchbox'));
    this.searchButton = document.getElementById('location-search-button');
    this.searchInput = document.getElementById('location-search-input');
    this.searchInput.addEventListener("keyup", function (event) {
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        this.searchButton.click();
      }
    }.bind(this));
    this.searchButton.addEventListener('click', function (ev) {
      this.locationService.getLocations(this.searchInput.value, 
        function success(res) {
          this.onSearchResults(res);
        }.bind(this), function error(error) {}.bind(this))
    }.bind(this));
  }
}