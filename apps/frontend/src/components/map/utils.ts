import { Geometry as ClientGeometry } from '@isi-insight/client';
import { Feature } from 'ol';
import WKT from 'ol/format/WKT';
import { Geometry } from 'ol/geom';

export const enum FeatureProperty {
  RAILING = 'RAILING',
  WIDTH = 'WIDTH',
  COLOR = 'COLOR',
}

export const enum LayerProperty {
  LAYER_TYPE = 'LAYERTYPE',
}

export const enum LayerType {
  RAILING = 'RAILING',
  RAILING_HOVER = 'RAILING_HOVER',
  ROAD_SEGMENT = 'ROAD_SEGMENT',
}

export const WKTFormat = new WKT();

export const parseGeometry = <T extends Geometry>(
  geometry: ClientGeometry
): T => {
  return WKTFormat.readGeometry(geometry.wkt, {
    dataProjection: 'EPSG:' + geometry.srid,
    featureProjection: 'EPSG:25833',
  }) as T;
};

export const parseFeature = <T extends Geometry>(
  geometry: ClientGeometry
): Feature<T> => {
  return WKTFormat.readFeature(geometry.wkt, {
    dataProjection: 'EPSG:' + geometry.srid,
    featureProjection: 'EPSG:25833',
  }) as Feature<T>;
};
