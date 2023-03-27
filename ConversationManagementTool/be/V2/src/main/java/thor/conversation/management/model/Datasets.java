package thor.conversation.management.model;


public class Datasets {

	private int id;
	
	private String name;
	
	private String assistant;
	
	private String des;

	
	
	public Datasets(int id, String name, String assistant, String des) {
		super();
		this.id = id;
		this.name = name;
		this.assistant = assistant;
		this.des = des;
	}
	public String getAssistant() {
		return assistant;
	}
	public void setAssistant(String assistant) {
		this.assistant = assistant;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDes() {
		return des;
	}
	public void setDesc(String des) {
		this.des = des;
	}


	
	
	
	
	
	
	
}
	