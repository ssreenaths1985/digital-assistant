package thor.conversation.management.dto;

public class Status<T> {
	String message;
	Integer code;
	T payload;
	public Status() {
		super();
	}
	public Status(String message, Integer code, T payload) {
		super();
		this.message = message;
		this.code = code;
		this.payload = payload;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public Integer getCode() {
		return code;
	}
	public void setCode(Integer code) {
		this.code = code;
	}
	public T getPayload() {
		return payload;
	}
	public void setPayload(T payload) {
		this.payload = payload;
	}
	
}
