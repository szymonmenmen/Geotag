import { MDCDrawer } from "@material/drawer";
import appConfig from '../config';
import SnackbarComponent from "./snackbar";
import HyperList from 'hyperlist';

let sideDrawerComponentThis = null;
/**
 * Komponent bocznego wysuwanego panelu z lista zdjęc
 */
export default class SideDrawerComponent {

  /**
   * Konstruktor
   * 
   * @param {*} elementId id elementu DOM
   * @param service serwis do komunikacji z API
   */
  constructor(elementId, service, photoInfoDialog) {
    sideDrawerComponentThis = this;
    this.id = elementId;
    this.element = document.getElementById('side-drawer');
    this.service = service;
    this.photoInfoDialog = photoInfoDialog;
    this.geotagHeaderElement = document.getElementById('side-drawer-geotag-header');
    this.areaHeaderElement = document.getElementById('side-drawer-area-header');
    document.getElementById('side-drawer-arrow-back-button')
      .addEventListener("click", function (event) {
        this.showAllPhotos();
      }.bind(this));
    document.getElementById('side-drawer-arrow-back-button-2')
      .addEventListener("click", function (event) {
        this.showAllPhotos();
      }.bind(this));
    this.latitudeElement = this.geotagHeaderElement.querySelector('#side-drawer-latitude');
    this.longitudeElement = this.geotagHeaderElement.querySelector('#side-drawer-longitude');
    this.listElement = document.getElementById('photo-list');
    this.listElementContainer = document.getElementById('side-drawer-list');
    this.tempate = document.getElementById('photo-element-template');
    this.tempate.parentNode.removeChild(this.tempate);
    this.onListElementClick = null;

    this.initHyperList();

    this.drawer = MDCDrawer.attachTo(document.querySelector('#' + this.id));
    this.idHashmap = {};
  }

  initHyperList() {
    this.hyperList = null;
    this.hyperListConfig = {
      // All items must be the exact same height currently. Although since there is
      // a generate method, in the future this should be configurable.
      itemHeight: 250,

      // Specify the total amount of items to render the virtual height.
      total: 0,

      // Wire up the data to the index. The index is then mapped to a Y position
      // in the container.
      generate(i) {
        // copy object
        var domElement = sideDrawerComponentThis.tempate.cloneNode(true);
        sideDrawerComponentThis.fillElementWithData(sideDrawerComponentThis.elements[i], domElement);
        sideDrawerComponentThis.listElement.appendChild(domElement);
        const latlng = sideDrawerComponentThis.elements[i].latitude.toString() + ',' + sideDrawerComponentThis.elements[i].longitude;
        sideDrawerComponentThis.idHashmap[sideDrawerComponentThis.elements[i].id] = { element: sideDrawerComponentThis.elements[i], index: sideDrawerComponentThis.elements.length + i };

        // Nasluchiwanie klikniecia samego elementu zdjecia
        domElement.addEventListener("click", function (event) {
          const latlng = event.currentTarget.getAttribute('latlng');
          let tmp = latlng.split(",");
          const lat = parseFloat(tmp[0]);
          const lng = parseFloat(tmp[1]);
          sideDrawerComponentThis.onListElementClick(lat, lng);
          console.log({ lat: lat, lng: lng });

        }.bind(sideDrawerComponentThis));
        // Nasluchiwanie klikniecia przycisku pobrania
        domElement.getElementsByClassName('photo-download-button')[0]
          .addEventListener("click", function (event) {
            const id = event.target.closest("li").getAttribute('elementId');
            sideDrawerComponentThis.downloadPhoto(sideDrawerComponentThis.idHashmap[id].element);
          }.bind(sideDrawerComponentThis));
        // Nasluchiwanie klikniecia przycisku usuwania
        domElement.getElementsByClassName('photo-delete-button')[0]
          .addEventListener("click", function (event) {
            const id = event.target.closest("li").getAttribute('elementId');
            sideDrawerComponentThis.deletePhoto(sideDrawerComponentThis.idHashmap[id].element, sideDrawerComponentThis.idHashmap[id].index);
          }.bind(sideDrawerComponentThis));
        // Nasluchiwanie klikniecia przycisku informacji o zdjeciu
        domElement.getElementsByClassName('photo-info-button')[0]
          .addEventListener("click", function (event) {
            const id = event.target.closest("li").getAttribute('elementId');
            sideDrawerComponentThis.photoInfoDialog.open(sideDrawerComponentThis.idHashmap[id].element, () => { })
          }.bind(sideDrawerComponentThis));

        domElement.setAttribute("latlng", latlng);
        domElement.setAttribute("elementId", sideDrawerComponentThis.elements[i].id);
        return domElement;
      },
    };
  }

