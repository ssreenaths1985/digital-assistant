package thor.conversation.management.model;

public class ContainerDto {
	String domain;
	Integer port;
	public ContainerDto() {
		super();
	}
	public ContainerDto(String domain, Integer port) {
		super();
		this.domain = domain;
		this.port = port;
	}
	public String getDomain() {
		return domain;
	}
	public void setDomain(String domain) {
		this.domain = domain;
	}
	public Integer getPort() {
		return port;
	}
	public void setPort(Integer port) {
		this.port = port;
	}
}
