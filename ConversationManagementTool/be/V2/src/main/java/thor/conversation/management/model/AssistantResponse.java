package thor.conversation.management.model;

import java.util.List;
import java.util.Map;

public class AssistantResponse {
	
	String type;
	List<Entities> entities;
	String intent;
	List<Map<String, Comparable>> intentRanking ;
	Integer timestamp;
	String text;
	
	public AssistantResponse(String type, List<Entities> entities, String intent, List<Map<String, Comparable>> intentRanking, Integer timestamp,
			String text) {
		super();
		this.type = type;
		this.entities = entities;
		this.intent = intent;
		this.intentRanking = intentRanking;
		this.timestamp = timestamp;
		this.text = text;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public AssistantResponse() {
		super();
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public List<Entities> getEntities() {
		return entities;
	}
	public void setEntities(List<Entities> entities) {
		this.entities = entities;
	}
	public String getIntent() {
		return intent;
	}
	public void setIntent(String intent) {
		this.intent = intent;
	}
	public List<Map<String, Comparable>> getIntentRankings() {
		return intentRanking;
	}
	public void setIntentRankings(List<Map<String, Comparable>> list) {
		this.intentRanking = list;
	}
	public Integer getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(Integer timestamp) {
		this.timestamp = timestamp;
	}
	

}
