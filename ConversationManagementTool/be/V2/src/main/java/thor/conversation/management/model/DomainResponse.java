package thor.conversation.management.model;

import java.util.List;
import java.util.Map;

public class DomainResponse {
	Integer code;
	String message;
	List<Map<String,String>> payload;
	public DomainResponse(Integer code, String message, List<Map<String,String>> payload) {
		super();
		this.code = code;
		this.message = message;
		this.payload =  payload;
	}
	public DomainResponse() {
		super();
	}
	public Integer getCode() {
		return code;
	}
	public void setCode(Integer code) {
		this.code = code;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public List<Map<String,String>>getPayload() {
		return payload;
	}
	public void setPayload(List<Map<String,String>> payload) {
		this.payload = payload;
	}
}
