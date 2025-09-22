package com.fpt.util;

import org.springframework.dao.DataAccessException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class DAOException extends DataAccessException {
	private static final long serialVersionUID = 1L;

	public DAOException(String errorMessage) {
		super(errorMessage);
		log.error("DAOException: {}", errorMessage);
	}

	public DAOException(String errorMessage, Throwable cause) {
		super(errorMessage, cause);
		log.error("DAOException: {}, caused by: {}", errorMessage, cause.getMessage());
	}

	@Override
	public String getMessage() {
		return "Data access exception: " + super.getMessage();
	}
}
