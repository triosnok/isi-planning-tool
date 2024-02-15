package no.isi.insight.planning.integration.nvdb;

import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

import no.isi.insight.planning.integration.nvdb.model.NvdbResponse;
import no.isi.insight.planning.integration.nvdb.model.NvdbRoadObject;

@HttpExchange
public interface NvdbClient {

  @GetExchange("/vegobjekter/{featureId}")
  ResponseEntity<NvdbResponse<NvdbRoadObject>> getRoadObjects(
      @PathVariable int featureId,
      @RequestParam MultiValueMap<String, String> parameters,
      @RequestHeader("X-Client-Session") String session
  );

  default ResponseEntity<NvdbResponse<NvdbRoadObject>> getRoadObjects(
      int featureId,
      MultiValueMap<String, String> parameters
  ) {
    return this.getRoadObjects(featureId, parameters, null);
  }

}
