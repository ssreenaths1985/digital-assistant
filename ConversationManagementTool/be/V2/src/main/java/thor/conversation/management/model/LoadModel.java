package thor.conversation.management.model;

public class LoadModel {
	
	  private String assistant;
	  
	  private String name;
	  
	  private String type;

	  private String env;
	  private String model;

	public LoadModel(String assistant, String name, String type, String model, String env) {
		super();
		this.assistant=assistant;
		this.name = name;
		this.model = model;
		this.env = env;
		this.type = type;
	}

	public String getAssistant() {
		return assistant;
	}

	public void setAssistant(String assistant) {
		this.assistant = assistant;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}
	public String getEnv() {
		return env;
	}

	public void setEnv(String env) {
		this.env = env;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	

	
	  

}
