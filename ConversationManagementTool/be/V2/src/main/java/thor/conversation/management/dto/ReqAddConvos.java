package thor.conversation.management.dto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ReqAddConvos {
	HashMap<String, List<String>> convoList;
	String name;
	String assistant;

	public ReqAddConvos() {
		super();
	}

	public ReqAddConvos(HashMap<String, List<String>> convoList, String name, String assistant) {
		super();
		this.convoList = convoList;
		this.name = name;
		this.assistant = assistant;
	}

	public String getAssistant() {
		return assistant;
	}

	public void setAssistant(String assistant) {
		this.assistant = assistant;
	}

	public HashMap<String, List<String>> getConvoList() {
		return convoList;
	}

	public void setConvoList(HashMap<String, List<String>> convoList) {
		this.convoList = convoList;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	
	
}
