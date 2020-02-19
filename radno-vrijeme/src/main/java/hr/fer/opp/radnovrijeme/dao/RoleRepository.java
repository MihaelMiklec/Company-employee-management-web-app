package hr.fer.opp.radnovrijeme.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import hr.fer.opp.radnovrijeme.domain.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

	Optional<Role> findByName(String name);
	
	int countByName(String name);

	boolean existsByNameAndIdNot(String name, Long id);
	
}