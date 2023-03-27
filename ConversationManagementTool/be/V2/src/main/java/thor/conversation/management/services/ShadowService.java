package thor.conversation.management.services;

import java.util.List;
import java.util.Map;

public interface ShadowService {
	
	Map<String, Map<String, List<Map<String, String>>>> sendDataToShadowService();
	
	String getShadowResponse(String domain, String message);

}



