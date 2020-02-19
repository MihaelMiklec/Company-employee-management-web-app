package hr.fer.opp.radnovrijeme.service;

import java.util.List;

import org.springframework.stereotype.Service;

import hr.fer.opp.radnovrijeme.domain.Group;
import hr.fer.opp.radnovrijeme.dto.EmployeeDTO;
import hr.fer.opp.radnovrijeme.dto.GroupDTO;

@Service
public interface GroupService {
	
	Group fetch(long groupID);
	
	List<GroupDTO> listAll();

	GroupDTO findById(long groupID);

	GroupDTO createGroup(GroupDTO dto);

	GroupDTO updateGroup(GroupDTO dto);

	GroupDTO deleteGroup(long groupID);

	List<EmployeeDTO> listMembers(long groupID);
	
	EmployeeDTO getLead(long groupID);
	
	boolean addMember (long groupId, long employeeId);
	
	boolean removeMember (long groupId, long employeeId);

}
