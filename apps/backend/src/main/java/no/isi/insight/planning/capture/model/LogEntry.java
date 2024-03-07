package no.isi.insight.planning.capture.model;

public abstract class LogEntry implements Comparable<LogEntry> {

  public abstract Long getTimestamp();

  @Override
  public int compareTo(
      LogEntry o
  ) {
    return Long.compare(this.getTimestamp(), o.getTimestamp());
  }

}
