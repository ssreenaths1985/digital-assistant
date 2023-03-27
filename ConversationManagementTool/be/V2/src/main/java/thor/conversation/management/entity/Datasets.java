package thor.conversation.management.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Datasets")
public class Datasets {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	
	private String name;
	
	private String bot;
	
	private String des;

	
	
	public Datasets(int id, String name, String bot, String des) {
		super();
		this.id = id;
		this.name = name;
		this.bot = bot;
		this.des = des;
	}
	public String getBot() {
		return bot;
	}
	public void setPath(String bot) {
		this.bot = bot;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDes() {
		return des;
	}
	public void setDesc(String des) {
		this.des = des;
	}


	
	
	
	
	
	
	
}
	