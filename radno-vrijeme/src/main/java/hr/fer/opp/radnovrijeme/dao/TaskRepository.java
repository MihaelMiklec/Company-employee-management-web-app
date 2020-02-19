package hr.fer.opp.radnovrijeme.dao;


import hr.fer.opp.radnovrijeme.domain.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long>{

	Optional<Task> findById(Long id);
	
	int countById(Long id);
	
	int countByName(String name);

	boolean existsById(Long id);
	
	boolean existsByNameAndIdNot(String name, Long id);
	
}
