package hr.fer.opp.radnovrijeme.rest;

import hr.fer.opp.radnovrijeme.dto.ActivityDTO;
import hr.fer.opp.radnovrijeme.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/activities")

public class ActivityController {
	@Autowired
	private ActivityService activityService;

	@GetMapping("")
	public List<ActivityDTO> listActivities() {
		return activityService.listAll();
	}

	@GetMapping("/{id}")
	public ActivityDTO getActivity(@PathVariable("id") long id) {
		return activityService.findById(id);
	}

	@PostMapping("")
	public ResponseEntity<ActivityDTO> createActivity(@RequestBody ActivityDTO dto) {
		ActivityDTO saved = activityService.createActivity(dto);
		return ResponseEntity.created(URI.create("/activities/" + saved.getId())).body(saved);
	}

	@PutMapping("/{id}")
	public ActivityDTO updateActivity(@PathVariable("id") Long id, @RequestBody ActivityDTO dto) {
		if (!dto.getId().equals(id))
			throw new IllegalArgumentException("Activity ID must be preserved");
		return activityService.updateActivity(dto);
	}

	@DeleteMapping("/{id}")
	public ActivityDTO deleteActivity(@PathVariable("id") long id) {
		return activityService.deleteActivity(id);
	}
}
