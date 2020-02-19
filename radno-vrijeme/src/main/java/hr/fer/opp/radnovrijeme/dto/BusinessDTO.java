package hr.fer.opp.radnovrijeme.dto;

import hr.fer.opp.radnovrijeme.domain.Business;

public class BusinessDTO {

	private Long id;
	private String name;
	private String description;
	private Double pricePerHour;
	private Long groupId;
	
	public BusinessDTO() {
		
	}
	
	public BusinessDTO(Business business) {
		this.setId(business.getId());
		this.setName(business.getName());
		this.setDescription(business.getDescription());
		this.setPricePerHour(business.getPricePerHour());
		
		if (business.getGroup() != null) {
			this.setGroupId(business.getGroup().getId());
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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Double getPricePerHour() {
		return pricePerHour;
	}
	
	public void setPricePerHour(Double pricePerHour) {
		this.pricePerHour = pricePerHour;
	}
	
	public Long getGroupId() {
		return groupId;
	}

	public void setGroupId(Long groupId) {
		this.groupId = groupId;
	}
	
	
	
}
