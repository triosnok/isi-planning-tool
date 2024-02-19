import Leaflet, { TileLayer } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Component,
  JSX,
  Show,
  createContext,
  createSignal,
  onMount,
  useContext,
} from 'solid-js';
import proj4 from 'proj4leaflet';

export interface MapContextValue {
  map: Leaflet.Map;
}

const MapContext = createContext<MapContextValue>();

export const MapRoot: Component<{ children?: JSX.Element; class?: string }> = (
  props
) => {
  const [map, setMap] = createSignal<Leaflet.Map>();

  let container: HTMLDivElement | undefined;

  onMount(() => {
    if (!container) return;

    // const crs = new Leaflet.Proj.CRS(
    //   'EPSG:25833',
    //   '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs',
    //   {
    //     resolutions: [8192, 4096, 2048, 1024, 512, 256, 128],
    //     origin: [-2500000, 9045984],
    //   }
    // );

    // https://epsg.io/25833

    const map = Leaflet.map(container, {
      center: [203174.5, 6876298.5],
      zoom: 7,
      // crs: crs,
    });

    // better way to do this is to change maxZoom to length of resolution list from crs i think
    const layer = new TileLayer(
      'https://services.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 14, minZoom: 0 }
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
