package thor.conversation.management.servicesimpl;

import java.io.IOException;
import java.util.Map;

import org.elasticsearch.action.search.SearchResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import thor.conversation.management.dao.ConversationDAO;
import thor.conversation.management.model.Conversation;
import thor.conversation.management.repo.AssistantRepo;
import thor.conversation.management.services.UtteranceService;
import thor.conversation.management.util.ObjectMapperUtil;



@Service
public class UtterancesetviceIMPL implements UtteranceService {

	
	@Autowired
	ConversationDAO conversationDAO;
	
	@Autowired
	ObjectMapperUtil objectMapperUtil;

	@Override
//	public Map<String, Conversation> getConvoByDate(String domain, Date fromDate, Date toDate, Integer page, Integer pageSize)
//			throws IOException {
	public Map<String, Conversation> getConvoByDate(String domain) throws IOException {
		System.out.println("INSIDE the CONVERSATIONS1");
		SearchResponse result = conversationDAO.getByDate(domain);
//		SearchResponse result = conversationDAO.getByDate(domain, fromDate, toDate, page, pageSize);
		return objectMapperUtil.mapSearchResponseToConversation(result);
	}

	@Override
	public Conversation getConvoByUser(String domain, String userID, Integer page, Integer pageSize) throws IOException {
		SearchResponse result = conversationDAO.getByUser(domain, userID, page, pageSize);
		return objectMapperUtil.mapSearchResponseToConversation(result).get(userID);
	}

}
