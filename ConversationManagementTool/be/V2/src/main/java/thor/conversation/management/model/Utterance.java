package thor.conversation.management.model;

import java.util.List;

public class Utterance {
	
	String text;
	String intent;
	Float confidence;
	Double timestamp;
	List<Entities> entities;
	public Utterance(String text, String intent, Float confidence, Double timestamp, List<Entities> entities) {
		super();
		this.text = text;
		this.intent = intent;
		this.confidence = confidence;
		this.timestamp = timestamp;
		this.entities = entities;
	}
	public Utterance() {
		super();
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public String getIntent() {
		return intent;
	}
	public void setIntent(String intent) {
		this.intent = intent;
	}
	public Float getConfidence() {
		return confidence;
	}
	public void setConfidence(Float confidence) {
		this.confidence = confidence;
	}
	public Double getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(Double timestamp) {
		this.timestamp = timestamp;
	}
	public List<Entities> getEntities() {
		return entities;
	}
	public void setEntities(List<Entities> entities) {
		this.entities = entities;
	}

	
}
