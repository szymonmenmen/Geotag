var dragDrop = require('drag-drop')
import SelectArea from 'leaflet-area-select';
import Cookies from 'js-cookie';
import leaflet from "leaflet";
import PhotoElementModel from "../models/photo_element_model";
import { MDCMenu } from '@material/menu';
import SnackbarComponent from "./snackbar";

/**
 * Komponent mapy obslugujacy drag and drop
 */
export default class MapComponent {

  /**
   * Konstruktor
   * 
   * @param {*} elementId id elementu DOM
   * @param service serwis do komunikacji z API
   */
  constructor(elementId, service) {
    this.id = elementId;
    this.service = service;
    this.sideDrawer = null;
    this.onFileDropListener = null;
    this.onMarkerClick = null;
    this.droppedFiles = null;
    this.markerHashmap = {};
    this.editingGeotag = false;
    this.editedPhotos = [];
    this.mapState;
    this.MAP_STATE_COOKIE_NAME = 'mapState';
    this.contextMenu = new MDCMenu(document.getElementById('map-context-menu'));
    this.initMap();
    this.initDragAndDrop();
  }

  /**
   * Inicjalizacaja obiektu mapy
   * 
   * @private
   */
  initMap() {
    this.mapState = Cookies.get(this.MAP_STATE_COOKIE_NAME);
    if (this.mapState === undefined) {
      this.mapState = { lat: 51.505, lng: -0.09, zoom: 13}
    } else {
      this.mapState = JSON.parse(this.mapState);
    }
    this.map = leaflet.map(this.id).setView([this.mapState.lat, this.mapState.lng], this.mapState.zoom);
    this.map.selectArea.enable();
    this.map.on('areaselected', this.onMapAreaSelected.bind(this));
    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.map.on('click', this.onMapClick.bind(this));
    this.map.on('move ', function (e) {
      this.contextMenu.open = false;
    }.bind(this));
    this.map.on('moveend', function (e) {
      this.mapState.lat = this.map.getCenter().lat;;
      this.mapState.lng = this.map.getCenter().lng;;
      this.mapState.zoom = this.map.getZoom();
      Cookies.set(this.MAP_STATE_COOKIE_NAME, this.mapState);
    }.bind(this));
  }

  /**
   * Metoda wywoływana przy zaznaczeniu obszaru mapy
   *
   * @private
   * @param {*} e event 
   */
  onMapAreaSelected(e) {
    let minLongitude;
    let minLatitude;
    let maxLongitude;
    let maxLatitude;
    if (e.bounds._northEast.lng === e.bounds._southWest.lng &&
      e.bounds._northEast.lat === e.bounds._southWest.lat) {
      return;
    }
    if (e.bounds._northEast.lng < e.bounds._southWest.lng) {
      minLatitude = e.bounds._northEast.lng;
      maxLatitude = e.bounds._southWest.lng;
    } else {
      maxLatitude = e.bounds._northEast.lng;
      minLatitude = e.bounds._southWest.lng;
    }
    if (e.bounds._northEast.lat < e.bounds._southWest.lat) {
      minLongitude = e.bounds._northEast.lat;
      maxLongitude = e.bounds._southWest.lat;
    } else {
      maxLongitude = e.bounds._northEast.lat;
      minLongitude = e.bounds._southWest.lat;
    }
    this.onMapAreaSelect(minLatitude, maxLatitude, minLongitude, maxLongitude);
  }

  /**
   * Metoda wywoływana przy klinięciu na mape.
   * 
   * @private
   * @param {*} e event z współrzędnymi kliknięcia  
   */
  onMapClick(e) {
    if (this.editingGeotag) {
      var ev = document.createEvent("MouseEvent");
      ev.initMouseEvent(
        "click",
        true /* bubble */, true /* cancelable */,
        window, 0,
        0, 0, e.originalEvent.clientX + 12.5, e.originalEvent.clientY + 41, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /*left*/, null
      );
      var latlng = this.map.mouseEventToLatLng(ev);
      this.submitEdition(this.editedPhotos, latlng.lat, latlng.lng);
    }
  }

  /**
   * Metoda inicjalizuje drag and drop komponentu
   * 
   * @private
   */
  initDragAndDrop() {
    dragDrop('#' + this.id, function (files, pos, fileList, directories) {
      console.log('drop');
      this.droppedFiles = fileList;
      var ev = document.createEvent("MouseEvent");
      ev.initMouseEvent(
        "click",
        true /* bubble */, true /* cancelable */,
        window, 0,
        0, 0, pos.x, pos.y, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /*left*/, null
      );
      var latlng = this.map.mouseEventToLatLng(ev);
      this.handleDrop(this.droppedFiles, latlng);

    }.bind(this))
  }

