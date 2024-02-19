import Leaflet from 'leaflet';
import { Component, onMount } from 'solid-js';
import { useMap } from './MapRoot';
import { parse } from 'wellknown';

const MapRailingLayer: Component = () => {
  const { map } = useMap();

  var pointA = new Leaflet.LatLng(5, 5);
  var pointB = new Leaflet.LatLng(-5, -5);
  var pointList = [pointA, pointB];

  onMount(() => {
    var firstpolyline = new Leaflet.Polyline(pointList, {
      color: 'red',
      weight: 2,
      opacity: 1,
      smoothFactor: 1,
    });

    var linestring = parse('LINESTRING (6 2, 3 8, 4 -15)');
    var geoJsonLayer = Leaflet.geoJson(linestring!);
    geoJsonLayer.addTo(map);

    firstpolyline.addTo(map);
    map.fitBounds(firstpolyline.getBounds());

    // console.log(firstpolyline);
    // console.log(geoJsonLayer);
  });

  return null;
};

export default MapRailingLayer;
