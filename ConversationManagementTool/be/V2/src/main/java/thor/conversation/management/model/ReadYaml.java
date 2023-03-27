package thor.conversation.management.model;

import java.util.List;

public class ReadYaml {
	
	String responseObject ;
	List<String> intents ;
	List<String> responses;
	
	public ReadYaml(String responseObject, List<String> intents, List<String> responses) {
		super();
		this.responseObject = responseObject;
		this.intents = intents;
		this.responses = responses;
	}
	public String getResponseObject() {
		return responseObject;
	}
	public void setResponseObject(String responseObject) {
		this.responseObject = responseObject;
	}
	public List<String> getIntents() {
		return intents;
	}
	public void setIntents(List<String> intents) {
		this.intents = intents;
	}
	public List<String> getResponses() {
		return responses;
	}
	public void setResponses(List<String> responses) {
		this.responses = responses;
	}
	

}
