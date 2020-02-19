package hr.fer.opp.radnovrijeme.rest;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hr.fer.opp.radnovrijeme.dto.BusinessDTO;
import hr.fer.opp.radnovrijeme.service.BusinessService;

@CrossOrigin
@RestController
@RequestMapping("/businesses")
public class BusinessController {
	
	@Autowired
	private BusinessService businessService;
	
	@GetMapping("")
	public List<BusinessDTO> listBusinesses() {
		return businessService.listAll();
	}
	
	@GetMapping("/{id}")
	public BusinessDTO getBusiness(@PathVariable("id") long id) {
		return businessService.findById(id);
	}
	
	@PostMapping("")
	public ResponseEntity<BusinessDTO> createBusiness(@RequestBody BusinessDTO dto) {
		BusinessDTO saved = businessService.createBusiness(dto);
		return ResponseEntity.created(URI.create("/businesses/" + saved.getId())).body(saved);
	}
	
	@PutMapping("/{id}")
	public BusinessDTO updateBusiness(@PathVariable("id") Long id, @RequestBody BusinessDTO dto) {
		if(!dto.getId().equals(id))
			throw new IllegalArgumentException("Business ID must be preserved");
		return businessService.updateBusiness(dto);
	}
	
	@DeleteMapping("/{id}")
	public BusinessDTO deleteBusiness(@PathVariable("id") long businessId) {
		return businessService.deleteBusiness(businessId);
	}
}
