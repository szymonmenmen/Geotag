import { MDCRipple } from '@material/ripple';

import ErrorHandler from './errors_handler';

import MapComponent from './components/map';
import AppBarComponent from './components/app_bar';
import SideDrawerComponent from './components/side_drawer';
import PhotoUploadDialogComponent from './components/photo_upload_dialog';
import PhotoInfoDialogComponent from './components/photo_info_dialog';
import SnackbarComponent from './components/snackbar';
import UploaderComponent from './components/uploader';
import SearchResultsComponent from './components/search_results_component';

export default class GeotagApp {

  constructor(service, locationService) {
    this.service = service;
    this.locationService = locationService;
    this.initMDC();
    this.map = new MapComponent('mapid', service);
    this.map.onFileDropListener = this.onFilesDrop.bind(this);
    this.map.onMarkerClick = this.onMarkerClick.bind(this);
    this.map.onMapAreaSelect = this.onMapAreaSelect.bind(this);
    this.appBar = new AppBarComponent('app-bar', this.locationService);
    this.appBar.onSearchResults = this.onLocationSearchResults.bind(this);
    this.photoInfoDialog = new PhotoInfoDialogComponent('photo-info-dialog');
    this.sideDrawer = new SideDrawerComponent('side-drawer', service, this.photoInfoDialog);
    this.map.sideDrawer = this.sideDrawer;
    this.sideDrawer.onListElementClick = this.onListElementClick.bind(this);
    this.appBar.drawer = this.sideDrawer;
    this.photoUploadDialog = new PhotoUploadDialogComponent('photo-dialog');
    SnackbarComponent.init('snackbar');
    this.uploader = new UploaderComponent('upload-component', service);
    this.uploader.onFilesUploadFinish = this.onFilesUploadFinish.bind(this);
    this.searchResultsComponent = new SearchResultsComponent('search-results-component');
    this.searchResultsComponent.onSearchResultSelect = this.onSearchResultSelect.bind(this);
    // Obsluga bledow
    this.errorHandler = new ErrorHandler(function (msg) {
      SnackbarComponent.open("Coś poszło nie tak...", 'zamknij', false, function (closedWithAction) {});
    }.bind(this));
    // pobranie danych z serwera
    this.fetchData();
  }

  /**
  * Metoda pobiera liste zdjec z serwera
  */
  fetchData() {
    this.service.getAllImages(function (data) {
      for (let i = 0; i < data.length; i++) {
        this.sideDrawer.addElements(data[i].images);
        this.map.drawMarker(data[i].images);
      }
    }.bind(this), function (error) {
      // handle error
    }.bind(this));
  }

  /**
   * Metoda wywoływana gdy uzytkowanik zrzuci na mape zdjecia
   * 
   * @param photos lista wybranych zdjec
   */
  onFilesDrop(photosPromise) {
    this.photoUploadDialog.open(photosPromise, 
      function (photos) {
        //on Submit
        console.log('Submit');
        this.uploader.open(photos);
        // TODO wyslac na serwer
      }.bind(this),
      function () {
        // on Dismiss
        console.log('Dismiss');
      }.bind(this));
  }

  /**
   * Metoda wywoływana gdy na serwer przeslane zostan nowe zdjecia z geotagiem
   * 
   * @param photos nowe obiekty zdjec
   */
  onFilesUploadFinish(photos) {
    console.log(photos);
    
    this.map.drawMarker(photos);
    this.sideDrawer.addElements(photos);
    SnackbarComponent.open(photos.length > 1 ? 'Pliki zostały przesłane' : 'Plik został przesłany', 'zamknij');
  }

  onListElementClick(lat, lng) {
    this.map.focusOnGeotag(lat, lng);
  }

  onMapAreaSelect(minLat, maxLat, minLng, maxLng) {
    this.sideDrawer.open();
    this.sideDrawer.showPhotosForArea(minLat, maxLat, minLng, maxLng);
  } 

  onMarkerClick(photoElementModels) {
    this.sideDrawer.open();
    this.sideDrawer.showPhotosForGeaotag(photoElementModels[0].latitude, photoElementModels[0].longitude);
  }

  onLocationSearchResults(results) {
    this.searchResultsComponent.open(results);
  }

  onSearchResultSelect(lat, lng, type) {
    if (type == 'city' || type == 'administrative') {
      this.map.setZoom(11);
    } else {
      this.map.setZoom(13);
    }
    this.map.focusOnGeotag(lat, lng);
  }

  /**
   * Pierdoly zeby ladnie wygladalo
   */
  initMDC() {
    const iconButton = document.querySelector('.mdc-icon-button')
    
    if (iconButton !== null){
      const iconButtonRipple = new MDCRipple(iconButton);
      iconButtonRipple.unbounded = true;
    }
  }

}