package thor.conversation.management.model;

public class ImageInfo {
	String domainName;
	
	String type;
	
	String dataset;
	
	String env;

	public String getDomainName() {
		return domainName;
	}

	public void setDomainName(String domainName) {
		this.domainName = domainName;
	}
	public String getType() {
		return type;
	}

	public void setModelName(String type) {
		this.type = type;
	}
	public String getDataset() {
		return dataset;
	}

	public void setDataset(String dataset) {
		this.dataset = dataset;
	}
	
	public String getEnv() {
		return env;
	}

	public void setEnv(String env) {
		this.env = env;
	}

	public ImageInfo(String domainName, String type, String dataset, String env) {
		super();
		this.domainName = domainName;
		this.type = type;
		this.dataset = dataset;
		this.env = env;
	}

	public ImageInfo() {
		super();
	}

	
}
