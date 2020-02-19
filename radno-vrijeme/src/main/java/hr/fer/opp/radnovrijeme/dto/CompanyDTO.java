package hr.fer.opp.radnovrijeme.dto;

import hr.fer.opp.radnovrijeme.domain.Company;

public class CompanyDTO {

	private Long id;
	private String name;
	private Long managerId;
	
	public CompanyDTO() {
		
	}
	
	public CompanyDTO(Company company) {
		this.setId(company.getId());
		this.setName(company.getName());

		if (company.getManager() != null) {
			this.setManagerId(company.getManager().getId());
		}
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getManagerId() {
		return managerId;
	}

	public void setManagerId(Long managerId) {
		this.managerId = managerId;
	}

}