  /**
   * Metoda obsługuje upuszczenie pliku na mape
   * 
   * @param {*} files tablica z plikami
   * @param {*} latlng  obiekt z wspołrżednymi
   */
  handleDrop(files, latlng) {
    // Ktos zrzucil pliki na mape
    const photos = [];

    this.onFileDropListener(new Promise(function (resolve, reject) {
      for (let i = 0; i < files.length; i++) {
        let type = files[i].type;
        type = type.substring(0, type.lastIndexOf("/"));
        // takie troche prymitywne sprawdzenie czy plik jest obrazkiem czy nie
        if (type === 'image') {
          let photo = new PhotoElementModel();
          photo.file_name = files[i].name;
          photo.latitude = latlng.lat;
          photo.longitude = latlng.lng;
          this.base64Encode(files[i], i, function (base64, index) {
            photo.base64 = base64;
            photos.push(photo);
            if (index + 1 === files.length) {
              //this.onFileDropListener(photos);
              resolve(photos);
            }
            //this.saveGeotagToServer(files[i].name, base64, latlng.lat, latlng.lng);
          }.bind(this));
        }
      }
      this.droppedFiles = null;
    }.bind(this)));
  }

  /**
   * Metoda otwiera popup na mape z miniaturka zdjęcia
   * 
   * @public
   * @param {PhotoElementModel} photoElementModels dane zdjęc
   */
  openPhotoPopup(photoElementModels) {
    let carousel = document.createElement('div');
    carousel.id = 'popup-carousel';
    carousel.classList.add('carousel');
    for (let i = 0; i < photoElementModels.length; i++) {
      let element = document.createElement('a');
      element.classList.add('carousel-item');
      let img = document.createElement('img');
      img.src = photoElementModels[i].src;
      element.appendChild(img);
      carousel.appendChild(element);
    }

    var popup = leaflet.popup({
      closeButton: false,
      autoClose: true
    })
      .setLatLng([photoElementModels[0].latitude, photoElementModels[0].longitude])
      .setContent(carousel.outerHTML)
      .openOn(this.map);

  }

  /**
  * Metoda rysuje znacznik na mapie związany z danym zdjęciem
  *
  * @public
  * @param {PhotoElementModel} photoElementModels dane zdjęc zwiazanych z wspolrzednymi
  */
  drawMarker(photoElementModels) {

    var marker = L.marker([photoElementModels[0].latitude, photoElementModels[0].longitude]).addTo(this.map)
      .on('mouseover', () => {

      })
      .on('click', function (e) {
        this.onMarkerClick(photoElementModels);
        this.openPhotoPopup(photoElementModels);
      }.bind(this))
      .on('contextmenu', function (e) {
        let srcElement = e.originalEvent.srcElement.getBoundingClientRect();
        let x = e.originalEvent.clientX;
        x = (this.sideDrawer.drawer.open) ? (x - this.sideDrawer.element.clientWidth) : x;
        this.contextMenu.setAbsolutePosition(x, e.originalEvent.clientY);
        this.contextMenu.open = true;
        this.contextMenu.listen('MDCMenu:selected', function (event) {
          if (event.detail.item.id === 'map-menu-edit-option') {
            // edycja geotagu
            this.map.removeLayer(marker);
            this.startEdition(photoElementModels);
            this.editingGeotag = true;
            this.editedPhotos = photoElementModels;
          }
        }.bind(this));
      }.bind(this));
    this.markerHashmap[photoElementModels[0].latitude + ',' + photoElementModels[0].longitude] = marker;
  }

  focusOnGeotag(lat, lng) {
    this.map.flyTo({ lat: lat, lng: lng });
  }

  base64Encode(file, index, onFinish) {
    // convert the file to a Buffer that we can use!
    var reader = new FileReader()
    reader.addEventListener('load', function (e) {
      // e.target.result is an ArrayBuffer
      var arr = new Uint8Array(e.target.result)
      var buffer = new Buffer(arr)
      onFinish(buffer.toString('base64'), index);
    })
    reader.addEventListener('error', function (err) {
      console.error('FileReader error' + err)
    })
    return reader.readAsArrayBuffer(file)
  }

  startEdition(photoElementModels) {
    document.getElementById(this.id).style.cursor =
      'url(https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png), default';
    SnackbarComponent.open('Kliknij w mape aby wybrać lokalizacje', '', () => {});
  }

  submitEdition(photoElementModels, lat, lng) {
    console.log(photoElementModels);

    this.service.updateImages(photoElementModels, lat, lng, function (success) {
      for (let i = 0; i < photoElementModels.length; i++) {
        photoElementModels[i].latitude = lat;
        photoElementModels[i].longitude = lng;
      }
      this.drawMarker(photoElementModels);
      this.editedPhotos = [];
      this.editingGeotag = false;
      SnackbarComponent.open('Geotag został zaktualizowany', 'zamknij', null);
      document.getElementById(this.id).style.cursor = 'unset';
    }.bind(this), function (error) { }.bind(this));
  }

  setZoom(zoom) {
    this.map.setZoom(13);
  }
}