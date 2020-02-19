package hr.fer.opp.radnovrijeme.exceptions;

import org.springframework.web.bind.annotation.ResponseStatus;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@ResponseStatus(BAD_REQUEST)
public class RequestDeniedException extends RuntimeException {

	private static final long serialVersionUID = 5219672115557378295L;

	public RequestDeniedException(String message) {
		super(message);
	}
}
