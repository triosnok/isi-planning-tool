package no.isi.insight.planning.search.controller;

import java.util.List;

import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.client.search.SearchRestService;
import no.isi.insight.planning.client.search.view.SearchResult;
import no.isi.insight.planning.db.repository.SearchJdbcRepository;

@RestController
@RequiredArgsConstructor
public class SearchRestServiceImpl implements SearchRestService {
  private final SearchJdbcRepository jdbcRepository;

  @Override
  public List<SearchResult> search(
      String phrase
  ) {
    return this.jdbcRepository.search(phrase, 0);
  }

}
