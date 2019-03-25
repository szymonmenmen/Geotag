
/**
 * Klasa do obslugi bledow
 */
export default class ErrorHandler {

  constructor(handler) {
    this.handler = handler;

    window.onerror = function (msg, url, line, col, error) {
      this.handler(msg);
    }.bind(this);
  }
}