import Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';
import 'proj4leaflet';
import {
  Component,
  JSX,
  Show,
  createContext,
  createSignal,
  onMount,
  useContext,
} from 'solid-js';
import { Geometry } from '@isi-insight/client';

export interface MapContextValue {
  map: Leaflet.Map;
}

const PROJECTIONS: Record<number, Leaflet.Proj.CRS> = {
  5973: new Leaflet.Proj.CRS(
    'EPSG:25833',
    '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +vunits=m +no_defs +type=crs',
    {
      resolutions: [
        21674.7100160867, 10837.3550080434, 5418.67750402168, 2709.33875201084,
        1354.66937600542, 677.334688002709, 338.667344001355, 169.333672000677,
        84.6668360003387, 42.3334180001693, 21.1667090000847, 10.5833545000423,
        5.29167725002117, 2.64583862501058, 1.32291931250529, 0.661459656252646,
        0.330729828126323, 0.165364914063161,
      ],
      origin: [-2500000, 9045984],
    }
  ),
};

export const parse = (geometry: Geometry) => {
  const stripped = geometry.wkt
    .replace('LINESTRING(', '')
    .replace('LINESTRING Z(', '')
    .replace('POINT(', '')
    .replace(')', '');

  const rawCoords = stripped.split(',');
  const projection = PROJECTIONS[geometry.srid];

  return rawCoords.map((pair) => {
    const [x, y] = pair
      .trim()
      .split(' ')
      .map((n) => parseFloat(n));

    if (projection !== undefined) {
      return projection.unproject(new Leaflet.Point(x, y));
    }

    return new Leaflet.LatLng(y, x);
  });
};

export const parsePoint = (geometry: Geometry) => {
  const points = parse(geometry);

  if (points.length < 1) {
    throw new Error('No points in geometry');
  }

  return points[0];
};

const MapContext = createContext<MapContextValue>();

export const MapRoot: Component<{
  children?: JSX.Element;
  class?: string;
  customZoom?: boolean;
}> = (props) => {
  const [map, setMap] = createSignal<Leaflet.Map>();

  let container: HTMLDivElement | undefined;

  onMount(() => {
    if (!container) return;

    const map = Leaflet.map(container, {
      center: [62.46, 6.4],
      zoom: 9,
      crs: PROJECTIONS[5973],
      zoomControl: !props.customZoom,
    });

    const layer = new Leaflet.TileLayer(
      'https://services.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 16,
        minZoom: 3,
        className: 'insight-map-tile-layer',
      }
    );
  
    map.addLayer(layer);
    setMap(map);
  });

  return (
    <div class={props.class}>
      <div class='h-full w-full' ref={container} />
      <Show when={map() !== undefined}>
        <MapContext.Provider value={{ map: map()! }}>
          {props.children}
        </MapContext.Provider>
      </Show>
    </div>
  );
};

export const useMap = () => {
  const ctx = useContext(MapContext);

  if (!ctx) {
    throw new Error('useMap must be used within a MapRoot');
  }

  return ctx;
};

export default MapRoot;
