package hr.fer.opp.radnovrijeme.service;

import java.util.List;

import hr.fer.opp.radnovrijeme.domain.Employee;
import hr.fer.opp.radnovrijeme.dto.EmployeeDTO;

public interface EmployeeService {

	Employee fetch(long employeeId);

	List<EmployeeDTO> listAll();

	EmployeeDTO findById(long employeeId);
	
	EmployeeDTO findByUsername(String username);

	EmployeeDTO createEmployee(EmployeeDTO dto);

	EmployeeDTO updateEmployee(EmployeeDTO dto);

	EmployeeDTO deleteEmployee(long employeeId);

}
