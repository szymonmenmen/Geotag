import { MDCRipple } from '@material/ripple';

import MapComponent from './components/map';
import AppBarComponent from './components/app_bar';
import SideDrawerComponent from './components/side_drawer';

export default class GeotagApp {

  constructor() {
    this.initMDC();

    this.map = new MapComponent('mapid');
    this.map.onFiledDropListener = this.onFileDrop.bind(this);
    this.appBar = new AppBarComponent('app-bar');
    this.sideDrawer = new SideDrawerComponent('side-drawer');
    this.appBar.drawer = this.sideDrawer;

    this.photoListElements = [];

    // TODO pozniej zastapic pobieraniem danych z serwera
    for(let i = 0; i < 10; i++) {
      this.photoListElements.push(
        {
          id: i,
          file_name: "Name-" + i,
          src: 'https://picsum.photos/200/300/?random'
        }
      );
    }
    this.sideDrawer.setElements(this.photoListElements);
  }

  /**
   * Metoda wywoływana gdy na mape został zrzucony plik obrazka
   * 
   * @param {PhotoElementModel} photoElementModel obiekt z danymi pliku
   */
  onFileDrop(photoElementModel) {
    console.log(photoElementModel);
    // TODO wyslac na serwer
  }

  /**
   * Pierdoly zeby ladnie wygladalo
   */
  initMDC() {
    const iconButton = document.querySelector('.mdc-icon-button')
    
    if (iconButton !== null){
      const iconButtonRipple = new MDCRipple(iconButton);
      iconButtonRipple.unbounded = true;
    }
  }

}