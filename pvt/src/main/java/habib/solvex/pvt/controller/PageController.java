package habib.solvex.pvt.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class PageController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("currentPage", "home");
        return "index";
    }

    @GetMapping("/about")
    public String about(Model model) {
        model.addAttribute("currentPage", "about");
        return "about";
    }

    @GetMapping("/products")
    public String products(Model model) {
        model.addAttribute("currentPage", "products");
        return "products";
    }

    @GetMapping("/products/{product}")
    public String productDetail(@PathVariable String product, Model model) {
        model.addAttribute("currentPage", "products");
        return "product-detail";
    }

    @GetMapping("/manufacturing")
    public String manufacturing(Model model) {
        model.addAttribute("currentPage", "manufacturing");
        return "manufacturing";
    }

    @GetMapping("/quality")
    public String quality(Model model) {
        model.addAttribute("currentPage", "quality");
        return "quality";
    }

    @GetMapping("/industries")
    public String industries(Model model) {
        model.addAttribute("currentPage", "industries");
        return "industries";
    }

    @GetMapping("/export")
    public String export(Model model) {
        model.addAttribute("currentPage", "export");
        return "export";
    }
}