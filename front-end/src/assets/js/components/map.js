var dragDrop = require('drag-drop')
import leaflet from "leaflet";
import PhotoElementModel from "../models/photo_element_model";

/**
 * Komponent mapy obslugujacy drag and drop
 */
export default class MapComponent {

  /**
   * Konstruktor
   * 
   * @param {*} elementId id elementu DOM
   */
  constructor(elementId) {
    this.id = elementId;
    this.onFiledDropListener = null;
    this.droppedFiles = null;
    this.initMap();
    this.initDragAndDrop();
  }

  /**
   * Inicjalizacaja obiektu mapy
   * 
   * @private
   */
  initMap() {
    this.map = leaflet.map(this.id).setView([51.505, -0.09], 13);

    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.map.on('click', this.onMapClick.bind(this));
  }

  /**
   * Metoda wywoływana przy klinięciu na mape.
   * 
   * @private
   * @param {*} e event z współrzędnymi kliknięcia  
   */
  onMapClick(e) {
      // zwykly klik w mape
      let photo = new PhotoElementModel();
      photo.latitude = e.latlng.lat;
      photo.longitude = e.latlng.lng;
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
    for (let i = 0; i < this.droppedFiles.length; i++) {
      let type = this.droppedFiles[i].type;
      type = type.substring(0, type.lastIndexOf("/"));
      // takie troche prymitywne sprawdzenie czy plik jest obrazkiem czy nie
      if (type === 'image') {
        let photo = new PhotoElementModel();
        photo.file_name = this.droppedFiles[i].name;
        photo.latitude = latlng.lat;
        photo.longitude = latlng.lng;
        console.log(photo);
        photos.push(photo);
        this.onFiledDropListener(photo);
        this.drawMarker(photo);
      }
    }
    this.droppedFiles = null;
  }

  /**
   * Metoda otwiera popup na mape z miniaturka zdjęcia
   * 
   * @public
   * @param {PhotoElementModel} photoElementModel dane zdjęcia
   */
  openPhotoPopup(photoElementModel) {
    var popup = leaflet.popup({
      closeButton: false,
      autoClose: true
    })
      .setLatLng([photoElementModel.latitude, photoElementModel.longitude])
      .setContent('<img src="' + photoElementModel.src + '" alt="Miniaturka Zdjęcia">')
      .openOn(this.map);
  }

  /**
  * Metoda rysuje znacznik na mapie związany z danym zdjęciem
  *
  * @public
  * @param {PhotoElementModel} photoElementModel dane zdjęcia
  */
  drawMarker(photoElementModel) {
    console.log(photoElementModel);

    var marker = L.marker([photoElementModel.latitude, photoElementModel.longitude]).addTo(this.map)
      .on('mouseover', () => {

      })
      .on('click', () => {
        this.openPhotoPopup(photoElementModel);
      })
  }

}