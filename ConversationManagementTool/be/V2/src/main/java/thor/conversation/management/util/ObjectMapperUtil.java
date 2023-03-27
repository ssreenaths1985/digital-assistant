
package thor.conversation.management.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.script.Script;
import org.elasticsearch.search.SearchHit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import thor.conversation.management.model.Conversation;
import thor.conversation.management.services.ShadowService;



@Component
public class ObjectMapperUtil {

	private Logger logger = LoggerFactory.getLogger(ObjectMapperUtil.class);
    @Autowired
	RestHighLevelClient client;
    
    @Autowired
    ShadowService service;
    
	String timeStamp = "timeStamp";
	String intent = "intent";

	@SuppressWarnings("rawtypes")
	public Map<String, Conversation> mapSearchResponseToConversation(SearchResponse response) {
		System.out.println("INSIDE the CONVERSATIONS3");
		Map<String, Conversation> conversationMap = new LinkedHashMap<>();
		List<Map<String, Comparable>> finalRankings = new ArrayList<>();
		for (SearchHit hit : response.getHits())
		{
			String id = hit.getId();
			System.out.println(id);
			
			Map<String, Object> payload = (Map<String, Object>)hit.getSourceAsMap().get("payload");
			if(payload!=null)
			{
				Conversation conversation = new Conversation();
				if(payload.get("intent") == null)
				{
					conversation.setIntent("low_confidence");
				}
				else
				{
					conversation.setIntent(payload.get("intent").toString());
				}
				
				if(payload.get("shadow") == null)
				{
//					logger.debug("Shadow reponse not found >>> making a call to shadow service");
//					//get the index name for
//					String index = hit.getIndex();
//					String domain = index.split("_")[1];
//					String firstLetStr = domain.substring(0, 1);
//			        String remLetStr = domain.substring(1);
//			        firstLetStr = firstLetStr.toUpperCase();
//			        domain = firstLetStr + remLetStr;
//					String shadowIntent = service.getShadowResponse(domain, payload.get("message").toString());
//					//store the shadow response back to es index
//					storeBacktoES(index, id, shadowIntent);
//					conversation.setShadowIntent(shadowIntent);
				}
				else
				{
					if((payload.get("shadow").toString().length()) == 0)
					{
						conversation.setShadowIntent("NA");
					}
					else
					{
					conversation.setShadowIntent(payload.get("shadow").toString());
					}
				}
				conversation.setText(payload.get("message").toString());
				conversation.setDate(String.valueOf(payload.get("date")));
				ArrayList<String> myList = new ArrayList<String>();
				String rankings = String.valueOf(payload.get("intent_ranking"));
				rankings = rankings.substring(1, rankings.length() - 1);
				String[] xyz = rankings.split("},");
				for(int i =0; i<xyz.length; i++)
				{
					if(i<xyz.length-1)
					{
						String val = xyz[i] + "}";
						myList.add(val);
					}
					else
					{
						myList.add(xyz[i]);
					}
					
				}
				System.out.println(myList);
				conversation.setIntent_ranking(myList);
//				if(myList!=null || myList.size()!=0)
//				{
////					System.out.println("Inside the list");
//					List<Map<String, Comparable>> intent_rankings = mapRankings(myList);
////					System.out.println(intent_rankings);
//					conversation.setIntent_ranking(myList);
//				}
//				System.out.println(payload.get("confidence"));
//				if(payload.get("confidence") == null)
//				{
//					conversation.setConfidence(0.00);
//				}
//				else
//				{
//					Double conf = Double.parseDouble(payload.get("confidence").toString().substring(0,4));
//					conversation.setConfidence(conf);
//				}
				
				conversationMap.put(id, conversation);
			}
		}
		return conversationMap;
			
	}

//	
	public void storeBacktoES(String index, String id, String shadowIntent)
	{
		System.out.print(id);
		UpdateRequest updateRequest = new UpdateRequest(index, "_doc", id)
		        .script(new Script("ctx._source.payload.shadow = \""+shadowIntent+"\""));
		try {
			client.update(updateRequest).getId();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		logger.debug("Updated document" + id); ;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<Map<String, Comparable>> mapRankings(ArrayList block) {
		List<Map<String, Comparable>> intentRankings = new ArrayList<>();
		List<Map<String, Comparable>> finalRanking = new ArrayList<>();
		ObjectMapper mapper = new ObjectMapper();
		Double max = 0.00;
		Double cutOff = 0.00;
		System.out.println(block);
		for (int i = 0; i < block.size(); i++) {
			String map = block.get(i).toString();
			map = map.replaceAll("\'", "\"");
			Map<String, String> maps;
			try {
				
				maps = mapper.readValue(map, Map.class);  
				
				Object obj= maps.get("confidence");
			
				Double val = Double.parseDouble(obj.toString().substring(0,6));
				
				if (val > max) {
					max = val;
				}
				
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			// the half of max value will be the first filter.
			cutOff = max / 2;
		}

		// the confidences less than half of the max value will be filtered out and are
		// sorted in ascending order.

		intentRankings = sortConfidences(block, cutOff);

		// find the difference of consecutive rankings and get the final list
		finalRanking = filterOnRealtiveDifference(intentRankings);

		return finalRanking;
	}

	@SuppressWarnings("unchecked")
	public List<Map<String, Comparable>> sortConfidences(ArrayList block, Double cutOff) {
		ObjectMapper oMapper = new ObjectMapper();
		List<Map<String, Comparable>> intentRankings = new ArrayList<>();

		for (int i = 0; i < block.size(); i++)
		{
			String map = block.get(i).toString();
			map = map.replaceAll("\'", "\"");
		
			Map<String, Comparable> maps;
			try {
				maps = oMapper.readValue(map, Map.class);
				Object obj= maps.get("confidence");
				Double val = Double.parseDouble(obj.toString().substring(0,6));
				// add the values that are greater than cutoff criteria.
				if (val >= cutOff)
				{
					intentRankings.add(maps);
				}
			} catch (JsonParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (JsonMappingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
			

		}

		// sort the entries based on the confidence values.
		Collections.sort(intentRankings, new Comparator<Map<String, Comparable>>() {
			public int compare(Map<String, Comparable> o1, Map<String, Comparable> o2) {
				Collection<Comparable> values1 = o1.values();
				Collection<Comparable> values2 = o2.values();
				if (!values1.isEmpty() && !values2.isEmpty()) {
					return values1.iterator().next().compareTo(values2.iterator().next());
				} else {
					return 0;
				}
			}
		});

		// reverse the list to get the ascending order of the list.
		Collections.reverse(intentRankings);
		return intentRankings;

	}

	public List<Map<String, Comparable>> filterOnRealtiveDifference(List<Map<String, Comparable>> intentRankings) {
		Double diff;
		List<Map<String, Comparable>> finalRanking = new ArrayList<>();
		int n = intentRankings.size();
		for (int i = 0; i < n - 1; i++) {

			// difference between consecutive confidence rankings
			diff = ((Double)(intentRankings.get(i).get("confidence")))
					- ((Double)(intentRankings.get(i+1).get("confidence")));
			// two decimal value
			diff = Math.floor(diff * 100) / 100;
			// difference more than 0.05 is not considered as consecutive confusions
			Double diffThreshold = 0.50;
			// check if the consecutive difference is less than 0.05
			if (diff < diffThreshold) {
				// add the consecutive rankings to the final list iff they are not already
				// present
				if (!(finalRanking.contains(intentRankings.get(i)))) {
					finalRanking.add(intentRankings.get(i));
					if (!finalRanking.contains(intentRankings.get(i + 1))) {
						finalRanking.add(intentRankings.get(i + 1));

					}

				}
			}

		}
		return finalRanking;
	}
}

