package com.fpt.signer;

public class Crypt {
	private Command command;

	public Crypt(Command command) {
		super();
		this.command = command;
	}

	public Command getCommand() {
		return command;
	}

	public void setCommand(Command command) {
		this.command = command;
	}

	public String Encrypt() {
		return command.Encrypt();
	}

	public String Descrypt() {
		return command.Descrypt();
	}

	public String signature() {
		return command.signature();
	}

	public boolean verify() {
		return command.verify();
	}

	public boolean checkValidCert() {
		return command.checkValidCert();
	}

}
