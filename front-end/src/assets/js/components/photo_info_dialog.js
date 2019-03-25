import { MDCDialog } from '@material/dialog';
import appConfig from '../config';

/**
 * Komponent okienka modalnego potwierdzenia przesłania zdjęc
 */
export default class PhotoInfoDialogComponent {

  /**
   * Konstruktor
   * 
   * @param {number} id id elementu DOM 
   */
  constructor(id) {
    this.id = id;
    this.dialog = new MDCDialog(document.getElementById(this.id));

    document.getElementById("info-dialog-dismiss-button").addEventListener("click", function () {
      if (this.onDismissListener !== null) {
        this.onDismissListener();
        this.close();
      }
    }.bind(this));

    this.onSubmitListener = null;
    this.onDismissListener = null;

    this.title = document.getElementById('photo-info-dialog-title');
    this.latitudeSpan = document.getElementById('photo-info-dialog-latitude');
    this.longitudeSpan = document.getElementById('photo-info-dialog-longitude');
    this.photo = document.getElementById('photo-info-dialog-photo');
    this.photo.parentNode.removeChild(this.photo);
    this.container = document.getElementById('info-dialog-content');
  }

  /**
   * Otwiera okienko modalne wyswietlajace dane przekazanego w argumencie 
   * zdjecia
   * 
   * @public
   * @param {PhotoElementModel} photoElement obiekt zdjecia
   */
  open(photoElement, onDismissListener) { 
    this.onDismissListener = onDismissListener;

    this.setData(photoElement);
    this.dialog.open();
    this.photoElement = photoElement;
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
   * @param {PhotoElementModel} photoElementModel obiekt zdjecia
   */
  setData(photoElementModel) {
    this.title.innerHTML = photoElementModel.file_name;
    this.latitudeSpan.innerHTML = photoElementModel.latitude;
    this.longitudeSpan.innerHTML = photoElementModel.longitude;

    this.photo.src = appConfig.baseServerAddress + appConfig.endpoins.download + '/' + photoElementModel.id;
    this.container.appendChild(this.photo);
  }

  /**
   * Czysci dane okienka
   * 
   * @private
   */
  clearData() {
    this.container.removeChild(this.photo);
    this.latitudeSpan.innerHTML = '--';
    this.longitudeSpan.innerHTML = '--';
  }
}
