package no.isi.insight.planning.integration.nvdb;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.integration.nvdb.model.NvdbRoadObjectType;
import no.isi.insight.planning.integration.nvdb.model.NvdbRoadObject;

@Slf4j
@Service
@RequiredArgsConstructor
public class RailingImportService {
  private final NvdbClient nvdb;

  /**
   * Imports a list of railings from NVDB API URL.
   * 
   * @param url a reference URL to copy parameters from
   * 
   * @return a list of railings, imported from NVDB
   */
  public List<NvdbRoadObject> importRailings(
      String url
  ) {
    log.info("Beginning import of railings from NVDB, using url: {}", url);
    var start = System.currentTimeMillis();
    var uriComponents = UriComponentsBuilder.fromHttpUrl(url).build();
    var host = uriComponents.getHost();

    if (!host.endsWith(".vegvesen.no")) {
      log.warn("Illegal attempt to import data from a non Vegvesen domain: {}", host);
      throw new RuntimeException("Unexpected host, not belonging to Vegvesens domain.");
    }

    var params = new LinkedMultiValueMap<String, String>();

    // copied urls contain encoded query parameters, we need to
    // decode them to avoid encoding the already encoded parameters
    uriComponents.getQueryParams().forEach((key, values) -> {
      values.forEach(value -> {
        params.add(key, URLDecoder.decode(value, StandardCharsets.UTF_8));
      });
    });

    ArrayList<NvdbRoadObject> importedObjects = null;
    var sessionId = UUID.randomUUID().toString();

    int count = 0;
    int returned = 0;
    int pageSize = 0;

    do {
      var response = this.nvdb.getRoadObjects(NvdbRoadObjectType.RAILING.ID, params, sessionId);
      var body = response.getBody();
      var meta = body.metadata();

      if (importedObjects == null) {
        importedObjects = new ArrayList<>(meta.total());
      }

      importedObjects.addAll(body.objects());

      var nextPageStart = body.metadata().nextPage().start();
      params.addIfAbsent("start", nextPageStart);

      if (params.containsKey("start")) {
        params.replace("start", List.of(nextPageStart));
      }

      returned = meta.returned();
      pageSize = meta.pageSize();

      count += returned;
      log.info("Processed {} out of {} railings", count, meta.total());
    } while (returned == pageSize);

    log.info("Imported {} railings in {} ms", importedObjects.size(), System.currentTimeMillis() - start);
    return importedObjects;
  }

}
