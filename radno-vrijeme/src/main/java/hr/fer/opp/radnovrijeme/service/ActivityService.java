package hr.fer.opp.radnovrijeme.service;

import hr.fer.opp.radnovrijeme.domain.Activity;
import hr.fer.opp.radnovrijeme.dto.ActivityDTO;

import java.util.List;

public interface ActivityService {

	Activity fetch(long activityId);

	List<ActivityDTO> listAll();

	ActivityDTO findById(long activityId);

	ActivityDTO createActivity(ActivityDTO dto);

	ActivityDTO updateActivity(ActivityDTO dto);

	ActivityDTO deleteActivity(long activityId);


}
