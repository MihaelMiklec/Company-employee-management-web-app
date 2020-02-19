package hr.fer.opp.radnovrijeme.domain;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;

@Entity
public class Company {

	@Id
	@GeneratedValue
	private Long id;

	@NotNull
	private String name;

	@OneToOne(optional = true, fetch = FetchType.EAGER)
	private Employee manager;

	public void setId(Long id) {
		this.id = id;
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Employee getManager() {
		return manager;
	}

	public void setManager(Employee manager) {
		this.manager = manager;
	}

	@Override
	public String toString() {
		return "Company #" + id + " " + name + " - manager=" + manager.getFirstName() + " " + manager.getLastName();
	}
}
