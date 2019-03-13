import { MDCDrawer } from "@material/drawer";

export default class SideDrawerComponent {

  constructor(elementId) {
    this.id = elementId;
    this.listElement = document.getElementById('photo-list');
    this.tempate = document.getElementById('photo-element-template');
    this.tempate.parentNode.removeChild(this.tempate);
    console.log(this.tempate);
    
    this.drawer = MDCDrawer.attachTo(document.querySelector('#' + this.id));
  }

  toogle() {
    this.drawer.open = !this.drawer.open;
  }

  /**
   * Ustawia tablice miniaturek zdjęc pobraną z serwera
   * 
   * @param {PhotoListElementModel} elements tablica zdjec pobranych z serera
   */
  setElements(elements) {
    this.elements = elements;

    for (let i = 0; i < this.elements.length; i++) {
      // copy object
      var domElement = this.tempate.cloneNode(true);
      this.fillElementWithData(elements[i], domElement);
      this.listElement.appendChild(domElement);
    }
  }

  fillElementWithData(element, domElement) {
    domElement.getElementsByClassName('photo-list-element-photo')[0].src = element.src;
  }

}