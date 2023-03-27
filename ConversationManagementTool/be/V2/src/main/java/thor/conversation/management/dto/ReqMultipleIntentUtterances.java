package thor.conversation.management.dto;

import java.util.HashMap;
import java.util.List;

public class ReqMultipleIntentUtterances {
	HashMap<String, List<String>> multipleIntentUtterances;
	String name;
	String assistant;
	public ReqMultipleIntentUtterances(HashMap<String, List<String>> multipleIntentUtterances, String name, String assistant) {
		super();
	  this.multipleIntentUtterances = multipleIntentUtterances;
	  this.name = name;
	  this.assistant = assistant;
	}
	public ReqMultipleIntentUtterances() {
		super();
	}
	public HashMap<String, List<String>> getMultipleIntentUtterances() {
		return multipleIntentUtterances;
	}
	public void setMultipleIntentUtterances(HashMap<String, List<String>> multipleIntentUtterances) {
		this.multipleIntentUtterances = multipleIntentUtterances;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getAssistant() {
		return assistant;
	}
	public void setAssistant(String assistant) {
		this.assistant = assistant;
	}


}
