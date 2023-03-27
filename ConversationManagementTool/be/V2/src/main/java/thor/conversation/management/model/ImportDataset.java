package thor.conversation.management.model;

public class ImportDataset{

	private String assistant;
	private String dataset;
	private String nlu;
	private String stories;
	private String actions;
	private String domains;
	private Object files;
	

	public ImportDataset(String assistant, String dataset, String nlu, String stories, String actions, String domains,  Object files)
	{
		super();
		this.assistant = assistant;
		this.dataset = dataset;
		this.nlu = nlu;
		this.stories = stories;
		this.actions = actions;
		this.domains = domains;
		this.files = files;
	}
	public String getAssistant() {
		return assistant;
	}

	public void setAssistant(String assistant) {
		this.assistant = assistant;
	}

	public String getDataset() {
		return dataset;
	}


	public void setDataset(String dataset) {
		this.dataset = dataset;
	}


	public String getNlu() {
		return nlu;
	}


	public void setNlu(String nlu) {
		this.nlu = nlu;
	}


	public String getStories() {
		return stories;
	}


	public void setStories(String stories) {
		this.stories = stories;
	}


	public String getActions() {
		return actions;
	}


	public void setActions(String actions) {
		this.actions = actions;
	}
	public String getDomains() {
		return domains;
	}
	public void setDomains(String domains) {
		this.domains = domains;
	}
	public Object getFiles() {
		return files;
	}
	public void setFiles(Object files) {
		this.files = files;
	}

	
	

	
	
	
	
	


	
}
	