
package hr.fer.opp.radnovrijeme.service.impl;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import hr.fer.opp.radnovrijeme.dao.EmployeeRepository;
import hr.fer.opp.radnovrijeme.domain.Employee;
import hr.fer.opp.radnovrijeme.dto.EmployeeDTO;
import hr.fer.opp.radnovrijeme.exceptions.EntityMissingException;
import hr.fer.opp.radnovrijeme.exceptions.RequestDeniedException;
import hr.fer.opp.radnovrijeme.service.ActivityService;
import hr.fer.opp.radnovrijeme.service.CompanyService;
import hr.fer.opp.radnovrijeme.service.EmployeeService;
import hr.fer.opp.radnovrijeme.service.GroupService;
import hr.fer.opp.radnovrijeme.service.RoleService;
import hr.fer.opp.radnovrijeme.service.TaskService;

@Service
public class EmployeeServiceJpa implements EmployeeService {

	@Autowired
	private EmployeeRepository employeeRepo;

	@Autowired
	private CompanyService companyService;

	@Autowired
	private RoleService roleService;

	@Autowired
	private TaskService taskService;

	@Autowired
	private ActivityService activityService;
	
	@Autowired
	private GroupService groupService;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	@Override
	public Employee fetch(long employeeId) {
		return employeeRepo.findById(employeeId)
				.orElseThrow(() -> new EntityMissingException(Employee.class, employeeId));
	}

	@Override
	public List<EmployeeDTO> listAll() {
		return employeeRepo.findAll().stream().map(e -> new EmployeeDTO(e)).collect(Collectors.toList());
	}

	@Override
	public EmployeeDTO findById(long employeeId) {
		Optional<Employee> employee = employeeRepo.findById(employeeId);

		if (!employee.isPresent())
			throw new EntityMissingException(Employee.class, employeeId);

		return new EmployeeDTO(employee.get());
	}

	@Override
	public EmployeeDTO findByUsername(String username) {
		Optional<Employee> employee = employeeRepo.findByUsername(username);

		if (!employee.isPresent())
			throw new EntityMissingException(Employee.class, username);

		return new EmployeeDTO(employee.get());
	}

	@Override
	public EmployeeDTO createEmployee(EmployeeDTO dto) {
		validate(dto);
		Assert.isNull(dto.getId(), "Employee ID must be null, not: " + dto.getId());
		if (employeeRepo.countByUsername(dto.getUsername()) > 0)
			throw new RequestDeniedException("Employee with username " + dto.getUsername() + " already exists");

		dto.setPassword(passwordEncoder.encode(dto.getPassword()));

		return new EmployeeDTO(employeeRepo.save(employeeFromDTO(dto)));
	}

	@Override
	public EmployeeDTO updateEmployee(EmployeeDTO dto) {
		validate(dto);
		if (!employeeRepo.existsById(dto.getId()))
			throw new EntityMissingException(Employee.class, dto.getId());
		if (employeeRepo.existsByUsernameAndIdNot(dto.getUsername(), dto.getId()))
			throw new RequestDeniedException("Employee with username " + dto.getUsername() + " already exists");
		return new EmployeeDTO(employeeRepo.save(employeeFromDTO(dto)));
	}

	@Override
	public EmployeeDTO deleteEmployee(long employeeId) {
		EmployeeDTO dto = findById(employeeId);

		companyService.listAll().stream().filter(e -> e.getManagerId().equals(employeeId)).forEach(e -> {
			e.setManagerId(null);
			companyService.updateCompany(e);
		});
		
		groupService.listAll().stream().filter(e -> Objects.nonNull(e.getLeaderID()) && e.getLeaderID().equals(employeeId))
				.forEach(e -> {
					e.setLeaderID(null);
					groupService.updateGroup(e);
				});

		taskService.listAll().stream().filter(e -> Objects.nonNull(e.getAssigneeId()) && e.getAssigneeId().equals(employeeId))
				.forEach(e -> {
					e.setAssigneeId(null);
					taskService.updateTask(e);
				});

		activityService.listAll().stream().filter(e -> e.getEmployeeId().equals(employeeId))
				.forEach(e -> activityService.deleteActivity(e.getId()));

		employeeRepo.delete(employeeFromDTO(dto));
		return dto;
	}

	public Employee employeeFromDTO(EmployeeDTO dto) {
		Employee employee = new Employee();

		employee.setId(dto.getId());
		employee.setUsername(dto.getUsername());
		employee.setPassword(dto.getPassword());
		employee.setFirstName(dto.getFirstName());
		employee.setLastName(dto.getLastName());
		employee.setEmail(dto.getEmail());
		employee.setDateOfBirth(dto.getDateOfBirth());

		if (dto.getCompanyId() != null) {
			employee.setCompany(companyService.fetch(dto.getCompanyId()));
		}

		if (dto.getRoleId() != null) {
			employee.setRole(roleService.fetch(dto.getRoleId()));
		}

		return employee;
	}

	private void validate(EmployeeDTO dto) {
		Assert.notNull(dto, "Employee object must be given");
		Assert.hasText(dto.getUsername(), "Username must be given");
		Assert.hasText(dto.getEmail(), "Email must be given");
		Assert.hasText(dto.getFirstName(), "First name must be given");
		Assert.hasText(dto.getLastName(), "Last name must be given");
		Assert.notNull(dto.getDateOfBirth(), "Date of birth must be given");
	}

}
