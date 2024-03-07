import { Component } from 'solid-js';
import { useMap } from './MapRoot';

const MapZoomControls: Component = () => {
  const ctx = useMap();

  return (
    <div>
      <button onClick={() => ctx.map.zoomIn(1)}>+</button>
      <button onClick={() => ctx.map.zoomOut(1)}>-</button>
    </div>
  );
};

export default MapZoomControls;
