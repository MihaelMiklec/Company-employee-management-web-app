package hr.fer.opp.radnovrijeme.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import hr.fer.opp.radnovrijeme.dao.CompanyRepository;
import hr.fer.opp.radnovrijeme.domain.Company;
import hr.fer.opp.radnovrijeme.dto.CompanyDTO;
import hr.fer.opp.radnovrijeme.dto.EmployeeDTO;
import hr.fer.opp.radnovrijeme.exceptions.EntityMissingException;
import hr.fer.opp.radnovrijeme.exceptions.RequestDeniedException;
import hr.fer.opp.radnovrijeme.service.CompanyService;
import hr.fer.opp.radnovrijeme.service.EmployeeService;

@Service
public class CompanyServiceJpa implements CompanyService {

	@Autowired
	private CompanyRepository companyRepo;

	@Autowired
	private EmployeeService employeeService;

	@Override
	public Company fetch(long companyId) {
		return companyRepo.findById(companyId).orElseThrow(() -> new EntityMissingException(Company.class, companyId));
	}

	@Override
	public List<CompanyDTO> listAll() {
		return companyRepo.findAll().stream().map(e -> new CompanyDTO(e)).collect(Collectors.toList());
	}

	@Override
	public CompanyDTO findById(long companyId) {
		Optional<Company> company = companyRepo.findById(companyId);

		if (!company.isPresent())
			throw new EntityMissingException(Company.class, companyId);

		return new CompanyDTO(company.get());
	}

	@Override
	public CompanyDTO createCompany(CompanyDTO dto) {
		validate(dto);
		Assert.isNull(dto.getId(), "Company ID must be null, not: " + dto.getId());
		if (companyRepo.countByName(dto.getName()) > 0)
			throw new RequestDeniedException("Company with name " + dto.getName() + " already exists");

		return new CompanyDTO(companyRepo.save(companyFromDTO(dto)));
	}

	@Override
	public CompanyDTO updateCompany(CompanyDTO dto) {
		validate(dto);
		if (!companyRepo.existsById(dto.getId()))
			throw new EntityMissingException(Company.class, dto.getId());
		if (companyRepo.existsByNameAndIdNot(dto.getName(), dto.getId()))
			throw new RequestDeniedException("Company with name " + dto.getName() + " already exists");

		return new CompanyDTO(companyRepo.save(companyFromDTO(dto)));
	}

	@Override
	public CompanyDTO deleteCompany(long companyId) {
		Company company = fetch(companyId);
		
		List<EmployeeDTO> companyEmployees = employeeService.listAll().stream().filter(e -> e.getCompanyId().equals(companyId)).collect(Collectors.toList());
		companyEmployees.stream().forEach(e -> employeeService.deleteEmployee(e.getId()));
		
		companyRepo.delete(company);
		return new CompanyDTO(company);
	}

	@Override
	public List<EmployeeDTO> listEmployees(long companyId) {
		if (!companyRepo.existsById(companyId))
			throw new EntityMissingException(Company.class, companyId);

		return companyRepo.getEmployees(fetch(companyId));
	}

	public Company companyFromDTO(CompanyDTO dto) {
		Company company = new Company();

		company.setId(dto.getId());
		company.setName(dto.getName());

		if (dto.getManagerId() != null) {
			company.setManager(employeeService.fetch(dto.getManagerId()));
		}

		return company;
	}

	private void validate(CompanyDTO dto) {
		Assert.notNull(dto, "Company object must be given");
		Assert.hasText(dto.getName(), "Company name must be given");
	}

}
