import * as L from 'leaflet';

export const markerForUser = {
  markerUserIcon: {
    icon: L.icon({
      iconSize: [25, 25],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      iconUrl: 'assets/img/myLocation.png',
    }),
  },
  popupUserInfo: `<b style="color: black; background-color: white">Your location</b>`,
};
