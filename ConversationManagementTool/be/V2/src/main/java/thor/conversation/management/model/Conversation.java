package thor.conversation.management.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Conversation {
	
	String intent;
	String text;
	String date;
	Double confidence;
	String shadowIntent;
//	List<Map<String, Comparable>> intent_ranking;
	ArrayList<String> intent_ranking;
	public ArrayList<String> getIntent_ranking() {
		return intent_ranking;
	}
	public void setIntent_ranking(ArrayList<String> intent_ranking) {
		this.intent_ranking = intent_ranking;
	}
	public String getIntent() {
		return intent;
	}
	public void setIntent(String intent) {
		this.intent = intent;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public Double getConfidence() {
		return confidence;
	}
	public void setConfidence(Double confidence) {
		this.confidence = confidence;
	}
	
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}

	List<Object> entities;
	List<Map<String, Comparable>> intentRankings;
	
	public List<Object> getEntities() {
		return entities;
	}
	public void setEntities(List<Object> entities) {
		this.entities = entities;
	}
//	public List<Map<String, Comparable>> getIntentRankings() {
//		return intentRankings;
//	}
//	public void setIntentRankings(List<Map<String, Comparable>> intentRankings) {
//		this.intentRankings = intentRankings;
//	}
	
	public String getShadowIntent() {
		return shadowIntent;
	}
	public void setShadowIntent(String shadowIntent) {
		this.shadowIntent = shadowIntent;
	}
	public Conversation(String intent, String text, String date, Double confidence, List<Object> entities,
			List<Map<String, Comparable>> intentRankings, String shadowIntent) {
		super();
		this.intent = intent;
		this.text = text;
		this.date = date;
		this.confidence = confidence;
		this.entities = entities;
		this.intentRankings = intentRankings;
		this.shadowIntent = shadowIntent;
	}
	public Conversation() {
		super();
		// TODO Auto-generated constructor stub
	}
}
