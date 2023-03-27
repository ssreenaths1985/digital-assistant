package thor.conversation.management.dto;

public class ReqEntity {
	String name;
	Integer start;
	Integer end;

	public ReqEntity() {
		super();
	}
	public ReqEntity(String name, Integer start, Integer end) {
		super();
		this.name = name;
		this.start = start;
		this.end = end;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Integer getStart() {
		return start;
	}
	public void setStart(Integer start) {
		this.start = start;
	}
	public Integer getEnd() {
		return end;
	}
	public void setEnd(Integer end) {
		this.end = end;
	}

}
