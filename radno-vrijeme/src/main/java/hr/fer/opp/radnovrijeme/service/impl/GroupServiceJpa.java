package hr.fer.opp.radnovrijeme.service.impl;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import hr.fer.opp.radnovrijeme.dao.GroupRepository;
import hr.fer.opp.radnovrijeme.domain.Company;
import hr.fer.opp.radnovrijeme.domain.Employee;
import hr.fer.opp.radnovrijeme.domain.Group;
import hr.fer.opp.radnovrijeme.dto.EmployeeDTO;
import hr.fer.opp.radnovrijeme.dto.GroupDTO;
import hr.fer.opp.radnovrijeme.exceptions.EntityMissingException;
import hr.fer.opp.radnovrijeme.exceptions.RequestDeniedException;
import hr.fer.opp.radnovrijeme.service.BusinessService;
import hr.fer.opp.radnovrijeme.service.EmployeeService;
import hr.fer.opp.radnovrijeme.service.GroupService;

@Service
public class GroupServiceJpa implements GroupService {

	@Autowired
	private GroupRepository groupRepo;

	@Autowired
	private EmployeeService employeeService;

	@Autowired
	private BusinessService businessService;

	@Override
	public Group fetch(long groupID) {
		return groupRepo.findById(groupID).orElseThrow(() -> new EntityMissingException(Company.class, groupID));
	}

	@Override
	public List<GroupDTO> listAll() {
		return groupRepo.findAll().stream().map(e -> new GroupDTO(e)).collect(Collectors.toList());
	}

	@Override
	public GroupDTO findById(long groupID) {
		Optional<Group> group = groupRepo.findById(groupID);

		if (!group.isPresent())
			throw new EntityMissingException(Group.class, groupID);

		return new GroupDTO(group.get());
	}

	@Override
	public GroupDTO createGroup(GroupDTO dto) {
		validate(dto);
		Assert.isNull(dto.getID(), "Group ID must be null, not: " + dto.getID());

		if (groupRepo.countByName(dto.getName()) > 0)
			throw new RequestDeniedException("Group with name " + dto.getName() + "already exist!");

		return new GroupDTO(groupRepo.save(groupFromDTO(dto)));
	}

	@Override
	public GroupDTO updateGroup(GroupDTO dto) {
		validate(dto);

		if (!groupRepo.existsById(dto.getID()))
			throw new EntityMissingException(Group.class, dto.getID());

		if (groupRepo.existsByNameAndIdNot(dto.getName(), dto.getID()))
			throw new RequestDeniedException("Group with name " + dto.getName() + " already exists!");

		return new GroupDTO(groupRepo.save(groupFromDTO(dto)));
	}

	@Override
	public GroupDTO deleteGroup(long groupID) {
		GroupDTO dto = findById(groupID);

		businessService.listAll().stream()
				.filter(e -> Objects.nonNull(e.getGroupId()) && e.getGroupId().equals(groupID)).forEach(e -> {
					e.setGroupId(null);
					businessService.updateBusiness(e);
				});

		groupRepo.delete(groupFromDTO(dto));
		return dto;
	}

	@Override
	public List<EmployeeDTO> listMembers(long groupID) {
		if (!groupRepo.existsById(groupID))
			throw new EntityMissingException(Group.class, groupID);

		return fetch(groupID).getMembers().stream().map(e -> new EmployeeDTO(e)).collect(Collectors.toList());
	}

	@Override
	public boolean addMember(long groupId, long employeeId) {
		Group group = fetch(groupId);
		Employee employee = employeeService.fetch(employeeId);

		if (group.getMembers().add(employee)) {
			groupRepo.save(group);
			return true;
		} else {
			return false;
		}
	}

	@Override
	public boolean removeMember(long groupId, long employeeId) {
		Group group = fetch(groupId);
		Employee employee = employeeService.fetch(employeeId);

		if (group.getMembers().remove(employee)) {
			groupRepo.save(group);
			return true;
		} else {
			return false;
		}
	}

	@Override
	public EmployeeDTO getLead(long groupID) {
		if (!groupRepo.existsById(groupID))
			throw new EntityMissingException(Group.class, groupID);

		return new EmployeeDTO(fetch(groupID).getLead());
	}

	private void validate(GroupDTO dto) {
		Assert.notNull(dto, "Group object must be given");
		Assert.hasText(dto.getName(), "Group name must be given");
	}

	public Group groupFromDTO(GroupDTO dto) {
		Group group = new Group();
		group.setId(dto.getID());
		group.setName(dto.getName());

		if (dto.getLeaderID() != null) {
			group.setLead(employeeService.fetch(dto.getLeaderID()));
		}

		if (dto.getMemberIDs() != null) {
			group.setMembers(
					dto.getMemberIDs().stream().map(e -> employeeService.fetch(e)).collect(Collectors.toSet()));
		}

		return group;
	}

}
