package hr.fer.opp.radnovrijeme.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import hr.fer.opp.radnovrijeme.dao.RoleRepository;
import hr.fer.opp.radnovrijeme.domain.Role;
import hr.fer.opp.radnovrijeme.exceptions.EntityMissingException;
import hr.fer.opp.radnovrijeme.exceptions.RequestDeniedException;
import hr.fer.opp.radnovrijeme.service.EmployeeService;
import hr.fer.opp.radnovrijeme.service.RoleService;

@Service
public class RoleServiceJpa implements RoleService {

	@Autowired
	private RoleRepository roleRepo;

	@Autowired
	private EmployeeService employeeService;

	@Override
	public List<Role> listAll() {
		return roleRepo.findAll();
	}

	@Override
	public Role fetch(long roleId) {
		return roleRepo.findById(roleId).orElseThrow(() -> new EntityMissingException(Role.class, roleId));
	}

	@Override
	public Role createRole(Role role) {
		validate(role);
		Assert.isNull(role.getId(), "Role ID must be null, not: " + role.getId());
		if (roleRepo.countByName(role.getName()) > 0)
			throw new RequestDeniedException("Role with name " + role.getName() + " already exists");
		return roleRepo.save(role);
	}

	@Override
	public Role updateRole(Role role) {
		validate(role);
		Long roleId = role.getId();
		if (!roleRepo.existsById(roleId))
			throw new EntityMissingException(Role.class, roleId);
		if (roleRepo.existsByNameAndIdNot(role.getName(), roleId))
			throw new RequestDeniedException("Role with name " + role.getName() + " already exists");
		return roleRepo.save(role);
	}

	@Override
	public Role deleteRole(long roleId) {
		Role role = fetch(roleId);

		employeeService.listAll().stream().filter(e -> e.getRoleId().equals(roleId)).forEach(e -> {
			e.setRoleId(null);
			employeeService.updateEmployee(e);
		});

		roleRepo.delete(role);
		return role;
	}

	private void validate(Role role) {
		Assert.notNull(role, "Role object must be given");
		Assert.hasText(role.getName(), "Role name must be given");
	}

}
