package name.random.test.task.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class MainController {
    @Value("${spring.profiles.active:prod}")
    private String profile;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String indexPage(Model model) {
        model.addAttribute("isDevMode", "dev".equals(profile));
        return "index";
    }

/*    @RequestMapping(value = "/{path:[^\\.]+}/**", method = RequestMethod.GET)
    public String forwarding() {
        return "forward:/";
    }*/
}
