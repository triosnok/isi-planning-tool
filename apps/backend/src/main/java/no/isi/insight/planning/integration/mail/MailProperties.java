package no.isi.insight.planning.integration.mail;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("no.isi.insight.planning.integration.mail")
public record MailProperties(String senderAddress, Boolean enabled) {

  /**
   * Returns true if the mail service is enabled. Defaults to false if undefined.
   * 
   * @return true if the mail service is enabled
   */
  boolean isEnabled() {
    return this.enabled != null ? this.enabled : false;
  }

}
