package habib.solvex.pvt.controller;

import habib.solvex.pvt.model.ContactForm;
import habib.solvex.pvt.model.EmailResponse;
import habib.solvex.pvt.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class ContactController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/contact")
    public String showContactForm(Model model) {
        if (!model.containsAttribute("contactForm")) {
            model.addAttribute("contactForm", new ContactForm());
        }
        return "contact";
    }

    @PostMapping("/contact/submit")
    public String submitContactForm(
            @Valid @ModelAttribute("contactForm") ContactForm contactForm,
            BindingResult bindingResult,
            RedirectAttributes redirectAttributes) {

        if (bindingResult.hasErrors()) {
            redirectAttributes.addFlashAttribute("contactForm", contactForm);
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.contactForm", bindingResult);
            redirectAttributes.addFlashAttribute("error", "Please fix the errors and try again.");
            return "redirect:/contact#contact-form";
        }

        try {
            boolean emailSent = emailService.sendHtmlEmail(contactForm);
            
            if (emailSent) {
                emailService.sendAutoReply(contactForm);
                redirectAttributes.addFlashAttribute("success", "Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.");
            } else {
                redirectAttributes.addFlashAttribute("error", "There was an error sending your message. Please try again or contact us directly.");
            }

            return "redirect:/contact#contact-form";

        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "An unexpected error occurred. Please try again later.");
            return "redirect:/contact#contact-form";
        }
    }

    @PostMapping("/api/contact")
    @ResponseBody
    public ResponseEntity<EmailResponse> submitContactFormApi(@Valid @RequestBody ContactForm contactForm) {
        try {
            boolean emailSent = emailService.sendHtmlEmail(contactForm);
            
            if (emailSent) {
                emailService.sendAutoReply(contactForm);
                return ResponseEntity.ok(new EmailResponse(true, 
                    "Thank you! Your message has been sent successfully. We'll get back to you within 24 hours."));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new EmailResponse(false, "Failed to send email. Please try again."));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new EmailResponse(false, "Error: " + e.getMessage()));
        }
    }
}