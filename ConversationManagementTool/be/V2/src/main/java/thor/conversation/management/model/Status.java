package thor.conversation.management.model;

public class Status<T> {
	Integer code;
	String message;
	T payload;
	public Status() {
		super();
	}
	public Status(Integer code, String message) {
		super();
		this.code = code;
		this.message = message;
	}
	public Status(Integer code, String message, T payload) {
		super();
		this.code = code;
		this.message = message;
		this.payload = payload;
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
}
