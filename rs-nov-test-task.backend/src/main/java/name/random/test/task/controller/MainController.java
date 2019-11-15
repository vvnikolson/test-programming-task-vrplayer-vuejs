package name.random.test.task.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class MainController {

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String indexPage() {
        return "index";
    }

    @RequestMapping(value = "/{path:[^\\.]+}/**", method = RequestMethod.GET)
    public String forwarding() {
        return "forward:/";
    }
}
