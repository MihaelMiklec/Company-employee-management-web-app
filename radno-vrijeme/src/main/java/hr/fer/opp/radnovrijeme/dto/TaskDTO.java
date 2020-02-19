package hr.fer.opp.radnovrijeme.dto;

import hr.fer.opp.radnovrijeme.domain.Task;

public class TaskDTO {
	private Long id;
	private String name;
	private String description;
	private Long businessId;
	private Long assigneeId;
	private Double pricePerHour;
	private Double hoursPlanned;
	private Double plannedHours;
	private Double loggedHours;

	public TaskDTO() {

	}

	public TaskDTO(Task task) {
		this.setId(task.getId());
		this.setPricePerHour(task.getPricePerHour());
		this.setHoursPlanned(task.getHoursPlanned());
		this.setDescription(task.getDescription());
		this.setName(task.getName());

		if (task.getBusiness() != null)
			this.setBusinessId(task.getBusiness().getId());

		if (task.getAssignee() != null)
			this.setAssigneeId(task.getAssignee().getId());
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

	public Double getHoursPlanned() {
		return hoursPlanned;
	}

	public void setHoursPlanned(Double hoursPlanned) {
		this.hoursPlanned = hoursPlanned;
	}

	public Long getBusinessId() {
		return businessId;
	}

	public void setBusinessId(Long businessId) {
		this.businessId = businessId;
	}

	public Long getAssigneeId() {
		return assigneeId;
	}

	public void setAssigneeId(Long assigneeId) {
		this.assigneeId = assigneeId;
	}

	public Double getPlannedHours() {
		return plannedHours;
	}

	public void setPlannedHours(Double plannedHours) {
		this.plannedHours = plannedHours;
	}

	public Double getLoggedHours() {
		return loggedHours;
	}

	public void setLoggedHours(Double loggedHours) {
		this.loggedHours = loggedHours;
	}

}
