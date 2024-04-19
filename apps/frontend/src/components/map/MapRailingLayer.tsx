import { RoadRailing } from '@isi-insight/client';
import WKT from 'ol/format/WKT';
import Layer from 'ol/layer/Layer';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer';
import VectorSource from 'ol/source/Vector';
import { WebGLStyle } from 'ol/style/webgl';
import { Component, createEffect, onCleanup } from 'solid-js';
import { useMap } from './MapRoot';

export interface MapRailingLayerProps {
  railings?: RoadRailing[];
}

const style: WebGLStyle = {
  'stroke-color': ['*', ['get', 'COLOR'], [220, 220, 220]],
  'stroke-width': 10,
  'stroke-offset': 0,
  'stroke-pattern-src': '/ar.png',
  'stroke-pattern-offset': 10,
  'fill-color': ['*', ['get', 'COLOR'], [255, 255, 255, 0.6]],
};

class WebGLLayer extends Layer {
  createRenderer() {
    return new WebGLVectorLayerRenderer(this, {
      style,
    });
  }
}

const fmt = new WKT();

const MapRailingLayer: Component<MapRailingLayerProps> = (props) => {
  const { map } = useMap();

  const getRailingColor = (completionGrade: number) => {
    if (completionGrade === 0) return [0, 0, 255, 1];
    else if (completionGrade > 0 && completionGrade < 95) return [255, 0, 0, 1];
    else if (completionGrade >= 95 && completionGrade <= 120)
      return [0, 255, 0, 1];
    else return undefined;
  };

  createEffect(() => {
    const polylines = props.railings
      ?.map((railing) => {
        const feature = fmt.readFeature(railing.geometry.wkt);
        feature.set('COLOR', getRailingColor(railing.captureGrade));
        return feature;
      })
      .filter(Boolean) as any;

    const lg = new WebGLLayer({
      source: new VectorSource({ features: polylines }),
    });

    map.addLayer(lg);
    onCleanup(() => map.removeLayer(lg));
  });

  return null;
};

export default MapRailingLayer;
