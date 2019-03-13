import { MDCRipple } from '@material/ripple';

import MapComponent from './components/map';
import AppBarComponent from './components/app_bar';
import SideDrawerComponent from './components/side_drawer';


export default class GeotagApp {

  constructor() {
    this.initMDC();

    this.map = new MapComponent('mapid');
    this.appBar = new AppBarComponent('app-bar');
    this.sideDrawer = new SideDrawerComponent('side-drawer');

    this.appBar.setSideDrawer(this.sideDrawer);

    let photoListElements = [];
    for(let i = 0; i < 10; i++) {
      photoListElements.push(
        {
          id: i,
          file_name: "Name-" + i,
          src: 'https://picsum.photos/200/300/?random'
        }
      );
    }
    this.sideDrawer.setElements(photoListElements);
  }

  initMDC() {
    const iconButton = document.querySelector('.mdc-icon-button')
    
    if (iconButton !== null){
      const iconButtonRipple = new MDCRipple(iconButton);
      iconButtonRipple.unbounded = true;
    }

  }

}