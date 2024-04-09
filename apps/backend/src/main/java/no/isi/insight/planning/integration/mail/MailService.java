package no.isi.insight.planning.integration.mail;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.model.UserAccount;

@Service
@RequiredArgsConstructor
public class MailService {
  private final JavaMailSender mailSender;
  private final MailProperties properties;

  /**
   * Sends an email to the given user account.
   * 
   * @param userAccount the user account to send the email to
   * @param subject     the subject of the email
   * @param text        the text of the email
   */
  public void send(
      UserAccount userAccount,
      String subject,
      String text
  ) {
    if (!this.properties.isEnabled()) {
      return;
    }

    var message = new SimpleMailMessage();

    message.setFrom(this.properties.senderAddress());
    message.setTo(userAccount.getEmail());
    message.setSubject(subject);
    message.setText(text);

    this.mailSender.send(message);
  }

}
