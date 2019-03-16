import { MDCDrawer } from "@material/drawer";

/**
 * Komponent bocznego wysuwanego panelu z lista zdjęc
 */
export default class SideDrawerComponent {

  /**
   * Konstruktor
   * 
   * @param {*} elementId id elementu DOM
   */
  constructor(elementId) {
    this.id = elementId;
    this.listElement = document.getElementById('photo-list');
    this.tempate = document.getElementById('photo-element-template');
    this.tempate.parentNode.removeChild(this.tempate);

    this.drawer = MDCDrawer.attachTo(document.querySelector('#' + this.id));
  }

  /**
   * Metoda otwiera lub zamyka panel
   * 
   * @public
   */
  toogle() {
    this.drawer.open = !this.drawer.open;
  }

  /**
   * Ustawia tablice miniaturek zdjęc pobraną z serwera
   * 
   * @public
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

  /**
   * Metoda wypelnia elementy DOM danymi - ustala adres obrazka
   * 
   * @private 
   * @param {*} element 
   * @param {*} domElement 
   */
  fillElementWithData(element, domElement) {
    domElement.getElementsByClassName('photo-list-element-photo')[0].src = element.src;
  }

}