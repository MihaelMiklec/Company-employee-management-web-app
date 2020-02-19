package hr.fer.opp.radnovrijeme.service.impl;

import static org.springframework.security.core.authority.AuthorityUtils.commaSeparatedStringToAuthorityList;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import hr.fer.opp.radnovrijeme.dto.EmployeeDTO;
import hr.fer.opp.radnovrijeme.service.EmployeeService;
import hr.fer.opp.radnovrijeme.service.RoleService;

import static hr.fer.opp.radnovrijeme.domain.Role.*;

@Service
public class EmployeeDetailsServiceImpl implements UserDetailsService {

	@Autowired
	private EmployeeService employeeService;

	@Autowired
	private RoleService roleService;
	
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		try {
			EmployeeDTO employee = employeeService.findByUsername(username);

			return new User(employee.getUsername(), employee.getPassword(), authorities(username));

		} catch (Exception e) {
			throw new UsernameNotFoundException("Username '" + username + "' not found");
		}
	}

	private List<GrantedAuthority> authorities(String username) {
		if (username.equals("admin"))
			return commaSeparatedStringToAuthorityList(
					ROLE_ADMIN + ", " + ROLE_OWNER + ", " + ROLE_LEAD + ", " + ROLE_EMPLOYEE);

		EmployeeDTO employee = employeeService.findByUsername(username);
		String roleName = roleService.fetch(employee.getRoleId()).getName();

		if (roleName.equals(ROLE_OWNER))
			return commaSeparatedStringToAuthorityList(ROLE_OWNER + ", " + ROLE_LEAD + ", " + ROLE_EMPLOYEE);
		
		if (roleName.equals(ROLE_LEAD))
			return commaSeparatedStringToAuthorityList(ROLE_LEAD + ", " + ROLE_EMPLOYEE);

		return commaSeparatedStringToAuthorityList(ROLE_EMPLOYEE);
	}

}
