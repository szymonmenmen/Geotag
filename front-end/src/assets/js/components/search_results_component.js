import { MDCList } from '@material/list';
/**
 * Komponent do prezentowania wynikow wyszukiania
 */
export default class SearchResultsComponent {

  /**
   * Konstruktor
   * 
   * @param {*} elementId id elementu DOM
   */
  constructor(elementId) {
    this.id = elementId;
    this.element = document.getElementById(elementId);
    this.listElement = document.getElementById('search-results-list');
    this.listComponent = new MDCList(this.listElement);
    this.listComponent.singleSelection = true;
    this.itemTemplate = document.getElementById('search-results-list-item-template');
    this.itemTemplate.parentNode.removeChild(this.itemTemplate); 
    this.closeButton = document.getElementById('location-search-result-close-button');
    this.closeButton.addEventListener("click", function (event) {
      this.close();
    }.bind(this));
  }

  open(results) {
    this.clearList();
    this.results = results;
    this.element.style.display = 'block';

    for(let i = 0; i < this.results.length; i++) {
      // copy object
      var domElement = this.itemTemplate.cloneNode(true);
      domElement.getElementsByClassName('item-content')[0].innerText = this.results[i].display_name;
      domElement.addEventListener("click", function (event) {
        this.onSearchResultSelect(this.results[i].lat, this.results[i].lon, this.results[i].type);
      }.bind(this));
      this.listElement.appendChild(domElement);
    }
  }

  clearList() {
    while (this.listElement.firstChild) {
      this.listElement.removeChild(this.listElement.firstChild);
    }
    this.results = []
  }

  close() {
    this.clearList();
    this.element.style.display = 'none';
  }
}