package hr.fer.opp.radnovrijeme.rest;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hr.fer.opp.radnovrijeme.dto.CompanyDTO;
import hr.fer.opp.radnovrijeme.dto.EmployeeDTO;
import hr.fer.opp.radnovrijeme.service.CompanyService;

@CrossOrigin
@RestController
@RequestMapping("/companies")
public class CompanyController {

	@Autowired
	private CompanyService companyService;

	@GetMapping("")
	public List<CompanyDTO> listCompanies() {
		return companyService.listAll();
	}

	@GetMapping("/{id}")
	public CompanyDTO getCompany(@PathVariable("id") long id) {
		return companyService.findById(id);
	}

	@GetMapping("/{id}/employees")
	public List<EmployeeDTO> getCompanyEmployees(@PathVariable("id") long id) {
		return companyService.listEmployees(id);
	}

	@PostMapping("")
	public ResponseEntity<CompanyDTO> createCompany(@RequestBody CompanyDTO dto) {
		CompanyDTO saved = companyService.createCompany(dto);
		return ResponseEntity.created(URI.create("/companies/" + saved.getId())).body(saved);
	}

	@PutMapping("/{id}")
	public CompanyDTO updateCompany(@PathVariable("id") Long id, @RequestBody CompanyDTO dto) {
		if (!dto.getId().equals(id))
			throw new IllegalArgumentException("Company ID must be preserved");
		return companyService.updateCompany(dto);
	}

	@DeleteMapping("/{id}")
	public CompanyDTO deleteCompany(@PathVariable("id") long companyId) {
		return companyService.deleteCompany(companyId);
	}

}
