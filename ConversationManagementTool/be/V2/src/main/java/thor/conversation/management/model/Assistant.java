package thor.conversation.management.model;

public class Assistant {

	private int id;
	
	private String name;
	
	private String path;
	
	private String indexName;

	
	
	public Assistant(String name, String path, String indexName) {
		super();
		this.name = name;
		this.path = path;
		this.indexName = indexName;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
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
	public String getIndexName() {
		return indexName;
	}
	public void setIndexName(String indexName) {
		this.indexName = indexName;
	}


	
	
	
	
	
	
	
}
	