// /* eslint-disable */
// export const displayMap = locations => {
//   mapboxgl.accessToken =
//     'pk.eyJ1IjoicmFodWxoaXJhZ29uZCIsImEiOiJjbTZ3MWw1NnEwZW85MnFwdDNmaHgzc3NoIn0.sC6iwUud989wSQT-lEWdNg'
//   var map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/jonasschmedtmann/cjvi9q8jd04mi1cpgmg7ev3dy',
//     scrollZoom: false
//     // center: [-118.113491, 34.111745],
//     // zoom: 10,
//     // interactive: false
//   });
//   // Add navigation control (the +/- zoom buttons)
//   const nav = new mapboxgl.NavigationControl({
//     showCompass: false
//   });
//   map.addControl(nav, 'top-right');
//   const bounds = new mapboxgl.LngLatBounds();

//   locations.forEach(loc => {
//     // Create marker
//     const el = document.createElement('div');
//     el.className = 'marker';

//     // Add marker
//     new mapboxgl.Marker({
//       element: el,
//       anchor: 'bottom'
//     })
//       .setLngLat(loc.coordinates)
//       .addTo(map);

//     // Add popup
//     new mapboxgl.Popup({
//       offset: 30
//     })
//       .setLngLat(loc.coordinates)
//       .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
//       .addTo(map);

//     // Extend map bounds to include current location
//     bounds.extend(loc.coordinates);
//   });

//   map.fitBounds(bounds, {
//     padding: {
//       top: 200,
//       bottom: 150,
//       left: 100,
//       right: 100
//     }
//   });
// };

console.log('Hello from the mapbox.js file');
var locations = [];
document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('map');
  if (mapElement) {
    locations = JSON.parse(mapElement.dataset.locations);
    console.log(locations);
  } else {
    console.error('Map element not found');
  }
});

console.log(typeof mapboxgl);

mapboxgl.accessToken = 'pk.eyJ1IjoicmFodWxoaXJhZ29uZCIsImEiOiJjbTZ3MWw1NnEwZW85MnFwdDNmaHgzc3NoIn0.sC6iwUud989wSQT-lEWdNg';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/rahulhiragond/cm6x87fx401c101sa2pw31l85',
  // center: [73.77645012062096, 18.519496970807293],
  zoom: 10,
  interactive: false 
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {

  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});
