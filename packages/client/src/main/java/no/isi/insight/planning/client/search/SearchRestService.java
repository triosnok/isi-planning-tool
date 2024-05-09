package no.isi.insight.planning.client.search;

import java.util.List;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import no.isi.insight.planning.client.search.view.SearchResult;

@Tag(name = "Search", description = "Operations for searching across multiple collections")
@HttpExchange("/api/v1/search")
public interface SearchRestService {

  @Operation(
    summary = "Searches in the system for entities matching the given phrase",
    description = "Searches across multiple collections for entities matching the given phrase"
  )
  @GetExchange
  List<SearchResult> search(
      @RequestParam String phrase
  );

}
