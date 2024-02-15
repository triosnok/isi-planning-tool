package no.isi.insight.planning.integration.nvdb.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonAlias;

public record NvdbResponse<T>(@JsonAlias("objekter") List<T> objects, NvdbResponseMetadata metadata) {}
