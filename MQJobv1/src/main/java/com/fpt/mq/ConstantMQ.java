package com.fpt.mq;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class ConstantMQ {

	@Value("${application.mq-queue.host}")
	private String hostName;

	@Value("${application.mq-queue.channel}")
	private String channel;

	@Value("${application.mq-queue.port}")
	private int port;

	@Value("${application.mq-queue.ccsid}")
	private int ccsid;

	@Value("${application.mq-queue.queue-manager}")
	private String qmgr;

	@Value("${application.mq-queue.queue-in}")
	private String queueInbox;

	@Value("${application.mq-queue.queue-out}")
	private String queueOutbox;

	public static String HOST_NAME;
	public static String CHANNEL;
	public static int PORT;
	public static int CCSID;
	public static String QMGR;
	public static String QUEUE_INBOX;
	public static String QUEUE_OUTBOX;

	@PostConstruct
	public void init() {
		HOST_NAME = hostName;
		CHANNEL = channel;
		PORT = port;
		CCSID = ccsid;
		QMGR = qmgr;
		QUEUE_INBOX = queueInbox;
		QUEUE_OUTBOX = queueOutbox;
	}
}
