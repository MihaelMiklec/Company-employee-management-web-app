package hr.fer.opp.radnovrijeme.service;

import java.util.List;

import org.springframework.stereotype.Service;

import hr.fer.opp.radnovrijeme.domain.Role;

@Service
public interface RoleService {
	

	List<Role> listAll();

	Role fetch(long roleId);
	
	Role createRole(Role role);

	Role updateRole(Role role);

	Role deleteRole(long roleId);
}
