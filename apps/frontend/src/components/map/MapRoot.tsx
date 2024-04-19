import { Map, View } from 'ol';
import TileLayer from 'ol/layer/WebGLTile';
import { Projection } from 'ol/proj';
import { XYZ } from 'ol/source';
import { TileGrid } from 'ol/tilegrid';
import {
  Component,
  JSX,
  Show,
  createContext,
  createSignal,
  onMount,
  useContext,
} from 'solid-js';
import './style.css';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';

proj4.defs(
  'EPSG:25833',
  '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
);

register(proj4);

export interface MapContextValue {
  map: Map;
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
}> = (props) => {
  const [map, setMap] = createSignal<Map>();
  let container: HTMLDivElement;

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

  return (
    <div class={props.class}>
      <div class='h-full w-full' ref={container!} />
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
