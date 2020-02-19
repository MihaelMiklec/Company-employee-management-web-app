package hr.fer.opp.radnovrijeme.rest;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hr.fer.opp.radnovrijeme.domain.Role;
import hr.fer.opp.radnovrijeme.service.RoleService;

@CrossOrigin
@RestController
@RequestMapping("/roles")
public class RoleController {

	@Autowired
	private RoleService roleService;

	@GetMapping("")
	public List<Role> listRoles() {
		return roleService.listAll();
	}

	@GetMapping("/{id}")
	public Role getRole(@PathVariable("id") long id) {
		return roleService.fetch(id);
	}

	@PostMapping("")
	public ResponseEntity<Role> createRole(@RequestBody Role role) {
		Role saved = roleService.createRole(role);
		return ResponseEntity.created(URI.create("/roles/" + saved.getId())).body(saved);
	}

	@PutMapping("/{id}")
	public Role updateRole(@PathVariable("id") Long id, @RequestBody Role role) {
		if (!role.getId().equals(id))
			throw new IllegalArgumentException("Role ID must be preserved");
		return roleService.updateRole(role);
	}

	@DeleteMapping("/{id}")
	public Role deleteRole(@PathVariable("id") long id) {
		return roleService.deleteRole(id);
	}
}
