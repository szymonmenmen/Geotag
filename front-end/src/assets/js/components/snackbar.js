import { MDCSnackbar } from '@material/snackbar';

/**
 * Komponent snackbara z komunikatami o dzialaniu aplikacji
 */
export default class SnackbarComponent {

  /**
  * Konstruktor
  *
  * @param {*} elementId id elementu DOM
  */
  static init(elementId) {
    SnackbarComponent.id = elementId;
    SnackbarComponent.snackbar = new MDCSnackbar(document.getElementById(this.id));
  }

  static open(message, action, actionCallback, closeCallback) {
    this.snackbar.actionButtonText = action;
    this.snackbar.labelText = message;
    this.snackbar.listen('MDCSnackbar:closing', function (event) {
      if (closeCallback !== undefined)
        closeCallback(event.detail.reason === 'action');
    });
    this.snackbar.open();
  }
}