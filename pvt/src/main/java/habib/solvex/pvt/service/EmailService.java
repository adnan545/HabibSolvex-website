package habib.solvex.pvt.service;

import habib.solvex.pvt.model.ContactForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${app.email.to:info@habibsolvex.com}")
    private String toEmail;

    @Value("${app.email.cc:sales@habibsolvex.com}")
    private String ccEmail;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public boolean sendHtmlEmail(ContactForm contactForm) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setCc(ccEmail);
            helper.setSubject("New Contact Form Submission: " + contactForm.getSubject());
            
            Context context = new Context();
            context.setVariable("name", contactForm.getName());
            context.setVariable("email", contactForm.getEmail());
            context.setVariable("company", contactForm.getCompany());
            context.setVariable("phone", contactForm.getPhone());
            context.setVariable("subject", contactForm.getSubject());
            context.setVariable("message", contactForm.getMessage());
            context.setVariable("inquiryType", contactForm.getInquiryType());
            context.setVariable("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss")));
            
            String htmlContent = templateEngine.process("email-template", context);
            helper.setText(htmlContent, true);
            
            mailSender.send(mimeMessage);
            return true;
        } catch (MessagingException | MailException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean sendAutoReply(ContactForm contactForm) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(contactForm.getEmail());
            helper.setSubject("Thank you for contacting Habib Solvex");
            
            Context context = new Context();
            context.setVariable("name", contactForm.getName());
            context.setVariable("inquiryType", contactForm.getInquiryType());
            
            String htmlContent = templateEngine.process("auto-reply-template", context);
            helper.setText(htmlContent, true);
            
            mailSender.send(mimeMessage);
            return true;
        } catch (MessagingException | MailException e) {
            e.printStackTrace();
            return false;
        }
    }
}