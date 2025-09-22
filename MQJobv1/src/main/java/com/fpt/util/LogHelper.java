package com.fpt.util;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class LogHelper {
	private final Logger logger;

	private LogHelper(Class<?> clazz) {
		this.logger = LogManager.getLogger(clazz);
	}

	public static LogHelper getInstance(Class<?> clazz) {
		return new LogHelper(clazz);
	}

	public void debug(Object message) {
		if (logger.isDebugEnabled()) {
			logger.debug(String.valueOf(message));
		}
	}

	public void debug(Object message, Throwable t) {
		if (logger.isDebugEnabled()) {
			logger.debug(String.valueOf(message), t);
		}
	}

	public void info(Object message) {
		if (logger.isInfoEnabled()) {
			logger.info(String.valueOf(message));
		}
	}

	public void info(Object message, Throwable t) {
		if (logger.isInfoEnabled()) {
			logger.info(String.valueOf(message), t);
		}
	}

	public void warn(Object message) {
		logger.warn(String.valueOf(message));
	}

	public void warn(Object message, Throwable t) {
		logger.warn(String.valueOf(message), t);
	}

	public void error(Object message) {
		logger.error(String.valueOf(message));
	}

	public void error(Object message, Throwable t) {
		logger.error(String.valueOf(message), t);
	}

	public boolean isDebugEnabled() {
		return logger.isDebugEnabled();
	}

	public boolean isInfoEnabled() {
		return logger.isInfoEnabled();
	}
}
