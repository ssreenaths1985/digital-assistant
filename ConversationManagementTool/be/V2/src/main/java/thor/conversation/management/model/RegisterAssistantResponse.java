package thor.conversation.management.model;

public class RegisterAssistantResponse {
	String message;
	Integer code;
	String payload;
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
	public String getPayload() {
		return payload;
	}
	public void setPayload(String payload) {
		this.payload = payload;
	}
	public RegisterAssistantResponse(String message, Integer code, String payload) {
		super();
		this.message = message;
		this.code = code;
		this.payload = payload;
	}
	public RegisterAssistantResponse() {
		super();
	}
}
