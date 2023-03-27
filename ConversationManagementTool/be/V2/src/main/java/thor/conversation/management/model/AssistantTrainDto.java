package thor.conversation.management.model;

public class AssistantTrainDto {
	String domain;
	
	String dataset;

	String modelName;
	
	String env;
	
	String data;
	
	

	public AssistantTrainDto() {
		super();
	}

	public AssistantTrainDto(String domain, String dataset, String modelName, String env, String data) {
		super();
		this.domain = domain;
		this.dataset = dataset;
		this.modelName = modelName;
		this.env = env;
		this.data = data;
		
	}

	public String getDomain() {
		return domain;
	}

	public void setDomain(String domain) {
		this.domain = domain;
	}
	
	public String getDataset() {
		return dataset;
	}

	public void setDataset(String dataset) {
		this.dataset = dataset;
	}
	public String getModelName() {
		return modelName;
	}

	public void setModelName(String modelName) {
		this.modelName = modelName;
	}
	
	public String getEnv() {
		return env;
	}

	public void setEnv(String env) {
		this.env = env;
	}
	
	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}
	
}
