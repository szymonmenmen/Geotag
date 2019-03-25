
/**
 * Klasa do komunikacji z API do wyszukiania lokazliacji
 */
export default class LocationService {

  constructor() {
    this.locationSearchEndpoint = 'http://nominatim.openstreetmap.org/search?format=json&limit=5&q=';
  }

  /**
   * Metoda pobiera liste lokalizacji dla wyszukiwanej frazy
   * 
   * @public
   * @param onSuccess callback dla poprawnego wykonania
   * @param onError callback dla błędu
   */
  getLocations(query, onSuccess, onError) {
    const url = this.locationSearchEndpoint + query;

    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      if (this.status == 200) {
        onSuccess(JSON.parse(this.responseText));
      } else {
        onError(this);
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  }
}