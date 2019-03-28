                                                
/**
 * Konfiguracja aplikacji
 */
let appConfig;
export default appConfig = {
  baseServerAddress: 'http://localhost:90/backend/api/', // Moja konfiguracja apache'a
  endpoins: {
    image: 'geotag',
    coordinates: 'geotag/coordinates',
    coordinatesRange: 'geotag/coordinates/range',
    thumbnail: 'downloads/thumbnail',
    geotags: 'geotag/localization',
    download: 'downloads'
  }
};