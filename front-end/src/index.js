import './assets/styles/styles.scss';

import GeotagApp from './assets/js/app'
import PhotoService from './assets/js/service/photos_service';
import LocationService from './assets/js/service/location_service';

require('html-loader!./templates/index.html');

const app = new GeotagApp(new PhotoService(), new LocationService());

// L.marker([51.5, -0.09]).addTo(map)
//     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//     .openPopup();
