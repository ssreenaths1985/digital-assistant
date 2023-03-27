package thor.conversation.management.services;


import java.io.IOException;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;

import thor.conversation.management.dto.ReqMultipleIntentUtterances;
import thor.conversation.management.dto.ReqUtterances;
import thor.conversation.management.model.DatasetResponse;
import thor.conversation.management.model.ImageInfo;

public interface PersistenceService {
	Map<String, Map<String, List<Map<String, String>>>> sendDataToShadowService();
	
	String createDataset(String name, String botName);
    
	DatasetResponse getDataSets(String bot);
	
	String addUtterances(HashMap<String, List<String>> multipleIntentUtterances, String name, String bot) throws  IOException, URISyntaxException;

	String createIntent(String bot, String name,String intentName,String type, List<String> utterances,List<String> answer, String action) throws IOException, URISyntaxException;
	
	Map<String,List<String>> getIntents(String bot, String dataset);
	
	List<String> getUtterances(String intent);
	
	Object[][] getConfmat(String bot,String dataset, String modelName);
	
	Map<String,Map<String,Float>> getReports(String bot,String dataset, String modelName);
	
	Map<String, List<String>> getModels(String bot);
	
	List<String> confmatInts(String bot,String dataset, String modelName) throws IOException;
	
	Map<String, Map<Double, Integer>> getHistogram(String bot, String dataset, String modelName);
	
	String train(String bot,String dataset) throws IOException;
	
	String loadModel(String bot,String dataset, String modelName, String env) throws IOException;

	String evaluateModel(String bot, String dataset, String modelName);
	
	String deployModel(String bot,String dataset, String modelName, String env);

	ResponseEntity<InputStreamResource> getModelFromRemoteStorage(String bot,String dataset, String modelName) throws IOException;

	String createAssistant(String name);
	
	List<String> getAssistants();
	
	String createIndexatES(String index);
	
	Map<String, Object> getIntentResponse(String bot,String dataset, String intent);
	
	String modifyResponse(String bot, String name, Map<String, List<String>> modiifedResponses);
	
	DatasetResponse getDatasetVersions(String bot, String dataset);
	
	String restoreFileBackup(String bot, String name) throws IOException;
	
	String removeDataset(String bot, String name);
	
	String removeIntent(String bot, String name, String intentName);
	
	String removeUtterance(String bot, String name, String utterance);

	String parseFile(String string);
	
	String saveDraftData(String intent, String utterances, String domain, String type, String dataset);
	
	Map<String, String> getIntentTypes(String domain, String dataset);
	
	Map<String, List<String>> getIncompleteIntents(String domain, String dataset);
	
	String getRemainingUtterances(String domain, String intent, String dataset);

	Map<String, String> getPublishedModels(String bot);
	
	List<String> getDomains();

	String testvar();
	
	String compilerAddnewFile(String intent);
	
	String compilerReadFile(String intent);
	
	String compilePY(String file);
	
	String reloadData();
	
	String saveFile(String file);
	
	String compileJS();
	
	String addMultipleConvos(Map<String, List<String>> convoList, String name, String bot);
	
	List<String>getAllUtterances(String bot, String name);
	
//	String importDataset(String bot, String dataset, String nlu, String stories, String actions, String domains);
	String importDataset(String bot, String dataset, Object files);

	String createSynonym(String bot, String name, String synonym, List<String> synonymValues);

	String createRegex(String bot, String name, String regex, String regexValue);

	String createLookup(String bot, String name, String lookup, String lookupType, List<String> lookupValues,
			String lookupData);

	String readLookupScript(String bot, String dataset);
	
    String updateDataset(String bot, String name);

	String removeModel(String bot, String name, String model);

	String gitPush(String domain, String commitMsg);

	String gitClone(String domain);

	List<Map<String, Object>> getFeedbacks(String assistant);
	
	boolean checkActionFile(String assistant, String dataset);

    
    


//	List<Map<String, Comparable>> mapRankings(ArrayList bl);
}
