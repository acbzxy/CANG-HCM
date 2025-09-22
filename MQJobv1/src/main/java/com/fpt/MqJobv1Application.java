package com.fpt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class MqJobv1Application {
	public static void main(String[] args) {
		SpringApplication.run(MqJobv1Application.class, args);
	}
}
