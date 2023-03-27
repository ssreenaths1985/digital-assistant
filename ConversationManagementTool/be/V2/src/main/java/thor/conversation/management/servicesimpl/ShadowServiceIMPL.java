package thor.conversation.management.servicesimpl;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Scanner;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import thor.conversation.management.services.ShadowService;

@Service
public class ShadowServiceIMPL implements ShadowService {

	Logger logger = LoggerFactory.getLogger(ShadowServiceIMPL.class);

	@Value("${assistant.training.bots}")
	String assistantPath;

	@Value("${assistant.data.nlu.file}")
	String nluFilePath;
	
	@Value("${assistant.shadow.service}")
	String shadowService;

	@Autowired
	RestTemplate restTemplate;

	@Override
	public Map<String, Map<String, List<Map<String, String>>>> sendDataToShadowService() {
		System.out.println("Inside the shadow call");
		Map<String, Map<String, List<Map<String, String>>>> domains = new HashMap<>();
		String[] assistants = new File(assistantPath).list();
		String nluFile = null;
		if (assistants != null) {
			for (String file : assistants) {
				if(file.equals("Thor"))
				{
					nluFile = assistantPath + file + "/datasets/Thor-V1" + nluFilePath;
				}
				else
				{
					nluFile = assistantPath + file + "/datasets/Vega-V1" + nluFilePath;
				}
			
				Map<String, List<Map<String, String>>> assistantData = new HashMap<>();
				List<Map<String, String>> nluContent = new ArrayList<>();

				try {
					System.out.print(nluFile);
					Scanner myReader = new Scanner(new File(nluFile));
					System.out.println(myReader);
					while (myReader.hasNextLine()) {
						String data = myReader.nextLine();
						if(data.startsWith("##intent:") || data.startsWith("## intent:")) {
							Map<String, String> intentsUtterances = new HashMap<>();
							String intent = data.split(":")[1];
							String utterance = "";
							intentsUtterances.put("intent", intent);
							data = myReader.nextLine();
							while (data.startsWith("-")) {
								utterance = utterance + data + "\n";
								data = myReader.nextLine();
							}
							intentsUtterances.put("examples", utterance);
							nluContent.add(intentsUtterances);
						}
					}
					assistantData.put("nlu", nluContent);
					domains.put(file, assistantData);
					myReader.close();
				} catch (Exception e) {
					e.printStackTrace();
					logger.error("File not found to read the content : " + e.getMessage());
				}
			}
		}
		return domains;
	}

	public String getShadowResponse(String domain, String message) {
		String intent = "NA";
	    List<String> givenList = Arrays.asList("cbp","cbp_provider","fracing_toolkit","piaa","curator","hubs","tag","network_connections","competency","playlist");
	    Random rand = new Random();
	    String randomElement = givenList.get(rand.nextInt(givenList.size()));
		Map<String, String> request = new HashMap<String, String>();
		request.put("domain", "Thor");
		request.put("query", message);
		Map<?, ?> res = restTemplate.postForObject("http://"+shadowService+"/query/infer", request, Map.class);
		Object payload = res.get("payload");
	    if(((Map<?, ?>)payload).get("prediction")!= null)
	    {
	    	Object prediction = ((Map<?, ?>)payload).get("prediction");
	    	if(prediction != null)
	    	{
	    		if(((Map<?, ?>)prediction).get("prediction") == null)
	    		{
	    			intent = randomElement;
	    		}
	    		else
	    		{
	    			intent = ((Map<?, ?>)prediction).get("prediction").toString();
	    		}
	    		
			}
	    }
		return intent;
	}
}
