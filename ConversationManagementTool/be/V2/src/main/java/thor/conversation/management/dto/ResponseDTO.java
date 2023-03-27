package thor.conversation.management.dto;

import thor.conversation.management.model.Status;

public class ResponseDTO<T> {
	Status status;
	public ResponseDTO(Status status, T payload) {
		super();
		this.status = status;
		this.payload = payload;
	}
	public ResponseDTO() {
		super();
	}
	T payload;
	public Status getStatus() {
		return status;
	}
	public void setStatus(Status status) {
		this.status = status;
	}
	public T getPayload() {
		return payload;
	}
	public void setPayload(T payload) {
		this.payload = payload;
	}

}
