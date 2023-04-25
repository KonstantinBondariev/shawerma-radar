import * as L from 'leaflet';

export class MyControl extends L.Control {
  userСoordinates: {
    lat: number;
    lon: number;
  };

  constructor(userСoordinates: { lat: number; lon: number }) {
    super();
    this.userСoordinates = userСoordinates;
  }

  override onAdd(map: L.Map) {
    const button = L.DomUtil.create('button', 'my-control');
    button.innerHTML = 'My location';
    button.addEventListener('click', () => this.showMyLocation(map));

    return button;
  }

  showMyLocation(map: L.Map) {
    const currentLatLng: L.LatLng = L.latLng(
      this.userСoordinates.lat,
      this.userСoordinates.lon
    );
    map.setView(currentLatLng);
  }

  override onRemove(map: L.Map) {
    // Cleanup function
  }
}
