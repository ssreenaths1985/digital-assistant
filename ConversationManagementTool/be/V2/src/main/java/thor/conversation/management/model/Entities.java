package thor.conversation.management.model;

public class Entities {
	
	String value;
	String entityName;
	Float confidence;

	
	public Entities() {
		super();
	}
	public Entities(String value, String entityName, Float confidence) {
		super();
		this.value = value;
		this.entityName = entityName;
		this.confidence = confidence;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public String getEntityName() {
		return entityName;
	}
	public void setEntityName(String entityName) {
		this.entityName = entityName;
	}
	public Float getConfidence() {
		return confidence;
	}
	public void setConfidence(Float confidence) {
		this.confidence = confidence;
	}

}
