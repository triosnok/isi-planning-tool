import { Geometry } from '@isi-insight/client';
import { Feature } from 'ol';
import WKT from 'ol/format/WKT';
import { LineString, Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import {
  Component,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';
import { useMap } from './MapRoot';
import { LayerProperty, LayerType } from './utils';

export interface MapRoadSegmentLayerProps {
  segment: Geometry;
  index: number;
  length: number;
  capturePosition?: Geometry;
}

const fmt = new WKT();

const SEGMENT_STYLE_INNER = new Style({
  stroke: new Stroke({
    color: 'rgba(255, 0, 255, 1)',
    width: 4,
  }),
});

const SEGMENT_STYLE_OUTER = new Style({
  stroke: new Stroke({
    color: 'rgba(255, 255, 255, 0.5)',
    width: 8,
  }),
});

const INDEX_STYLE = new Style({
  image: new Circle({
    radius: 8,
    fill: new Fill({
      color: 'rgba(0, 52, 125, 0.5)',
    }),
    stroke: new Stroke({
      color: 'rgba(0, 52, 125, 1)',
      width: 2,
    }),
  }),
});

const CAPTURE_POSITION_STYLE = new Style({
  image: new Circle({
    radius: 8,
    fill: new Fill({
      color: 'rgba(74, 149, 255, 0.5)',
    }),
    stroke: new Stroke({
      color: 'rgba(74, 149, 255, 1)',
      width: 2,
    }),
  }),
});

const MapRoadSegmentLayer: Component<MapRoadSegmentLayerProps> = (props) => {
  const { map } = useMap();
  const [segmentFeature, setSegmentFeature] =
    createSignal<Feature<LineString>>();
  const [segmentIndexFeature, setSegmentIndexFeature] =
    createSignal<Feature<Point>>();
  const [capturePositionFeature, setCapturePositionFeature] =
    createSignal<Feature<Point>>();

  onMount(() => {
    const segment = props.segment;
    const capturePosition = props.capturePosition;
    const segmentIndex = props.index;

    const features: Feature[] = [];
    const segmentFeature = fmt.readFeature(segment.wkt) as Feature<LineString>;

    segmentFeature.setStyle([SEGMENT_STYLE_OUTER, SEGMENT_STYLE_INNER]);

    setSegmentFeature(segmentFeature);

    const indexCoordinate = segmentFeature
      ?.getGeometry()
      ?.getCoordinateAt(segmentIndex);

    const segmentIndexFeature = new Feature({
      geometry: new Point(indexCoordinate ?? [0, 0]),
    });

    segmentIndexFeature.setStyle(INDEX_STYLE);

    setSegmentIndexFeature(segmentIndexFeature);

    const capturePositionFeature = capturePosition
      ? (fmt.readFeature(capturePosition.wkt) as Feature<Point>)
      : new Feature({ geometry: new Point([0, 0]) });

    capturePositionFeature.setStyle(CAPTURE_POSITION_STYLE);

    setCapturePositionFeature(capturePositionFeature);

    features.push(segmentFeature, segmentIndexFeature, capturePositionFeature);

    const layer = new VectorLayer({
      source: new VectorSource({
        features,
      }),
    });

    layer.setZIndex(30);

    layer.set(LayerProperty.LAYER_TYPE, LayerType.ROAD_SEGMENT);

    map.addLayer(layer);

    onCleanup(() => map.removeLayer(layer));
  });

  createEffect(() => {
    const segment = props.segment;
    const segmentFeat = segmentFeature();
    if (segment)
      segmentFeat?.setGeometry(fmt.readGeometry(segment.wkt) as LineString);
  });

  createEffect(() => {
    const segmentIndex = props.index;
    const length = props.length;
    const fraction = segmentIndex / length;

    const segmentIndexFeat = segmentIndexFeature();
    const indexCoordinate = segmentFeature()
      ?.getGeometry()
      ?.getCoordinateAt(fraction);

    if (indexCoordinate && segmentIndex)
      segmentIndexFeat?.setGeometry(new Point(indexCoordinate));
  });

  createEffect(() => {
    const capturePosition = props.capturePosition;
    const capturePositionFeat = capturePositionFeature();

    if (capturePosition) {
      capturePositionFeat?.setGeometry(
        fmt.readGeometry(capturePosition.wkt) as Point
      );
    } else {
      capturePositionFeat?.setGeometry(new Point([0, 0]));
    }
  });

  return null;
};

export default MapRoadSegmentLayer;
