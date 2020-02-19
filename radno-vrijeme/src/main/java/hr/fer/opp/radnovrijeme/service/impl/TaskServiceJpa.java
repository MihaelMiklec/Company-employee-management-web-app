package hr.fer.opp.radnovrijeme.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.xml.datatype.Duration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import hr.fer.opp.radnovrijeme.dao.TaskRepository;
import hr.fer.opp.radnovrijeme.domain.Group;
import hr.fer.opp.radnovrijeme.domain.Task;
import hr.fer.opp.radnovrijeme.dto.ActivityDTO;
import hr.fer.opp.radnovrijeme.dto.EmployeeDTO;
import hr.fer.opp.radnovrijeme.dto.TaskDTO;
import hr.fer.opp.radnovrijeme.dto.TaskStatDTO;
import hr.fer.opp.radnovrijeme.exceptions.EntityMissingException;
import hr.fer.opp.radnovrijeme.exceptions.RequestDeniedException;
import hr.fer.opp.radnovrijeme.service.ActivityService;
import hr.fer.opp.radnovrijeme.service.BusinessService;
import hr.fer.opp.radnovrijeme.service.EmployeeService;
import hr.fer.opp.radnovrijeme.service.TaskService;

@Service
public class TaskServiceJpa implements TaskService {

	@Autowired
	private TaskRepository taskRepo;

	@Autowired
	private EmployeeService employeeService;

	@Autowired
	private BusinessService businessService;

	@Autowired
	private ActivityService activityService;

	@Override
	public Task fetch(long taskId) {
		return taskRepo.findById(taskId).orElseThrow(() -> new EntityMissingException(Task.class, taskId));
	}

	@Override
	public List<TaskDTO> listAll() {
		return taskRepo.findAll().stream().map(task -> {
			TaskDTO dto = new TaskDTO(task);

			dto.setPlannedHours(task.getHoursPlanned());
			dto.setLoggedHours(
					activityService.listAll().stream().filter(e -> e.getTaskId().equals(task.getId())).mapToDouble(e -> {
						long duration = e.getEndTime().getTime() - e.getStartTime().getTime();
						return duration / (60 * 60 * 1000);
					}).sum());

			return dto;
		}).collect(Collectors.toList());
	}

	@Override
	public TaskDTO findById(long taskId) {
		Optional<Task> task = taskRepo.findById(taskId);

		if (!task.isPresent())
			throw new EntityMissingException(Task.class, taskId);

		Task taskValue = task.get();
		TaskDTO dto = new TaskDTO(taskValue);

		dto.setPlannedHours(taskValue.getHoursPlanned());
		dto.setLoggedHours(
				activityService.listAll().stream().filter(e -> e.getTaskId().equals(taskId)).mapToDouble(e -> {
					long duration = e.getEndTime().getTime() - e.getStartTime().getTime();
					return duration / (60 * 60 * 1000);
				}).sum());

		return dto;
	}

	@Override
	public TaskDTO createTask(TaskDTO dto) {
		validate(dto);
		Assert.isNull(dto.getId(), "Task ID must be null, not: " + dto.getId());
		if (taskRepo.countByName(dto.getName()) > 0)
			throw new RequestDeniedException("Task with id " + dto.getId() + " already exists");

		return new TaskDTO(taskRepo.save(taskFromDTO(dto)));
	}

	@Override
	public TaskDTO updateTask(TaskDTO dto) {
		validate(dto);
		if (!taskRepo.existsById(dto.getId()))
			throw new EntityMissingException(Task.class, dto.getId());
		if (taskRepo.existsByNameAndIdNot(dto.getName(), dto.getId()))
			throw new RequestDeniedException("Task with name " + dto.getName() + " already exists");
		return new TaskDTO(taskRepo.save(taskFromDTO(dto)));
	}

	@Override
	public TaskDTO deleteTask(long taskId) {
		TaskDTO dto = findById(taskId);

		activityService.listAll().stream().filter(e -> e.getTaskId().equals(taskId))
				.forEach(e -> activityService.deleteActivity(e.getId()));

		taskRepo.delete(taskFromDTO(dto));
		return dto;
	}

	@Override
	public TaskStatDTO getStats(long taskId) {
		TaskStatDTO dto = new TaskStatDTO();
		Task task = fetch(taskId);

		dto.setPlannedHours(task.getHoursPlanned());
		dto.setLoggedHours(
				activityService.listAll().stream().filter(e -> e.getTaskId().equals(taskId)).mapToDouble(e -> {
					long duration = e.getEndTime().getTime() - e.getStartTime().getTime();
					return duration / (60 * 60 * 1000);
				}).sum());

		return dto;
	}

	public Task taskFromDTO(TaskDTO dto) {
		Task task = new Task();

		task.setId(dto.getId());
		task.setName(dto.getName());
		task.setDescription(dto.getDescription());
		task.setPricePerHour(dto.getPricePerHour());
		task.setHoursPlanned(dto.getHoursPlanned());

		if (dto.getAssigneeId() != null) {
			task.setAssignee(employeeService.fetch(dto.getAssigneeId()));
		}

		if (dto.getBusinessId() != null) {
			task.setBusiness(businessService.fetch(dto.getBusinessId()));
		}

		return task;
	}

	private void validate(TaskDTO dto) {
		Assert.notNull(dto, "Task object must be given");
		Assert.hasText(dto.getName(), "Name must be given");
		Assert.hasText(dto.getDescription(), "Description must be given");
		Assert.notNull(dto.getPricePerHour(), "Start time name must be given");
		Assert.notNull(dto.getHoursPlanned(), "End time must be given");
	}

	@Override
	public List<ActivityDTO> listActivities(long taskId) {
		if (!taskRepo.existsById(taskId))
			throw new EntityMissingException(Group.class, taskId);

		return activityService.listAll().stream().filter(e -> e.getTaskId().equals(taskId))
				.collect(Collectors.toList());
	}

}