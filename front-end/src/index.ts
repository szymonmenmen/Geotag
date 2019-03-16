import './assets/styles/styles.scss';

import GeotagApp from './assets/js/app'

require('html-loader!./templates/index.html');

const app = new GeotagApp();

// L.marker([51.5, -0.09]).addTo(map)
//     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//     .openPopup();
