package hr.fer.opp.radnovrijeme.service;

import java.util.List;

import org.springframework.stereotype.Service;

import hr.fer.opp.radnovrijeme.domain.Company;
import hr.fer.opp.radnovrijeme.dto.CompanyDTO;
import hr.fer.opp.radnovrijeme.dto.EmployeeDTO;

@Service
public interface CompanyService {

	Company fetch(long companyId);

	List<CompanyDTO> listAll();

	CompanyDTO findById(long companyId);

	CompanyDTO createCompany(CompanyDTO dto);

	CompanyDTO updateCompany(CompanyDTO dto);

	CompanyDTO deleteCompany(long companyId);

	List<EmployeeDTO> listEmployees(long companyId);

}
