package hr.fer.opp.radnovrijeme.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import hr.fer.opp.radnovrijeme.domain.Business;

public interface BusinessRepository extends JpaRepository<Business, Long>{

	Optional<Business> findByName(String name);
	
	int countByName(String name);

	boolean existsByNameAndIdNot(String name, Long id);
	
}
