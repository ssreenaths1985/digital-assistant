package thor.conversation.management.model;

public class RunContainerInfo {
	String containerID;
	Long port;
	String domain;
	String env;
	public RunContainerInfo() {
		super();
	}
	public RunContainerInfo(String containerID, Long port, String domain, String env) {
		super();
		this.containerID = containerID;
		this.port = port;
		this.domain = domain;
		this.env = env;
	}
	public String getContainerID() {
		return containerID;
	}
	public void setContainerID(String containerID) {
		this.containerID = containerID;
	}
	public Long getPort() {
		return port;
	}
	public void setPort(Long port) {
		this.port = port;
	}
	public String getDomain() {
		return domain;
	}
	public void setDomain(String domain) {
		this.domain = domain;
	}
	public String getEnv() {
		return env;
	}
	public void setEnv(String env) {
		this.env = env;
	}
	
}
