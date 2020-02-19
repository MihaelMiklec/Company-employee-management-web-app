package hr.fer.opp.radnovrijeme.domain;

import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;

@Entity(name = "work_group")
public class Group {

	@Id
	@GeneratedValue
	private Long id;

	@NotNull
	private String name;

	@OneToOne(fetch = FetchType.EAGER)
	private Employee lead;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "employee_group", joinColumns = @JoinColumn(name = "group_id"), inverseJoinColumns = @JoinColumn(name = "employee_id"))
	private Set<Employee> members;

	public Long getId() {
		return id;
	}
	
	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Employee getLead() {
		return lead;
	}

	public void setLead(Employee lead) {
		this.lead = lead;
	}

	public Set<Employee> getMembers() {
		return members;
	}

	public void setMembers(Set<Employee> members) {
		this.members = members;
	}

}
