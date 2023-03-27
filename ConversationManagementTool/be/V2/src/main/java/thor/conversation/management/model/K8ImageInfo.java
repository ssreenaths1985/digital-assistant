package thor.conversation.management.model;

public class K8ImageInfo {
	String image;
	String svcName;
	String deploymentName;
	Integer port = 80;
	Integer targetPort = 4000;
	String serviceType = "ClusterIP";
    String domainName;
	String type;
	String dataset;
	String env;
	String modelName;
	
	public String getServiceType() {
		return serviceType;
	}
	public void setServiceType(String serviceType) {
		this.serviceType = serviceType;
	}
	public Integer getPort() {
		return port;
	}
	public void setPort(Integer port) {
		this.port = port;
	}
	public Integer getTargetPort() {
		return targetPort;
	}
	public void setTargetPort(Integer targetPort) {
		this.targetPort = targetPort;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public String getSvcName() {
		return svcName;
	}
	public void setSvcName(String svcName) {
		this.svcName = svcName;
	}
	public String getDeploymentName() {
		return deploymentName;
	}
	public void setDeploymentName(String deploymentName) {
		this.deploymentName = deploymentName;
	}
	public String getDomainName() {
		return domainName;
	}
	public void setDomainName(String domainName) {
		this.domainName = domainName;
	}
	public String getType(){
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getDataset() {
		return dataset;
	}
	public void setDataset(String dataset) {
		this.dataset = dataset;
	}
	
	public String getEnv() {
		return env;
	}
	public void setEnv(String env) {
		this.env = env;
	}
	
	public String getModelName() {
		return modelName;
	}
	public void setModelName(String modelName) {
		this.modelName = modelName;
	}
	public K8ImageInfo(String image, String svcName, String deploymentName, Integer port, Integer targetPort,
			String serviceType, String domainName, String type, String dataset, String env, String modelName) {
		super();
		this.image = image;
		this.svcName = svcName;
		this.deploymentName = deploymentName;
		this.port = port;
		this.targetPort = targetPort;
		this.serviceType = serviceType;
		this.domainName = domainName;
		this.type = type;
		this.dataset = dataset;
		this.env = env;
		this.modelName = modelName;
	}
	public K8ImageInfo() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
	
	
}
