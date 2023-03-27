package thor.conversation.management.model;

public class K8Image {
	String imageName;
	String version="latest";
	public String getImageName() {
		return imageName;
	}
	public void setImageName(String imageName) {
		this.imageName = imageName;
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public K8Image(String imageName, String version) {
		super();
		this.imageName = imageName;
		this.version = version;
	}
}