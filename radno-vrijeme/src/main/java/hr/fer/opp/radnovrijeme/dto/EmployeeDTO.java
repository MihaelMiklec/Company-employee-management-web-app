package hr.fer.opp.radnovrijeme.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import hr.fer.opp.radnovrijeme.domain.Employee;

public class EmployeeDTO {

	private Long id;
	private String username;
	private String password;
	private String firstName;
	private String lastName;
	private String email;
	
	@JsonFormat(pattern="dd-MM-yyyy")
	private Date dateOfBirth;
	private Long companyId;
	private Long roleId;
	
	public EmployeeDTO() {
		
	}
	
	public EmployeeDTO(Employee employee) {
		this.setId(employee.getId());
		this.setUsername(employee.getUsername());
		this.setPassword(employee.getPassword());
		this.setFirstName(employee.getFirstName());
		this.setLastName(employee.getLastName());
		this.setEmail(employee.getEmail());
		this.setDateOfBirth(employee.getDateOfBirth());

		if (employee.getCompany() != null) {
			this.setCompanyId(employee.getCompany().getId());
		}

		if (employee.getRole() != null) {
			this.setRoleId(employee.getRole().getId());
		}
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getPassword() {
		return password;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Date getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(Date dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public Long getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	public Long getRoleId() {
		return roleId;
	}

	public void setRoleId(Long roleId) {
		this.roleId = roleId;
	}

}
