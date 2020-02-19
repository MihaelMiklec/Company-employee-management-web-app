package hr.fer.opp.radnovrijeme.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import hr.fer.opp.radnovrijeme.domain.Group;

public interface GroupRepository extends JpaRepository<Group, Long> {
	
	Optional<Group> findByName(String name);
	
	int countByName(String name);	
	
	boolean existsByNameAndIdNot(String name, Long id);

}
