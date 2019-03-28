import appConfig from '../config';
/**
 * Komponent do wysylania zdjec na serwer
 */
export default class UploaderComponent {

  /**
   * Konstruktor
   * 
   * @param {*} elementId id elementu DOM
   * @param service serwis do komunikacji z API
   */
  constructor(elementId, service) {
    this.id = elementId;
    this.element = document.getElementById(elementId);
    this.service = service;

    this.onFilesUploadFinish = null;
  }

  open(photos) {
    this.element.style.display = 'block';
    const title = document.getElementById('upload-component-primary-text');
    title.innerHTML = 'Przesyłanie ' + photos.length + ((photos.length > 1) ? ' plików' : 'pliku');

    new Promise(function (resolve, reject) {
      for (let i = 0; i < photos.length; i++) {
        console.log('sd');
        
        this.saveGeotagToServer(photos[i].file_name, photos[i].base64, photos[i].latitude, 
          photos[i].longitude, function (error, id) {
            delete photos[i].base64;
            photos[i].src = appConfig.baseServerAddress + appConfig.endpoins.thumbnail + '/' + id;
            photos[i].id = id;
            // jezeli wyslano ostatnie
            if (i == photos.length - 1) {
              if (error !== undefined)
                reject();
              else
                resolve(photos);             
            }
          });
      }
    }.bind(this)).then(function (result) {
      this.element.style.display = 'none';
      this.onFilesUploadFinish(result);
    }.bind(this));
  }

  saveGeotagToServer(filename, base64, latitude, longitude, callback) {
    this.service.saveImage(filename, base64, latitude, longitude,
      function (id) {
        callback(undefined, id);
      }.bind(this),
      function (error) {
        callback(error, undefined);
      });
  }
}