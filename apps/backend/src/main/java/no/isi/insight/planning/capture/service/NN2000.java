package no.isi.insight.planning.capture.service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class NN2000 {
  private final BINReader reader;

  private static NN2000 INSTANCE = null;

  private NN2000() throws Exception {
    this.reader = new BINReader(this.getClass().getClassLoader().getResourceAsStream("HREF2018B_NN2000_EUREF89.bin"));
  }

  public static synchronized NN2000 getInstance() {
    if (INSTANCE == null) {
      try {
        INSTANCE = new NN2000();
      } catch (Exception e) {
        log.error("Failed to load NN2000 BIN file", e);
      }
    }

    return INSTANCE;
  }

  public BINReader getReader() {
    return this.reader;
  }

}
