package thor.conversation.management.model;

public class Feedback {

	private String email_id;
	
	private String session_id;
	
	private int rating;
	
	private String comment;

	public String getEmail_id() {
		return email_id;
	}

	public void setEmail_id(String email_id) {
		this.email_id = email_id;
	}

	public String getSession_id() {
		return session_id;
	}

	public void setSession_id(String session_id) {
		this.session_id = session_id;
	}

	public int getRating() {
		return rating;
	}

	public void setRating(int rating) {
		this.rating = rating;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Feedback(String email_id, String session_id, int rating, String comment) {
		super();
		this.email_id = email_id;
		this.session_id = session_id;
		this.rating = rating;
		this.comment = comment;
	}

	public Feedback() {
		super();
		// TODO Auto-generated constructor stub
	}

	
}
	