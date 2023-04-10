import * as L from 'leaflet';

export const userData = {
  markerUserIcon: {
    icon: L.icon({
      iconSize: [25, 25],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: 'assets/img/myLocation.png',
      // shadowUrl:
      //   'https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png',
    }),
  },
  popupUserInfo: `<b style="color: black; background-color: white">Your location</b>`,
};
