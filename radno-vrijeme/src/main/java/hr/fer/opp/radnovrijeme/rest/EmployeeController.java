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

import hr.fer.opp.radnovrijeme.dto.EmployeeDTO;
import hr.fer.opp.radnovrijeme.service.EmployeeService;

@CrossOrigin
@RestController
@RequestMapping("/employees")
public class EmployeeController {

	@Autowired
	private EmployeeService employeeService;

	@GetMapping("")
	public List<EmployeeDTO> listEmployees() {
		return employeeService.listAll();
	}

	@GetMapping("/{id}")
	public EmployeeDTO getEmployee(@PathVariable("id") long id) {
		return employeeService.findById(id);
	}

	@PostMapping("")
	public ResponseEntity<EmployeeDTO> createEmployee(@RequestBody EmployeeDTO dto) {
		EmployeeDTO saved = employeeService.createEmployee(dto);
		return ResponseEntity.created(URI.create("/employees/" + saved.getId())).body(saved);
	}

	@PutMapping("/{id}")
	public EmployeeDTO updateEmployee(@PathVariable("id") Long id, @RequestBody EmployeeDTO dto) {
		if (!dto.getId().equals(id))
			throw new IllegalArgumentException("Employee ID must be preserved");
		return employeeService.updateEmployee(dto);
	}

	@DeleteMapping("/{id}")
	public EmployeeDTO deleteEmployee(@PathVariable("id") long id) {
		return employeeService.deleteEmployee(id);
	}
}