  showPhotosForArea(minLat, maxLat, minLng, maxLng) {
    this.geotagHeaderElement.style.display = 'none';
    this.areaHeaderElement.style.display = 'unset';
    this.areaHeaderElement.querySelector('#side-drawer-latitude').innerHTML = 
      '[' + minLat.toFixed(4) + ", " + maxLat.toFixed(4) + ']';
    this.areaHeaderElement.querySelector('#side-drawer-longitude').innerHTML =
      '[' + minLng.toFixed(4) + ", " + maxLng.toFixed(4) + ']';

    this.clearList();
    this.service.getPhotosByLatLngRange(minLng, maxLng, minLat, maxLat,
      function success(photos) {
        this.addElements(photos);
      }.bind(this), function error(error) {}.bind(this));
  }

  showPhotosForGeaotag(lat, lng) {
    this.areaHeaderElement.style.display = 'none';
    this.geotagHeaderElement.style.display = 'unset';
    this.latitudeElement.innerHTML = 'Latitude: ' + lat.toFixed(4);
    this.longitudeElement.innerHTML = 'Longitude: ' + lng.toFixed(4);

    this.clearList();
    this.service.getPhotosByLatLng(lat, lng, function (photos) {
      this.addElements(photos);
    }.bind(this), function (error) {});
  }

  showAllPhotos() {
    this.geotagHeaderElement.style.display = 'none';
    this.areaHeaderElement.style.display = 'none';
    this.clearList();
    this.service.getAllImages(function (data) {
      for (let i = 0; i < data.length; i++) {
        this.addElements(data[i].images);
      }
    }.bind(this), function (error) {
      // handle error
    }.bind(this));
  }

  /**
   * Metoda otwiera lub zamyka panel
   * 
   * @public
   */
  toogle() {
    this.drawer.open = !this.drawer.open;
  }

  open() {
    if (this.drawer.open)
      this.drawer.open = true;
  }

  /**
   * Ustawia tablice miniaturek zdjęc pobraną z serwera
   * 
   * @public
   * @param {PhotoListElementModel} elements tablica zdjec pobranych z serera
   */
  addElements(elements) {
    if (this.elements === undefined || this.elements.length === 0) {
      this.elements = elements;
      this.setupHyperList();
    } else  {
      this.elements = this.elements.concat(elements);
      this.hyperListConfig.total = this.elements.length;
      this.refreshHyperList();
    }
  }

  clearList() {
    this.elements = [];
    this.refreshHyperList();
    while (this.listElement.firstChild) {
      this.listElement.removeChild(this.listElement.firstChild);
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
    domElement.id = '';
    let src;
    if (element.src === undefined) {
      src = appConfig.baseServerAddress + appConfig.endpoins.thumbnail + '/' + element.id;
    } else {
      src = element.src;
    }
    domElement.getElementsByClassName('photo-list-element-photo')[0].src = src;
  }

  deletePhoto(photo, index) {
    this.service.deleteImage(photo.id, function (success) {
      const domElement = document.querySelectorAll('[elementId="' + photo.id + '"]')[0];
      this.elements.splice(index, 1);
      delete this.idHashmap[photo.id];
      domElement.parentNode.removeChild(domElement);
      SnackbarComponent.open('Element został usunięty', 'Zamknij');
    }.bind(this), function (error) {}.bind(this));
  }
  
  downloadPhoto(photo, index) {
    console.log('sd');
    
    this.service.downloadPhoto(photo, function (success) {

    }.bind(this), function (error) {}.bind(this));
  }

  setupHyperList() {
    this.hyperListConfig.total = this.elements.length;
    this.hyperList = HyperList.create(this.listElement, this.hyperListConfig);
  }

  refreshHyperList() {
    this.hyperListConfig.total = this.elements.length;
    this.hyperList.refresh(this.listElement, this.hyperListConfig);
  }
}