package no.isi.insight.planning.client.capture.view;

import no.isi.insight.planning.client.annotation.GenerateTypeScript;

/**
 * Represents an action that can be performed on a capture. The capture is automatically stopped
 * when a trip is ended.
 */
@GenerateTypeScript
public enum CaptureAction {
  RESUME,
  PAUSE
}
