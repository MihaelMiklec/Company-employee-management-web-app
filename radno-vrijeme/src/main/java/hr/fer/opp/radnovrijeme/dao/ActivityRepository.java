package hr.fer.opp.radnovrijeme.dao;

import hr.fer.opp.radnovrijeme.domain.Activity;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ActivityRepository extends JpaRepository<Activity, Long>{

	Optional<Activity> findById(Long id);
	
	int countById(Long id);

	boolean existsById(Long id);
	
}
