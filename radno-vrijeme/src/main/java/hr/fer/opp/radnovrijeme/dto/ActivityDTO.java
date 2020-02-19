package hr.fer.opp.radnovrijeme.dto;

import hr.fer.opp.radnovrijeme.domain.Activity;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public class ActivityDTO {

	private Long id;
	private String description;
	
	@JsonFormat(pattern="dd-MM-yyyy HH:mm")
	private Date startTime;
	
	@JsonFormat(pattern="dd-MM-yyyy HH:mm")
	private Date endTime;
	private Long employeeId;
	private Long taskId;

	public ActivityDTO() {

	}

	public ActivityDTO(Activity activity) {
		this.setId(activity.getId());
		this.setDescription(activity.getDescription());
		this.setStartTime(activity.getStartTime());
		this.setEndTime(activity.getEndTime());

		if (activity.getEmployee() != null)
			this.setEmployeeId(activity.getEmployee().getId());
		if (activity.getTask() != null)
			this.setTaskId(activity.getTask().getId());
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public Long getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(Long employeeId) {
		this.employeeId = employeeId;
	}

	public Long getTaskId() {
		return taskId;
	}

	public void setTaskId(Long taskId) {
		this.taskId = taskId;
	}
}
