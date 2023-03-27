package thor.conversation.management.model;

import java.util.List;
import java.util.Map;

public class IntentResponse {
	
	private String assistant;
	
	private String name;
	
	private String intent;
	
	private String utterance;
	
	private String response;
	
	private Map<String, List<String>> modifiedResponses;
	
	

	
	
	public IntentResponse(String assistant, String name, String intent, String utterance, String response, Map<String, List<String>> modifiedResponses) {
		super();
		this.assistant = assistant;
		this.name = name;
		this.intent = intent;
		this.utterance = utterance;
		this.response = response;
		this.modifiedResponses = modifiedResponses;
		
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



	public String getIntent() {
		return intent;
	}



	public void setIntent(String intent) {
		this.intent = intent;
	}
	
	
	public String getUtterance() {
		return utterance;
	}
	public void setUtterance(String utterance) {
		this.utterance = utterance;
	}
	
	public String getResponse() {
		return response;
	}



	public void setResponse(String response) {
		this.response = response;
	}



	public Map<String, List<String>> getModifiedResponses() {
		return modifiedResponses;
	}



	public void setModifiedResponses(Map<String, List<String>> modifiedResponses) {
		this.modifiedResponses = modifiedResponses;
	}
	
	
	
}
	