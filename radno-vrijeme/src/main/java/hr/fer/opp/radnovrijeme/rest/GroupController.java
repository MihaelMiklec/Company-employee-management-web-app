package hr.fer.opp.radnovrijeme.rest;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hr.fer.opp.radnovrijeme.dto.EmployeeDTO;
import hr.fer.opp.radnovrijeme.dto.GroupDTO;
import hr.fer.opp.radnovrijeme.service.GroupService;

@CrossOrigin
@RestController
@RequestMapping("/groups")
public class GroupController {

	@Autowired
	private GroupService groupService;

	@GetMapping("")
	public List<GroupDTO> listGroups() {
		return groupService.listAll();
	}

	@GetMapping("/{id}")
	public GroupDTO getGroup(@PathVariable("id") long id) {
		return groupService.findById(id);
	}

	@GetMapping("/{id}/lead")
	public EmployeeDTO getGroupLead(@PathVariable("id") long id) {
		return groupService.getLead(id);
	}

	@GetMapping("/{id}/members")
	public List<EmployeeDTO> getGroupMembers(@PathVariable("id") long id) {
		return groupService.listMembers(id);
	}

	@PutMapping("/{id}/members/{eid}")
	public ResponseEntity<Boolean> addGroupMember(@PathVariable("id") Long groupId, @PathVariable("eid") Long employeeId) {
		return ResponseEntity.ok(groupService.addMember(groupId, employeeId));
	}
	
	@DeleteMapping("/{id}/members/{eid}")
	public ResponseEntity<Boolean> removeGroupMember(@PathVariable("id") Long groupId, @PathVariable("eid") Long employeeId) {
		return ResponseEntity.ok(groupService.removeMember(groupId, employeeId));
	}

	@PostMapping("")
	public ResponseEntity<GroupDTO> createGroup(@RequestBody GroupDTO dto) {
		GroupDTO saved = groupService.createGroup(dto);
		return ResponseEntity.created(URI.create("/companies" + saved.getID())).body(saved);
	}

	@PutMapping("/{id}")
	public GroupDTO updateGroup(@PathVariable("id") Long id, @RequestBody GroupDTO dto) {
		if (!dto.getID().equals(id))
			throw new IllegalArgumentException("Group ID must be preserved!");

		return groupService.updateGroup(dto);
	}

	@DeleteMapping("/{id}")
	public GroupDTO deleteGroup(@PathVariable("id") long groupID) {
		return groupService.deleteGroup(groupID);
	}

}
