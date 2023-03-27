package thor.conversation.management.model;

public class ContainerInfo {
	String imageID;
	String domain;

	public String getDomain() {
		return domain;
	}

	public void setDomain(String domain) {
		this.domain = domain;
	}

	public String getImageID() {
		return imageID;
	}

	public void setImageID(String imageID) {
		this.imageID = imageID;
	}

	public ContainerInfo(String imageID, String domain) {
		super();
		this.imageID = imageID;
		this.domain = domain;
	}

	public ContainerInfo() {
		super();
	}
}
