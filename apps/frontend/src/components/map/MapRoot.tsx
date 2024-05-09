import { Map, View } from 'ol';
import { DragPan, DragZoom, KeyboardPan, MouseWheelZoom } from 'ol/interaction';
import TileLayer from 'ol/layer/WebGLTile';
import { Projection } from 'ol/proj';
import { register } from 'ol/proj/proj4';
import { XYZ } from 'ol/source';
import { TileGrid } from 'ol/tilegrid';
import proj4 from 'proj4';
import {
  Accessor,
  Component,
  JSX,
  Show,
  createContext,
  createEffect,
  createSignal,
  onMount,
  useContext,
} from 'solid-js';
import './style.css';

proj4.defs(
  'EPSG:25833',
  '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
);

register(proj4);

export interface MapContextValue {
  map: Map;
  follow: Accessor<boolean>;
  toggleFollow: () => void;
  setTarget: (element: HTMLElement) => void;
}

export const EPSG25833 = new Projection({
  code: 'EPSG:25833',
  extent: [-25e5, 35e5, 3045984, 9045984],
  units: 'm',
});

export const geodataResolutions = [
  21674.7100160867, 10837.35500804335, 5418.677504021675, 2709.3387520108377,
  1354.6693760054188, 677.3346880027094, 338.6673440013547, 169.33367200067735,
  84.66683600033868, 42.33341800016934, 21.16670900008467, 10.583354500042335,
  5.291677250021167, 2.6458386250105836, 1.3229193125052918, 0.6614596562526459,
  0.33072982812632296, 0.16536491406316148, 0.08268245703158074,
];

const MapContext = createContext<MapContextValue>();

export const MapRoot: Component<{
  children?: JSX.Element;
  class?: string;
  customZoom?: boolean;
  follow?: boolean;
}> = (props) => {
  const [map, setMap] = createSignal<Map>();
  const [target, setTarget] = createSignal<HTMLElement>();
  const [follow, setFollow] = createSignal(props.follow ?? false);
  let container: HTMLDivElement;

  const toggleFollow = () => setFollow((v) => !v);

  onMount(() => {
    const mountedMap = new Map({
      target: container,
      controls: [],
      layers: [
        new TileLayer({
          preload: 8,
          className: 'insight-map-tile-layer',
          source: new XYZ({
            crossOrigin: 'Anonymous',
            projection: EPSG25833,
            tileGrid: new TileGrid({
              extent: EPSG25833.getExtent(),
              origin: [-2500000, 9045984],
              resolutions: geodataResolutions,
            }),
            url: 'https://services.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer/tile/{z}/{y}/{x}',
          }),
        }),
      ],
      view: new View({
        center: [124382.31086361589, 6957716.86008026],
        zoom: 8,
        maxZoom: 16,
        minZoom: 3,
        projection: EPSG25833,
      }),
    });

    setMap(mountedMap);
  });

  // sets the target element of the map, registered to the context by using
  // the MapContainer component
  createEffect(() => {
    const targetElement = target();
    const mapInstance = map();

    mapInstance?.setTarget(targetElement);
  });

  createEffect(() => {
    const following = follow();

    map()
      ?.getInteractions()
      .forEach((int) => {
        if (
          int instanceof KeyboardPan ||
          int instanceof DragPan ||
          int instanceof DragZoom ||
          int instanceof MouseWheelZoom
        ) {
          int.setActive(!following);
        }
      });
  });

  return (
    <Show when={map()}>
      {(map) => (
        <MapContext.Provider
          value={{ map: map(), follow, toggleFollow, setTarget }}
        >
          {props.children}
        </MapContext.Provider>
      )}
    </Show>
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
