package com.fpt.signer;

public interface Command {
	public String Encrypt();

	public String Descrypt();

	public String signature();

	public boolean verify();

	public boolean checkValidCert();
}
