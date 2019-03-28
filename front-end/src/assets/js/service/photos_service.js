import appConfig from '../config';

/**
 * Klasa do komunikacji z API 
 */
export default class PhotoService {

  constructor() {
    this.baseServerUrl = appConfig.baseServerAddress;
  }

  /**
   * Metoda wysyla obrazek na serwer razem z geotagiem
   * 
   * @public
   * @param fileName nazwa pliku
   * @param base64 zakodowana tresc pliku
   * @param latitude szerokosc
   * @param longitude wysokosc
   * @param onSuccess callback dla poprawnego wykonania - przekazane zostanie id
   * nowego zdjecia
   * @param onError callback dla błędu
   */
  saveImage(fileName, base64, latitude, longitude, onSuccess, onError) {
    const url = this.baseServerUrl + appConfig.endpoins.image;

    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      if (this.status == 200) {
        onSuccess(JSON.parse(this.responseText).id);
      } else {
        onError(this);
      }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
      file_name: fileName,
      base_64: base64,
      latitude: latitude,
      longitude: longitude
    }));
  }

  /**
   * Metoda usuwa obrazek z serwera
   * 
   * @public
   * @param id id zdjecia
   * @param onSuccess callback dla poprawnego wykonania
   * @param onError callback dla błędu
   */
  deleteImage(id, onSuccess, onError) {
    const url = this.baseServerUrl + appConfig.endpoins.image + '/' + id;

    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      if (this.status == 204) {
        onSuccess(this);
      } else {
        onError(this);
      }
    };
    xhttp.open("DELETE", url, true);
    xhttp.send();
  }

  /**
   * Metoda pobiera plik obrazka z serwera
   * 
   * @public
   * @param photo dane zdjecia
   * @param onSuccess callback dla poprawnego wykonania
   * @param onError callback dla błędu
   */
  downloadPhoto(photo, onSuccess, onError) {
    const url = this.baseServerUrl + appConfig.endpoins.download + '/' + photo.id;
    var link = document.createElement("a");
    link.download = photo.file_name;
    link.href = url;
    link.click();
  }

  /**
   * Metoda updatuje obrazek na serwerze
   * 
   * @public
   * @param id id zdjecia
   * @param latitude szerokosc
   * @param longitude wysokosc
   * @param onSuccess callback dla poprawnego wykonania
   * @param onError callback dla błędu
   */
  updateImage(id, latitude, longitude, onSuccess, onError) {
    const url = this.baseServerUrl + appConfig.endpoins.image + '/' + id;

    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      if (this.status == 204) {
        onSuccess(this);
      } else {
        onError(this);
      }
    };
    xhttp.open("PUT", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
      latitude: latitude,
      longitude: longitude
    }));
  }

  updateImages(photoElementModels, latitude, longitude, onSuccess, onError) {
    let errorDuringUpdate = null;
    let photosLeft = photoElementModels.length;
    for (let i = 0; i < photoElementModels.length; i++) {
      this.updateImage(photoElementModels[i].id, latitude, longitude, 
        function (res, index) {
          photosLeft--;
          console.log(photosLeft);
          
          if (photosLeft == 0) {
            if (errorDuringUpdate !== null)
              onError(errorDuringUpdate);
            else 
              onSuccess(null);
          }
        }.bind(this), function (error, index) {
          photosLeft--;
          onError(error);
          return;
        }.bind(this));
    }
  }

  /**
   * Metoda pobiera liste wszystkich zdjec na serwerze
   * 
   * @public
   * @param onSuccess callback dla poprawnego wykonania
   * @param onError callback dla błędu
   */
  getAllImages(onSuccess, onError) {
    const url = this.baseServerUrl + appConfig.endpoins.image;

    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      if (this.status == 200) {
        onSuccess(JSON.parse(this.responseText).objects);
      } else {
        onError(this);
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  }

  /**
  * Metoda pobiera liste zdjec zwiazanych z danym punktem na mapie
  *
  * @public
  * @param lat
  * @param lng
  * @param onSuccess callback dla poprawnego wykonania
  * @param onError callback dla błędu
  */
  getPhotosByLatLng(lat, lng, onSuccess, onError ) {
    let url = this.baseServerUrl + appConfig.endpoins.coordinates;

    url += ('?latitude=' + lat + '&longitude=' +  lng);

    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      if (this.status == 200) {
        onSuccess(JSON.parse(this.responseText).images);
      } else {
        onError(this);
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  }

  /**
  * Metoda pobiera liste zdjec zwiazanych z danym punktem na mapie
  *
  * @public
  * @param minLat
  * @param maxLat
  * @param minLng
  * @param maxLng
  * @param onSuccess callback dla poprawnego wykonania
  * @param onError callback dla błędu
  */
  getPhotosByLatLngRange(minLat, maxLat, minLng, maxLng, onSuccess, onError ) {
    let url = this.baseServerUrl + appConfig.endpoins.coordinatesRange + '?';
    url += 'min_latitude=' + minLat + '&';
    url += 'min_longitude=' + minLng + '&';
    url += 'max_latitude=' + maxLat + '&';
    url += 'max_longitude=' + maxLng;

    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      if (this.status == 200) {
        onSuccess(JSON.parse(this.responseText).images);
      } else {
        onError(this);
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  }
}