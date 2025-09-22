package com.fpt.schedule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class TcsSchedule {
	@Autowired
	private TcsKxQueueIn queueIn;
	@Autowired
	private TcsKxQueueOut queueOut;

	@Scheduled(fixedDelayString ="${scheduler.getMessageJob.fixedDelay}")
	public void queueToInboxSchedule() {
		this.queueIn.execute();
	}

	@Scheduled(fixedDelayString ="${scheduler.putMsgJob.fixedDelay}")
	public void queueToOutboxSchedule() {
		this.queueOut.execute();
	}
}
