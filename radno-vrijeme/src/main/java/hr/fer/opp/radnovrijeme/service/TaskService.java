package hr.fer.opp.radnovrijeme.service;


import java.util.List;

import hr.fer.opp.radnovrijeme.domain.Task;
import hr.fer.opp.radnovrijeme.dto.ActivityDTO;
import hr.fer.opp.radnovrijeme.dto.TaskDTO;
import hr.fer.opp.radnovrijeme.dto.TaskStatDTO;

public interface TaskService {

	Task fetch(long taskId);

	List<TaskDTO> listAll();

	TaskDTO findById(long TaskId);

	TaskDTO createTask(TaskDTO dto);

	TaskDTO updateTask(TaskDTO dto);

	TaskDTO deleteTask(long TaskId);
	
	List<ActivityDTO> listActivities(long taskId);
	
	TaskStatDTO getStats(long taskId);

}
