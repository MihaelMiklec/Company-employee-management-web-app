package hr.fer.opp.radnovrijeme.tests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.util.Date;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import hr.fer.opp.radnovrijeme.dto.EmployeeDTO;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@TestMethodOrder(OrderAnnotation.class)
@TestInstance(Lifecycle.PER_CLASS)
public class BackendTests {

	@LocalServerPort
	private int serverPort;

	private String baseUri;
	private String validUsername = "TinOroz";
	private String validPassword = "pass";

	private RestTemplate rest;

	private EmployeeDTO employee;

	// Inicijalne postavke prije pokretanja testa
	@BeforeAll
	public void setup() {
		baseUri = "http://localhost:" + serverPort;
		rest = new RestTemplate();

		employee = new EmployeeDTO();
		employee.setUsername("testniKorisnik123");
		employee.setPassword("1234");
		employee.setFirstName("Testni");
		employee.setLastName("korisnik");
		employee.setEmail("testni.korisnik@test.com");
		employee.setDateOfBirth(new Date(2020, 1, 1));
		employee.setCompanyId((long) 39);
		employee.setRoleId((long) 40);
	}

	// Test login-a s postojecim korisnikom
	@Test
	@Order(1)
	public void loginValidUserTest() {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		MultiValueMap<String, String> body = new LinkedMultiValueMap<String, String>();
		body.add("username", validUsername);
		body.add("password", validPassword);

		HttpEntity<MultiValueMap<String, String>> loginRequest = new HttpEntity<MultiValueMap<String, String>>(body,
				headers);

		ResponseEntity<String> loginResponse = rest.postForEntity(baseUri + "/login", loginRequest, String.class);

		assertEquals(200, loginResponse.getStatusCodeValue());
	}

	// Test logina s nepostojecim korisnikom
	@Test
	@Order(2)
	public void loginInvalidUserTest() {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		MultiValueMap<String, String> body = new LinkedMultiValueMap<String, String>();
		body.add("username", "asdfghjkl123456789");
		body.add("password", "asdfghjkl123456789");

		HttpEntity<MultiValueMap<String, String>> loginRequest = new HttpEntity<MultiValueMap<String, String>>(body,
				headers);

		try {
			rest.postForEntity(baseUri + "/login", loginRequest, String.class);
		} catch (HttpClientErrorException e) {
			assertEquals(401, e.getRawStatusCode());
		}
	}

	// Test logout-a
	@Test
	@Order(3)
	public void logoutTest() {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		MultiValueMap<String, String> body = new LinkedMultiValueMap<String, String>();
		body.add("username", validUsername);
		body.add("password", validPassword);

		HttpEntity<MultiValueMap<String, String>> loginRequest = new HttpEntity<MultiValueMap<String, String>>(body,
				headers);

		ResponseEntity<String> loginResponse = rest.postForEntity(baseUri + "/login", loginRequest, String.class);

		assertEquals(200, loginResponse.getStatusCodeValue());

		ResponseEntity<String> logoutResponse = rest.postForEntity(baseUri + "/logout", null, String.class);

		assertEquals(200, logoutResponse.getStatusCodeValue());
		assertNull(logoutResponse.getBody());
	}

	// Test kreiranja zaposlenika
	@Test
	@Order(4)
	public void createEmployeeTest() {
		ResponseEntity<EmployeeDTO> createEmployeeResponse = rest.postForEntity(baseUri + "/employees", employee,
				EmployeeDTO.class);

		assertEquals(201, createEmployeeResponse.getStatusCodeValue());
		assertNotNull(createEmployeeResponse.getBody());

		EmployeeDTO createdEmployee = createEmployeeResponse.getBody();

		assertEquals(employee.getUsername(), createdEmployee.getUsername());
		assertEquals(employee.getFirstName(), createdEmployee.getFirstName());
		assertEquals(employee.getLastName(), createdEmployee.getLastName());
		assertEquals(employee.getEmail(), createdEmployee.getEmail());
		// Zbog hashiranja vraceni password ne smije biti isti poslanom (ne hashiranom)
		// passwordu
		assertNotEquals(employee.getPassword(), createdEmployee.getPassword());
		//assertEquals(employee.getDateOfBirth(), createdEmployee.getDateOfBirth());
		assertEquals(employee.getCompanyId(), createdEmployee.getCompanyId());
		assertEquals(employee.getRoleId(), createdEmployee.getRoleId());

		employee.setId(createdEmployee.getId());
	}

	// Test dohvacanja zaposlenika
	@Test
	@Order(5)
	public void getEmployeeTest() {
		ResponseEntity<EmployeeDTO> getEmployeeResponse = rest.getForEntity(baseUri + "/employees/" + employee.getId(),
				EmployeeDTO.class);

		assertEquals(200, getEmployeeResponse.getStatusCodeValue());
		assertNotNull(getEmployeeResponse.getBody());

		EmployeeDTO apiEmployee = getEmployeeResponse.getBody();

		assertEquals(employee.getId(), apiEmployee.getId());
		assertEquals(employee.getUsername(), apiEmployee.getUsername());
		assertEquals(employee.getFirstName(), apiEmployee.getFirstName());
		assertEquals(employee.getLastName(), apiEmployee.getLastName());
		assertEquals(employee.getEmail(), apiEmployee.getEmail());
		// Zbog hashiranja vraceni password ne smije biti isti poslanom (ne hashiranom)
		// passwordu
		assertNotEquals(employee.getPassword(), apiEmployee.getPassword());
		//assertEquals(employee.getDateOfBirth(), apiEmployee.getDateOfBirth());
		assertEquals(employee.getCompanyId(), apiEmployee.getCompanyId());
		assertEquals(employee.getRoleId(), apiEmployee.getRoleId());
	}

	// Test brisanja zaposlenika
	@Test
	@Order(6)
	public void deleteEmployeeTest() {
		rest.delete(baseUri + "/employees/" + employee.getId());

		// Provjera da je zaposlenik stvarno obrisan
		try {
			rest.getForEntity(baseUri + "/employees/" + employee.getId(), EmployeeDTO.class);
		} catch (HttpClientErrorException e) {
			assertEquals(404, e.getRawStatusCode());
		}
	}
	
}
