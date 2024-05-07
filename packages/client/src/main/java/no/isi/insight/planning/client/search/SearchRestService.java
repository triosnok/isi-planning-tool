package no.isi.insight.planning.client.search;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

import no.isi.insight.planning.client.search.view.SearchResult;

import java.util.List;

@HttpExchange("/api/v1/search")
public interface SearchRestService {

  @GetExchange
  List<SearchResult> search(
      @RequestParam String phrase
  );

}
