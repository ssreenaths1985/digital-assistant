package thor.conversation.management.model;

public class RegisterAssistantRequest {
	String domainName;
	String domainPort;
	public String getDomainName() {
		return domainName;
	}
	public void setDomainName(String domainName) {
		this.domainName = domainName;
	}
	public String getDomainPort() {
		return domainPort;
	}
	public void setDomainPort(String domainPort) {
		this.domainPort = domainPort;
	}
	public RegisterAssistantRequest(String domainName, String domainPort) {
		super();
		this.domainName = domainName;
		this.domainPort = domainPort;
	}
	public RegisterAssistantRequest() {
		super();
	}
}
