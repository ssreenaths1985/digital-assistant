package thor.conversation.management.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "draft_data")
public class DraftData {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
	private int sl_no;
	
	private String intent;
	
	private String utterances;
	
	private String domain;
	
	private String type;
	
	private String dataset;
	
	
	public DraftData() {
    }


	public DraftData(String intent, String utterances, String domain, String type, String dataset) {
		super();
		this.intent = intent;
		this.utterances = utterances;
		this.domain = domain;
		this.type = type;
		this.dataset = dataset;
	}

	public int getSl_no() {
		return sl_no;
	}

	public void setSl_no(int sl_no) {
		this.sl_no = sl_no;
	}

	public String getIntent() {
		return intent;
	}

	public void setIntent(String intent) {
		this.intent = intent;
	}

	public String getUtterances() {
		return utterances;
	}

	public void setUtterances(String utterances) {
		this.utterances = utterances;
	}

	public String getDomain() {
		return domain;
	}

	public void setDomain(String domain) {
		this.domain = domain;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getDataset() {
		return dataset;
	}

	public void setDataset(String dataset) {
		this.dataset = dataset;
	}
	
}
	