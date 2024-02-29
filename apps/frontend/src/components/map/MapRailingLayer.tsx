import Leaflet from 'leaflet';
import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
import { parse, useMap } from './MapRoot';

const MapRailingLayer: Component = () => {
  const { map } = useMap();
  const [renderRail, setRenderRail] = createSignal(false);

  const linestring = parse(
    'LINESTRING Z(204510.73 6876165.9 437.779, 204510.57 6876165.41 437.859, 204510.2 6876165.2 437.909, 204509.27 6876164.91 438.069, 204508.32 6876164.93 438.139, 204507.4 6876165.35 438.209, 204506.76 6876166.1 438.249, 204504.55 6876169.42 438.269, 204502.15 6876172.6 438.259, 204499.55 6876175.6 438.289, 204496.67 6876178.45 438.349, 204494.01 6876181.48 438.389, 204474.9 6876216.68 438.509, 204456.94 6876252.44 438.578, 204443.03 6876281.23 438.608, 204437.89 6876292.08 438.668, 204420.73 6876328.28 438.768, 204403.84 6876364.54 438.818, 204386.94 6876400.86 438.938, 204378.5 6876418.98 438.978, 204371.79 6876433.48 438.998, 204356.56 6876466.13 439.068, 204348.07 6876484.3 439.118, 204339.69 6876502.45 439.088, 204322.81 6876538.79 439.088, 204305.82 6876574.95 438.948, 204292.3 6876604.04 438.768, 204288.59 6876612.14 438.628)'
  );

  const line = Leaflet.polyline(linestring, {
    color: 'blue',
    weight: 8,
    opacity: 1,
    smoothFactor: 1,
  });

  createEffect(() => {
    const shouldRender = renderRail();
    if (shouldRender) line.addTo(map);
    onCleanup(() => shouldRender && line.removeFrom(map));
  });

  //example usage, render on & off every second
  setInterval(() => {
    setRenderRail(!renderRail());
  }, 1000);

  map.fitBounds(line.getBounds());

  return null;
};

export default MapRailingLayer;
