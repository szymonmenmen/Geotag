import './assets/styles/styles.scss';

import GeotagApp from './assets/js/app'
import PhotoService from './assets/js/service/photos_service';
import LocationService from './assets/js/service/location_service';

require('html-loader!./templates/index.html');

new GeotagApp(new PhotoService(), new LocationService());
