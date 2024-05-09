import { ParentComponent } from 'solid-js';
import { useMap } from './MapRoot';

export interface MapContainerProps {
  class?: string;
}

const MapContainer: ParentComponent<MapContainerProps> = (props) => {
  const ctx = useMap();

  return (
    <div class={props.class}>
      <div ref={ctx.setTarget} class='h-full w-full' />

      {props.children}
    </div>
  );
};

export default MapContainer;
