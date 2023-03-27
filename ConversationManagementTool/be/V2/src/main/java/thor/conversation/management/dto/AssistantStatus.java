package thor.conversation.management.dto;

public class AssistantStatus {
	String domain;
	boolean up;
	public AssistantStatus() {
		super();
	}
	public AssistantStatus(String domain, boolean up) {
		super();
		this.domain = domain;
		this.up = up;
	}
	public String getDomain() {
		return domain;
	}
	public void setDomain(String domain) {
		this.domain = domain;
	}
	public boolean isUp() {
		return up;
	}
	public void setUp(boolean up) {
		this.up = up;
	}
}
