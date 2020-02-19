package hr.fer.opp.radnovrijeme.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

@Entity
public class Role {

	public static final String ROLE_ADMIN = "ROLE_ADMIN";
	public static final String ROLE_OWNER = "ROLE_OWNER";
	public static final String ROLE_LEAD = "ROLE_LEAD";
	public static final String ROLE_EMPLOYEE = "ROLE_EMPLOYEE";
	
	@Id
	@GeneratedValue
	private Long id;

	@NotNull
	private String name;

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "Role #" + id + " " + name;
	}
}
