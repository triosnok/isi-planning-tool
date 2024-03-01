package no.isi.insight.planning.utility;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

public class JdbcUtils {

  /**
   * Get a nullable LocalDate from a ResultSet.
   * 
   * @param rs          the ResultSet to get the LocalDate from
   * @param columnLabel the column label to get the LocalDate from
   * 
   * @return the LocalDate or null if the column value is null
   * 
   * @throws SQLException
   */
  public static LocalDate getNullableDate(
      ResultSet rs,
      String columnLabel
  ) throws SQLException {
    return Optional.ofNullable(rs.getDate(columnLabel)).map(Date::toLocalDate).orElse(null);
  }

  /**
   * Get a nullable LocalDateTime from a ResultSet.
   * 
   * @param rs          the ResultSet to get the LocalDateTime from
   * @param columnLabel the column label to get the LocalDateTime from
   * 
   * @return the LocalDateTime or null if the column value is null
   * 
   * @throws SQLException
   */
  public static LocalDateTime getNullableDateTime(
      ResultSet rs,
      String columnLabel
  ) throws SQLException {
    return Optional.ofNullable(rs.getTimestamp(columnLabel)).map(Timestamp::toLocalDateTime).orElse(null);
  }

}
