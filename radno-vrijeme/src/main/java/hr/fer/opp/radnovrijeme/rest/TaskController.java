package hr.fer.opp.radnovrijeme.rest;

import hr.fer.opp.radnovrijeme.dto.ActivityDTO;
import hr.fer.opp.radnovrijeme.dto.EmployeeDTO;
import hr.fer.opp.radnovrijeme.dto.TaskDTO;
import hr.fer.opp.radnovrijeme.dto.TaskStatDTO;
import hr.fer.opp.radnovrijeme.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/tasks")
public class TaskController {

	@Autowired
	private TaskService taskService;

	@GetMapping("")
	public List<TaskDTO> listTasks() {
		return taskService.listAll();
	}

	@GetMapping("/{id}")
	public TaskDTO getTask(@PathVariable("id") long id) {
		return taskService.findById(id);
	}
	
	@GetMapping("/{id}/activities")
	public List<ActivityDTO> getActivities(@PathVariable("id") long id) {
		return taskService.listActivities(id);
	}
	
	@GetMapping("/{id}/stats")
	public TaskStatDTO getStats(@PathVariable("id") long id) {
		return taskService.getStats(id);
	}

	@PostMapping("")
	public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO dto) {
		TaskDTO saved = taskService.createTask(dto);
		return ResponseEntity.created(URI.create("/tasks/" + saved.getId())).body(saved);
	}

	@PutMapping("/{id}")
	public TaskDTO updateTask(@PathVariable("id") Long id, @RequestBody TaskDTO dto) {
		if (!dto.getId().equals(id))
			throw new IllegalArgumentException("Task ID must be preserved");
		return taskService.updateTask(dto);
	}

	@DeleteMapping("/{id}")
	public TaskDTO deleteTask(@PathVariable("id") long id) {
		return taskService.deleteTask(id);
	}

}
