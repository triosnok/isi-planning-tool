import { RailingStatus } from '@/lib/constants';
import { getRailingStatus } from '@/lib/utils';
import { RoadRailing } from '@isi-insight/client';
import { pointerMove } from 'ol/events/condition';
import { LineString } from 'ol/geom';
import Select from 'ol/interaction/Select';
import Layer, { Options } from 'ol/layer/Layer';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer';
import { Source } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { WebGLStyle } from 'ol/style/webgl';
import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
import { useMap } from './MapRoot';
import {
  FeatureProperty,
  LayerProperty,
  LayerType,
  parseFeature,
} from './utils';

export interface MapRailingLayerProps {
  railings?: RoadRailing[];
}

const DEFAULT_STYLE: WebGLStyle = {
  'stroke-color': ['*', ['get', FeatureProperty.COLOR], [220, 220, 220]],
  'stroke-width': ['get', FeatureProperty.WIDTH],
  'stroke-offset': 0,
  'stroke-pattern-src': '/railing-sprite.png',
  'stroke-pattern-size': [20, 20],
  'stroke-pattern-offset': [20, 0],
};

const HOVER_STYLE: WebGLStyle = {
  'stroke-color': ['*', ['get', FeatureProperty.COLOR], [220, 220, 220]],
  'stroke-width': ['get', FeatureProperty.WIDTH],
  'stroke-offset': 0,
  'stroke-pattern-offset': 10,
};

class WebGLLayer extends Layer {
  private style: WebGLStyle;

  constructor(options: Options<Source>, style?: WebGLStyle) {
    super(options);
    this.style = style ?? DEFAULT_STYLE;
  }

  createRenderer() {
    return new WebGLVectorLayerRenderer(this, {
      style: this.style,
    });
  }
}

// RailingStatus.TODO=brand-blue-400
// RailingStatus.ERROR=error-600
// RailingStatus.DONE=success-500
const getRailingColor = (completionGrade: number, alpha = 1) => {
  const status = getRailingStatus(completionGrade);
  if (status === RailingStatus.TODO) return [33, 125, 255, alpha];
  else if (status === RailingStatus.ERROR) return [220, 38, 38, alpha];
  return [16, 185, 129, alpha];
};

const MapRailingLayer: Component<MapRailingLayerProps> = (props) => {
  const { map } = useMap();
  const [hoveredRailing, setHoveredRailing] = createSignal<RoadRailing>();

  createEffect(() => {
    const polylines = props.railings
      ?.map((railing) => {
        const feature = parseFeature<LineString>(railing.geometry);
        feature.set(
          FeatureProperty.COLOR,
          getRailingColor(railing.captureGrade)
        );
        feature.set(FeatureProperty.RAILING, railing);
        feature.set(FeatureProperty.WIDTH, 10);
        return feature;
      })
      .filter(Boolean) as any;

    const lg = new WebGLLayer({
      source: new VectorSource({ features: polylines }),
      zIndex: 2,
    });

    lg.set(LayerProperty.LAYER_TYPE, LayerType.RAILING);

    const selectHover = new Select({
      condition: pointerMove,
      hitTolerance: 10,
      layers: (l) => l.get(LayerProperty.LAYER_TYPE) === LayerType.RAILING,
    });

    selectHover.on('select', (e) => {
      setHoveredRailing((prev) => {
        const next = e.selected[0]?.get(FeatureProperty.RAILING);
        if (prev?.id === next?.id) return prev;
        return next;
      });
    });

    map.addInteraction(selectHover);
    map.addLayer(lg);
    onCleanup(() => {
      map.removeLayer(lg);
      map.removeInteraction(selectHover);
    });
  });

  createEffect(() => {
    const hovered = hoveredRailing();
    if (hovered === undefined) {
      map.getTargetElement().style.cursor = '';
      return;
    }

    map.getTargetElement().style.cursor = 'pointer';
    const feature = parseFeature<LineString>(hovered?.geometry);

    feature.set(FeatureProperty.WIDTH, 15);
    feature.set(
      FeatureProperty.COLOR,
      getRailingColor(hovered?.captureGrade, 0.5)
    );

    const layer = new WebGLLayer(
      {
        source: new VectorSource({
          features: [feature],
        }),
        zIndex: 1,
      },
      HOVER_STYLE
    );

    layer.set(LayerProperty.LAYER_TYPE, LayerType.RAILING_HOVER);
    map.addLayer(layer);

    onCleanup(() => {
      map.removeLayer(layer);
    });
  });

  return null;
};

export default MapRailingLayer;
