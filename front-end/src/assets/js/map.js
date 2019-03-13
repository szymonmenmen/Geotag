var dragDrop = require('drag-drop')
import leaflet from "leaflet";

export default class MapComponent {

  constructor(elementId) {
    this.id = elementId;

    this.initMap();
    this.initDragAndDrop();
  }

  initMap() {
    var map = leaflet.map(this.id).setView([51.505, -0.09], 13);

    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  }

  initDragAndDrop() {
    dragDrop('#' + this.id, function (files, pos, fileList, directories) {
      console.log('Here are the dropped files', files) // Array of File objects
      console.log('Dropped at coordinates', pos.x, pos.y)
      console.log('Here is the raw FileList object if you need it:', fileList)
      console.log('Here is the list of directories:', directories)
    })
  }

}