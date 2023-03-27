package thor.conversation.management.services;

import java.io.IOException;
import java.util.Date;
import java.util.Map;

import thor.conversation.management.model.Conversation;

public interface UtteranceService {

//	Map<String, Conversation> getConvoByDate(String domain, Date fromDate, Date toDate, Integer page, Integer pageSize) throws IOException;
	Map<String, Conversation> getConvoByDate(String domain) throws IOException;
	

	Conversation getConvoByUser(String domain, String userID, Integer page, Integer pageSize) throws IOException;
	
}
