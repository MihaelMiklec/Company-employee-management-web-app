package hr.fer.opp.radnovrijeme.rest;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/user")
public class UserController {

	@GetMapping
	public User getCurrentUser(@AuthenticationPrincipal User user) {
		SecurityContextHolder.getContext().getAuthentication().getName();
		return user;
	}

}
