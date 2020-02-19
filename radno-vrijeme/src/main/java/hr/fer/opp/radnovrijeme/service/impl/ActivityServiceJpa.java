package hr.fer.opp.radnovrijeme.service.impl;

import hr.fer.opp.radnovrijeme.dao.ActivityRepository;
import hr.fer.opp.radnovrijeme.domain.Activity;
import hr.fer.opp.radnovrijeme.dto.ActivityDTO;
import hr.fer.opp.radnovrijeme.exceptions.EntityMissingException;
import hr.fer.opp.radnovrijeme.exceptions.RequestDeniedException;
import hr.fer.opp.radnovrijeme.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ActivityServiceJpa implements ActivityService {

	@Autowired
	private ActivityRepository activityRepo;

	@Autowired
	private TaskService taskService;

	@Autowired
	private EmployeeService employeeService;

	@Override
	public Activity fetch(long activityId) {
		return activityRepo.findById(activityId)
				.orElseThrow(() -> new EntityMissingException(Activity.class, activityId));
	}

	@Override
	public List<ActivityDTO> listAll() {
		return activityRepo.findAll().stream().map(e -> new ActivityDTO(e)).collect(Collectors.toList());
	}

	@Override
	public ActivityDTO findById(long activityId) {
		Optional<Activity> activity = activityRepo.findById(activityId);

		if (!activity.isPresent())
			throw new EntityMissingException(Activity.class, activityId);

		return new ActivityDTO(activity.get());
	}

	@Override
	public ActivityDTO createActivity(ActivityDTO dto) {
		validate(dto);
		Assert.isNull(dto.getId(), "Activity ID must be null, not: " + dto.getId());
		if (activityRepo.countById(dto.getId()) > 0)
			throw new RequestDeniedException("Activity with id " + dto.getId() + " already exists");

		return new ActivityDTO(activityRepo.save(activityFromDTO(dto)));
	}

	@Override
	public ActivityDTO updateActivity(ActivityDTO dto) {
		validate(dto);
		if (!activityRepo.existsById(dto.getId()))
			throw new EntityMissingException(Activity.class, dto.getId());

		return new ActivityDTO(activityRepo.save(activityFromDTO(dto)));
	}

	@Override
	public ActivityDTO deleteActivity(long activityId) {
		ActivityDTO dto = findById(activityId);
		activityRepo.delete(activityFromDTO(dto));
		return dto;
	}

	public Activity activityFromDTO(ActivityDTO dto) {
		Activity activity = new Activity();

		activity.setId(dto.getId());
		activity.setDescription(dto.getDescription());
		activity.setStartTime(dto.getStartTime());
		activity.setEndTime(dto.getEndTime());

		if (dto.getEmployeeId() != null) {
			activity.setEmployee(employeeService.fetch(dto.getEmployeeId()));
		}

		if (dto.getTaskId() != null) {
			activity.setTask(taskService.fetch(dto.getTaskId()));
		}

		return activity;
	}

	private void validate(ActivityDTO dto) {
		Assert.notNull(dto, "Activity object must be given");
		Assert.hasText(dto.getDescription(), "Description must be given");
		Assert.notNull(dto.getStartTime(), "Start time name must be given");
		Assert.notNull(dto.getEndTime(), "End time must be given");
	}

}