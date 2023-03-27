package thor.conversation.management.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class AssistantInfo {
	@Id
	String domain;
	Long port;
	String dockerImageID;
	String dockerContainerID;
	String env;
	String ip;
	String indexName;
	String path;
	String publishedModels;
	public String getDockerImageID() {
		return dockerImageID;
	}
	public void setDockerImageID(String dockerImageID) {
		this.dockerImageID = dockerImageID;
	}
	public String getDockerContainerID() {
		return dockerContainerID;
	}
	public void setDockerContainerID(String dockerContainerID) {
		this.dockerContainerID = dockerContainerID;
	}
	public String getDomain() {
		return domain;
	}
	public void setDomain(String domain) {
		this.domain = domain;
	}
	public Long getPort() {
		return port;
	}
	public void setPort(Long port) {
		this.port = port;
	}
	public String getEnv() {
		return env;
	}
	public void setEnv(String env) {
		this.env = env;
	}
	public String getIP() {
		return ip;
	}
	public void setIP(String ip) {
		this.ip = ip;
	}
	public String getIndexName() {
		return indexName;
	}
	public void setIndexName(String indexName) {
		this.indexName = indexName;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public String getPublishedModels() {
		return publishedModels;
	}
	public void setPublishedModels(String publishedModels) {
		this.publishedModels = publishedModels;
	}
	public AssistantInfo(String domain, Long port, String dockerImageID, String dockerContainerID, String env, String ip, String indexName, String path, String publishedModels) {
		super();
		this.domain = domain;
		this.port = port;
		this.dockerImageID = dockerImageID;
		this.dockerContainerID = dockerContainerID;
		this.env = env;
		this.ip = ip;
		this.indexName = indexName;
		this.path = path;
		this.publishedModels = publishedModels;
	}
	public AssistantInfo() {
		super();
	}
}
