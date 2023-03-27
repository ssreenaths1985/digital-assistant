package thor.conversation.management.dto;

import java.util.List;

public class ReqNewTrainingData {
	String assistant;
	String name;
	String intentName;
	String type;
	String actionName;
	String action;
	List<String> answer;
	List<String> utterances;
	String regex;
	String regexValue;
	String synonym;
	List<String> synonymValues;
	String lookup;
	String lookupType;
	String lookupData;
	List<String> lookupValues;
	boolean update;

	public ReqNewTrainingData() {
		super();
	}
	public ReqNewTrainingData(String assistant, String name,String intentName, String type, String actionName, String action,
			List<String> answer, List<String> utterances,	String regex, String regexValue, String synonym, List<String> synonymValues, 
			String lookup, String lookupType, String lookupData, List<String> lookupValues, boolean update) {
		super();
		this.assistant = assistant;
		this.name=name;
		this.intentName = intentName;
		this.type = type;
		this.actionName = actionName;
		this.action = action;
		this.answer = answer;
		this.utterances = utterances;
		this.regex = regex;
		this.regexValue = regexValue;
		this.synonym = synonym;
		this.synonymValues = synonymValues;
		this.lookup = lookup;
		this.lookupType = lookupType;
		this.lookupData = lookupData;
		this.lookupValues = lookupValues;
		this.update = update;

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
	public List<String> getAnswer() {
		return answer;
	}
	public void setAnswer(List<String> answer) {
		this.answer = answer;
	}
	public String getIntentName() {
		return intentName;
	}
	public void setIntentName(String intentName) {
		this.intentName = intentName;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getActionName() {
		return actionName;
	}
	public void setActionName(String actionName) {
		this.actionName = actionName;
	}
	
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	public List<String> getUtterances() {
		return utterances;
	}
	public void setUtterances(List<String> utterances) {
		this.utterances = utterances;
	}
	public String getRegex() {
		return regex;
	}
	public void setRegex(String regex) {
		this.regex = regex;
	}
	public String getRegexValue() {
		return regexValue;
	}
	public void setRegexValue(String regexValue) {
		this.regexValue = regexValue;
	}
	public String getSynonym() {
		return synonym;
	}
	public void setSynonym(String synonym) {
		this.synonym = synonym;
	}
	public List<String> getSynonymValues() {
		return synonymValues;
	}
	public void setSynonymValues(List<String> synonymValues) {
		this.synonymValues = synonymValues;
	}
	public String getLookup() {
		return lookup;
	}
	public void setLookup(String lookup) {
		this.lookup = lookup;
	}
	public String getLookupType() {
		return lookupType;
	}
	public void setLookupType(String lookupType) {
		this.lookupType = lookupType;
	}
	public String getLookupData() {
		return lookupData;
	}
	public void setLookupData(String lookupData) {
		this.lookupData = lookupData;
	}
	public List<String> getLookupValues() {
		return lookupValues;
	}
	public void setLookupValues(List<String> lookupValues) {
		this.lookupValues = lookupValues;
	}
	public boolean isUpdate() {
		return update;
	}
	public void setUpdate(boolean update) {
		this.update = update;
	}
	

	
	
}
