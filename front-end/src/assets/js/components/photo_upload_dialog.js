import { MDCDialog } from '@material/dialog';

/**
 * Komponent okienka modalnego potwierdzenia przesłania zdjęc
 */
export default class PhotoUploadDialogComponent {

  /**
   * Konstruktor
   * 
   * @param {number} id id elementu DOM 
   */
  constructor(id) {
    this.id = id;
    this.dialog = new MDCDialog(document.getElementById(this.id));
    this.spinner = document.getElementById('photo-dialog-spinner-wrapper');

    document.getElementById("upload-dialog-submit-button").addEventListener("click", function () {
      if (this.onSubmitListener !== null) {
        this.onSubmitListener(this.photoElementModels);
        this.clearData();
      }
    }.bind(this));

    document.getElementById("upload-dialog-dismiss-button").addEventListener("click", function () {
      if (this.onDismissListener !== null) {
        this.onDismissListener();
        this.clearData();
      }
    }.bind(this));

    this.onSubmitListener = null;
    this.onDismissListener = null;

    this.latitudeSpan = document.getElementById('uploaded-geotag-latitude');
    this.longitudeSpan = document.getElementById('uploaded-geotag-longitude');
    this.listElement = document.getElementById('uploaded-photos-list');
    this.tempate = document.getElementById('uploaded-photos-template');
    this.tempate.parentNode.removeChild(this.tempate); 
  }

  /**
   * Otwiera okienko modalne wyswietlajace dane przekazanego w argumencie 
   * zdjecia
   * 
   * @public
   * @param {PhotoElementModel} photoElementModels tablica z obiektami przesylanych zdjec
   */
  open(photoElementModelsPromise, onSubmitListener, onDismissListener) { 
    this.spinner.style.display = 'unset;'
    this.onSubmitListener = onSubmitListener;
    this.onDismissListener = onDismissListener;

    this.dialog.open();
    photoElementModelsPromise.then(function (photos) {
      console.log(photos);
      
      this.photoElementModels = photos;
      this.setData(photos);
    }.bind(this));
  }

  /**
   * Zamyka okineko modalne
   * 
   * @public
   */
  close() {
    this.clearData();
    this.dialog.close();
  }

  /**
   * Ustawia dane zdjecia w okienku
   * 
   * @private
   * @param {PhotoElementModel} photoElementModels lista przesylanych zdjec
   */
  setData(photoElementModels) {
    this.latitudeSpan.innerHTML = photoElementModels[0].latitude;
    this.longitudeSpan.innerHTML = photoElementModels[0].longitude;

    for (let i = 0; i < photoElementModels.length; i++) {
      // copy object
      var domElement = this.tempate.cloneNode(true);
      this.fillElementWithData(photoElementModels[i], domElement);
      this.listElement.appendChild(domElement);
    }

    
    this.spinner.style.display = 'none';
  }

  /**
   * Metoda wypelnia elementy listy danymi
   * 
   * @private 
   * @param {*} element dane zdjecia
   * @param {*} domElement element DOM listy
   */
  fillElementWithData(element, domElement) {
    domElement.id = '';
    domElement.getElementsByClassName('mdc-image-list__image')[0].src = 'data:image/png;base64, ' + element.base64;
    domElement.getElementsByClassName('mdc-image-list__label')[0].innerHTML = element.file_name;
  }

  /**
   * Czysci dane okienka
   * 
   * @private
   */
  clearData() {
    while (this.listElement.firstChild) {
      this.listElement.removeChild(this.listElement.firstChild);
    }
    this.latitudeSpan.innerHTML = '--';
    this.longitudeSpan.innerHTML = '--';
  }
}
