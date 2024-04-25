import { RailingStatus } from '@/lib/constants';
import { getRailingStatus } from '@/lib/utils';
import { RoadRailing } from '@isi-insight/client';
import { pointerMove } from 'ol/events/condition';
import WKT from 'ol/format/WKT';
import Select from 'ol/interaction/Select';
import Layer, { Options } from 'ol/layer/Layer';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer';
import { Source } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { WebGLStyle } from 'ol/style/webgl';
import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
import { useMap } from './MapRoot';
import { FeatureProperty, LayerProperty, LayerType } from './utils';

export interface MapRailingLayerProps {
  railings?: RoadRailing[];
}

const DEFAULT_STYLE: WebGLStyle = {
  'stroke-color': ['*', ['get', FeatureProperty.COLOR], [220, 220, 220]],
  'stroke-width': ['get', FeatureProperty.WIDTH],
  'stroke-offset': 0,
  'stroke-pattern-src': '/ar.png',
  'stroke-pattern-offset': 10,
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

const fmt = new WKT();

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
        const feature = fmt.readFeature(railing.geometry.wkt);
        feature.set(
          FeatureProperty.COLOR,
          getRailingColor(railing.captureGrade)
        );
        feature.set('RAILING', railing);
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
        const next = e.selected[0]?.get('RAILING');
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
    const feature = fmt.readFeature(hovered?.geometry.wkt);

    feature.set(FeatureProperty.WIDTH, 15);
    feature.set(
      FeatureProperty.COLOR, [0, 255, 255, 1]
      //getRailingColor(hovered?.captureGrade, 0.7)
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
