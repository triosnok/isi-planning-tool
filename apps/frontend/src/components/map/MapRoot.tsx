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
    const map = Leaflet.map(container, {
      center: [0, 0],
      zoom: 7,
    });
    const layer = new TileLayer(
      'https://services.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer/tile/{z}/{y}/{x}',
      {}
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
