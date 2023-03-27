package thor.conversation.management.model;
public class Compiler{

	
	private String intent;
	
	private String file;
	

	public Compiler(String intent, String file) {
		super();
		this.intent = intent;
		this.file = file;
	}

	public String getIntent() {
		return intent;
	}

	public void setIntent(String intent) {
		this.intent = intent;
	}

	public String getFile() {
		return file;
	}

	public void setFile(String file) {
		this.file = file;
	}
	
	
	
	
	


	
}
	