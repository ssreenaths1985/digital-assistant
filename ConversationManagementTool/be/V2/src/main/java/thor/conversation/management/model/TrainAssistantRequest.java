package thor.conversation.management.model;

public class TrainAssistantRequest {
	String data;
	String domain;
	public String getData() {
		return data;
	}
	public void setData(String data) {
		this.data = data;
	}
	public String getDomain() {
		return domain;
	}
	public void setDomain(String domain) {
		this.domain = domain;
	}
	public TrainAssistantRequest(String data, String domain) {
		super();
		this.data = data;
		this.domain = domain;
	}

	
}
