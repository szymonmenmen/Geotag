import './assets/styles/styles.scss';
import MapComponent from './assets/js/map';

require('html-loader!./templates/index.html');

let mapComponent = new MapComponent('mapid');
console.log(indexPage.sayHello());

// L.marker([51.5, -0.09]).addTo(map)
//     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//     .openPopup();
