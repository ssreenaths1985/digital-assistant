package thor.conversation.management.dto;

import java.util.List;

public class ReqUtterances {
	String text;
	String intent;
	List<ReqEntity> entities;
	public ReqUtterances(String text, String intent, List<ReqEntity> entities) {
		super();
		this.text = text;
		this.intent = intent;
		this.entities = entities;
	}
	public ReqUtterances() {
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
	public List<ReqEntity> getEntities() {
		return entities;
	}
	public void setEntities(List<ReqEntity> entities) {
		this.entities = entities;
	}
}
