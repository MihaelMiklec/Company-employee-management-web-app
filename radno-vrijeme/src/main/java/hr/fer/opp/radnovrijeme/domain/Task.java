package hr.fer.opp.radnovrijeme.domain;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class Task {

	@Id
	@GeneratedValue
	private Long id;

	private Double pricePerHour;

	private Double hoursPlanned;

	private String name;
	
	private String description;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "employee_id", nullable = true)
	private Employee assignee;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "business_id", nullable = true)
	private Business business;

	public Long getId() {
		return id;
	}
	
	public void setId(Long id) {
		this.id = id;
	}

	public Double getPricePerHour() {
		return pricePerHour;
	}

	public void setPricePerHour(Double pricePerHour) {
		this.pricePerHour = pricePerHour;
	}

	public Double getHoursPlanned() {
		return hoursPlanned;
	}

	public void setHoursPlanned(Double hoursPlanned) {
		this.hoursPlanned = hoursPlanned;
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

	public Employee getAssignee() {
		return assignee;
	}

	public void setAssignee(Employee assignee) {
		this.assignee = assignee;
	}

	public Business getBusiness() {
		return business;
	}

	public void setBusiness(Business business) {
		this.business = business;
	}

}
