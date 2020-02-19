package hr.fer.opp.radnovrijeme.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import hr.fer.opp.radnovrijeme.domain.Company;
import hr.fer.opp.radnovrijeme.dto.EmployeeDTO;

public interface CompanyRepository extends JpaRepository<Company, Long> {

	Optional<Company> findByName(String name);

	int countByName(String name);
	
	boolean existsByNameAndIdNot(String name, Long id);
	
	@Query("SELECT new hr.fer.opp.radnovrijeme.dto.EmployeeDTO(e) FROM Employee e WHERE e.company = :company")
	List<EmployeeDTO> getEmployees (@Param("company") Company company);

}
