package thor.conversation.management.dto;

public class RequestByUser {
	String domain;
	String userID;
	Integer pageSize;
	public RequestByUser() {
		super();
	}
	Integer page;
	
	public String getDomain() {
		return domain;
	}
	public void setDomain(String domain) {
		this.domain = domain;
	}
	public String getUserID() {
		return userID;
	}
	public void setUserID(String userID) {
		this.userID = userID;
	}
	public Integer getPageSize() {
		return pageSize;
	}
	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}
	public Integer getPage() {
		return page;
	}
	public void setPage(Integer page) {
		this.page = page;
	}
	public RequestByUser(String domain, String userID, Integer pageSize, Integer page) {
		super();
		this.domain = domain;
		this.userID = userID;
		this.pageSize = pageSize;
		this.page = page;
	}
}
