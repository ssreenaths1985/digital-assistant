package thor.conversation.management.dto;

import java.util.List;

public class ReqAddUtterances {
	List<ReqUtterances> utterancesList;
	String name;
	String assistant;

	public ReqAddUtterances() {
		super();
	}

	public ReqAddUtterances(List<ReqUtterances> utterancesList, String name, String assistant) {
		super();
		this.utterancesList = utterancesList;
		this.name = name;
		this.assistant = assistant;
	}

	public String getAssistant() {
		return assistant;
	}

	public void setAssistant(String assistant) {
		this.assistant = assistant;
	}

	public List<ReqUtterances> getUtterancesList() {
		return utterancesList;
	}

	public void setUtterancesList(List<ReqUtterances> utterancesList) {
		this.utterancesList = utterancesList;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	
	
}
