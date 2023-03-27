package thor.conversation.management.dto;

import java.util.Date;

public class RequestByDate {
	String domain;
	Date fromDate;
	Date toDate;
	Integer pageSize;
	Integer page;
	String message;

	
	public RequestByDate(String domain,Date fromDate, Date toDate, Integer pageSize, Integer page) {
		super();
		this.fromDate = fromDate;
		this.toDate = toDate;
		this.pageSize = pageSize;
		this.page = page;
		this.domain = domain;
	}
	public Integer getPageSize() {
		return pageSize;
	}
	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}
	
	public Date getFromDate() {
		return fromDate;
	}
	public void setFromDate(Date fromDate) {
		this.fromDate = fromDate;
	}
	public Date getToDate() {
		return toDate;
	}
	public void setToDate(Date toDate) {
		this.toDate = toDate;
	}
	public Integer getPage() {
		return page;
	}
	public void setPage(Integer page) {
		this.page = page;
	}
	public String getDomain() {
		return domain;
	}
	public void setPage(String domain) {
		this.domain = domain;
	}
	
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public void setDomain(String domain) {
		this.domain = domain;
	}
	public RequestByDate() {
		super();
	}
}
