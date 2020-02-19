package hr.fer.opp.radnovrijeme.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import hr.fer.opp.radnovrijeme.domain.Employee;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

	Optional<Employee> findByEmail(String email);
	
	int countByUsername (String email);
	
	Optional<Employee> findByUsername(String username);
	
	boolean existsByUsernameAndIdNot (String username, Long id);

}
