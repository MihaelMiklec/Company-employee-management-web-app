package hr.fer.opp.radnovrijeme.dto;

import java.util.Set;
import java.util.stream.Collectors;

import hr.fer.opp.radnovrijeme.domain.Group;

public class GroupDTO {
	
	private Long ID;
	private String name;
	private Long leaderID;
	private Set<Long> memberIDs;
	
	public GroupDTO() {
		
	}
	
	public GroupDTO(Group group) {
		this.setID(group.getId());
		this.setName(group.getName());
		
		if (group.getLead() != null)
			this.setLeaderID(group.getLead().getId());
		
		if (group.getMembers() != null)
			this.setMemberIDs(group.getMembers().stream().map(e -> e.getId()).collect(Collectors.toSet()));
	}
	
	public Long getID() {
		return ID;
	}

	public void setID(Long ID) {
		this.ID = ID;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public Long getLeaderID() {
		return leaderID;
	}
	
	public void setLeaderID(Long leaderID) {
		this.leaderID = leaderID;
	}
	
	public Set<Long> getMemberIDs() {
		return memberIDs;
	}
	
	public void setMemberIDs(Set<Long> memberIDs) {
		this.memberIDs = memberIDs;
	}

}
