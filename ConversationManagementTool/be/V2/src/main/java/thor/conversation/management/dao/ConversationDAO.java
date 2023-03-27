package thor.conversation.management.dao;

import java.io.IOException;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import thor.conversation.management.entity.AssistantInfo;
import thor.conversation.management.repo.AssistantRepo;

@Component
public class ConversationDAO {
	
    @Autowired
	RestHighLevelClient client;
	
	@Autowired
	AssistantRepo botRepo;

	String timeStamp = "timeStamp";

//	public SearchResponse getByDate(String domain, Date fromDate, Date toDate, Integer page, Integer pageSize) throws IOException {
		public SearchResponse getByDate(String domain) throws IOException {
		SearchSourceBuilder builder = new SearchSourceBuilder();
//		String indexName = botRepo.getOne(domain).getIndexName();
		String indexName = "thor_clone";
		if(domain.equals("ThorSales"))
		{
			indexName = "thor_sales";
		}
		else if(domain.equals("ThorChiring"))
		{
			indexName = "thor_hiring";
		}
		else if(domain.equals("ThorTarento"))
		{
			indexName = "thor_website";
		}
		else if(domain.equals("ThorKronos"))
		{
			indexName = "thor_kronos";
		}
		else
		{
			indexName = "thor_clone";
		}
		
//		builder.query(QueryBuilders.matchQuery("created_by" , "bot_uttered")).size(108);
//		Response response = client.getLowLevelClient().performRequest("GET", indexName+"/_doc/_count?q=created_by:bot_uttered");
//		System.out.println(response);
		builder.query(QueryBuilders.matchQuery("created_by" , "bot_uttered")).sort(SortBuilders.fieldSort("payload.date").order(SortOrder.DESC)).size(500);
//		sort("payload.date",SortOrder.DESC);
//		
//		SearchRequest req = new SearchRequest(indexName).source(builder);
//		builder.from((page - 1) * pageSize).size(pageSize)
//				.query(QueryBuilders.boolQuery()
//						.must(QueryBuilders.rangeQuery(timeStamp).from(fromDate.getTime() / 1000)
//								.to(toDate.getTime() / 1000)))
//				.sort(SortBuilders.fieldSort(timeStamp).order(SortOrder.DESC));
//		BotInfo botInfo = botRepo.getOne(domain);
//		
		
		SearchRequest req = new SearchRequest(indexName).source(builder);
		return client.search(req);
	}

	public SearchResponse getByUser(String domain, String userID, Integer page, Integer pageSize) throws IOException {
		SearchSourceBuilder builder = new SearchSourceBuilder();

		builder.from((page - 1) * pageSize).size(pageSize).query(QueryBuilders.matchPhraseQuery("user", userID))
				.sort(SortBuilders.fieldSort(timeStamp).order(SortOrder.DESC));

		AssistantInfo botInfo = botRepo.getOne(domain);

		String indexName = botInfo.getIndexName();

		SearchRequest req = new SearchRequest(indexName).source(builder);
		return client.search(req);
	}

}

