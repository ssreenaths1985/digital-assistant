package thor.conversation.management.servicesimpl;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.BasicFileAttributes;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Scanner;
import java.util.TreeMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.api.errors.InvalidRemoteException;
import org.eclipse.jgit.api.errors.TransportException;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.storage.file.FileRepositoryBuilder;
import org.eclipse.jgit.transport.RefSpec;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.yaml.snakeyaml.DumperOptions;
import org.yaml.snakeyaml.DumperOptions.FlowStyle;
import org.yaml.snakeyaml.Yaml;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.jayway.jsonpath.JsonPath;

import thor.conversation.management.dto.ReqUtterances;
import thor.conversation.management.entity.AssistantInfo;
import thor.conversation.management.entity.DraftData;
import thor.conversation.management.model.Conversation;
import thor.conversation.management.model.DatasetResponse;
import thor.conversation.management.model.Feedback;
import thor.conversation.management.repo.AssistantRepo;
import thor.conversation.management.repo.IntentRepo;
import thor.conversation.management.services.DockerService;
import thor.conversation.management.services.PersistenceService;

@Component
public class PersistenceServiceIMPL implements PersistenceService {
	Map<String, List<String>> intents = new HashMap<>();

	Logger logger = LoggerFactory.getLogger(PersistenceServiceIMPL.class);

	@Value("${assistant.baseDir.path}")
	String baseDirectory;

	@Value("${assistant.training.bots}")
	String assistantPath;

	@Value("${assistant.data.nlu.file}")
	String nluFilePath;

	@Value("${assistant.data.story.file}")
	String storyFilePath;

	@Value("${assistant.domain.file}")
	String domainFilePath;

	@Value("${assistant.config.file}")
	String configFilePath;

	@Value("${assistant.models}")
	String modelDirPath;

	@Value("${assistant.results}")
	String resultDirPath;

	@Value("${assistant.reports}")
	String reportstDirPath;

	@Value("${assistant.baseReports}")
	String baseReports;

	@Value("${assistant.histogram}")
	String histoPath;

	@Value("${assistant.backup.path}")
	String backupDataPath;

	@Value("${assistant.production.env}")
	String productionIp;

	@Value("${assistant.staging.env}")
	String stagingIp;

	@Value("${path.docker.file}")
	String dockerFilePath;

	@Value("${assistant.compiler.service}")
	String compilerUrl;

	@Value("${git.username}")
	String gitUsername;
	
	@Value("${git.branch.name}")
	String gitBranch;
	
	@Value("${git.repo.name}")
	String gitRepo;

	@Value("${assistant.git.clone.path}")
	String gitClonePath;

	@Value("${git.token}")
	String gitToken;

	@Value("${docker.bot.port}")
	Long dockerBotPort;

	@Value("${assistant.server.ip}")
	String botServerIp;
	
	@Value("${assistant.rasa.nlp.sandbox.service}")
	String sandboxNLP;
	
	@Value("${assistant.rasa.nlp.kronos.service}")
	String kronosNLP;
	
	@Value("${assistant.rasa.nlp.leadership.service}")
	String leadershipNLP;
	
	@Value("${assistant.rasa.action.sandbox.service}")
	String sandboxAction;
	
	@Value("${assistant.rasa.nlp.igot.service}")
	String igotNLP;
	
	@Value("${assistant.rasa.nlp.chiring.service}")
	String chiringNLP;
	
	@Value("${assistant.rasa.nlp.website.service}")
	String websiteNLP;
	
	@Value("${assistant.rasa.action.igot.service}")
	String igotAction;

	
	@Value("${assistant.stage.api.key}")
	String apiKey;
	
	@Autowired
	AssistantRepo botRepo;

	@Autowired
	IntentRepo intentRepo;;

	@Autowired
	RestHighLevelClient client;

	@Autowired
	DockerService dockerService;

	@Autowired
	RestTemplate restTemplate;
	
//    @Autowired
//	RestHighLevelClient client;

	ObjectMapper oMapper = new ObjectMapper();

private String String ;

	@Override
	public String addUtterances(HashMap<String, List<String>> utteranceList, String name, String bot)
			throws IOException, URISyntaxException {
		System.out.println(bot);
		Map<String, List<String>> trainingData = new HashMap<>();
		String datasetPath = assistantPath + bot + "/datasets/" + name;
		String nlu = datasetPath + nluFilePath;
		for (Entry<String, List<String>> entry : utteranceList.entrySet()) {

			// get the text(utterance) and the intent from the utterance object

			List<String> texts = entry.getValue();
			for(int i = 0; i<texts.size(); i++)
			{
				texts.set(i, "- "+texts.get(i));
			}
			String text = texts.stream().collect(Collectors.joining(", "));
			
			String inte = entry.getKey();

			// check if the utterance is already present, if not, add it.

			boolean isPresent = isUtterancePresent(nlu, text, inte);
			if (isPresent) {
				return "Utterance already present.";
			}
			takeFileBackup(bot, name);
//			if (utterance.getEntities() != null && !utterance.getEntities().isEmpty()) {
//				 creating entity notation in text
//				addEntityToText(utterance);
				// adding formatted text to map for persistence in batch
				if (trainingData.isEmpty() || !trainingData.containsKey(inte)) {
					// create intent map if not already present
					List<String> uttList = new ArrayList<>();
					uttList.add(text);
					//trainingData.put(utterance.getIntent(), uttList);
					trainingData.put(inte, uttList);
				} 
				else
				{
					//trainingData.get(utterance.getIntent()).add(utterance.getText());
					trainingData.get(inte).add(text);
				}
//			}

		}
		return appendToOrCreateFile(bot, name, trainingData);
	}

	public boolean isUtterancePresent(String nlu, String text, String intent) throws FileNotFoundException {

		System.out.println(intent);
		boolean present = false;
		File mdFile = new File(nlu).getAbsoluteFile();
		Scanner myReader = new Scanner(mdFile);
		while (myReader.hasNextLine()) {
			String line = myReader.nextLine();

			// check if the intent is present

			if (line.startsWith("##") && line.endsWith(intent)) {
				// check if the utterance is present
				while (myReader.hasNextLine()) {
					String nextLine = myReader.nextLine();
					while (nextLine.startsWith("-")) {
						String[] utterance = nextLine.split("- ");
						if (utterance[1].equalsIgnoreCase(text)) {
							present = true;
							break;
						}
						break;
					}
				}
			}
		}
		myReader.close();
		return present;
	}

	private String appendToOrCreateFile(String bot, String name, Map<String, List<String>> trainingData)
			throws IOException {
		String draftDataset = assistantPath + bot + "/datasets/" + "draft";
		if(new File(draftDataset).exists())
		{
			name = "draft";
		}
		else
		{
			//create a draft version of the dataset
			String newDirectory = assistantPath + bot + "/datasets/" + "draft";
			File createDirectory = new File(newDirectory);
			createDirectory.mkdir();
			File baseDir = new File(assistantPath + bot + "/datasets/" + name);
			try {
				FileUtils.copyDirectory(baseDir, createDirectory);
			}catch(Exception e)
			{
				e.printStackTrace();
			}
		    name = "draft";
		}
		File dfile = new File(assistantPath + bot + "/datasets/" + "draft"+ nluFilePath);
		List<String> lines = Files.readAllLines(Paths.get(dfile.getAbsolutePath()));
		CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>(lines);

		for (String key : trainingData.keySet()) {
			for (String line : list) {
				if (line.startsWith("##") && line.endsWith(key)) {
					list.addAll(list.indexOf(line) + 1, trainingData.get(key));
				}
			}
		}
		try (FileWriter fw = new FileWriter(dfile, false)) {
			for (String line : list) {
				fw.write(line + "\n");
			}
		}
//		draftDatasetVersioning(bot, name);
		return "Successfully created utterance";
	}

	private void addEntityToText(ReqUtterances utterance) {
		String text = utterance.getText();
		text = "- " + text;
		utterance.setText(text);
	}

	@Override
	public String createIntent(String bot, String name, String intentName, String type, List<String> utterances,
			List<String>answer, String action) throws IOException, URISyntaxException {
		
		List<DraftData> details = intentRepo.findByDomainAndDataset(bot, name);
		boolean present = false;
		for (int i = 0; i < details.size(); i++) {
			System.out.println(details.get(i).getIntent());
			if (details.get(i).getIntent().equals(intentName)) {
				System.out.println(details.get(i).getIntent());
				present = true;
			}
		}
		if (present) {
//			System.out.println("this intent is present");
			intentRepo.deleteByDomainAndIntent(bot, intentName);
		}
		String actionName = null;
		if (type.equals("direct"))
		{
			actionName = "utter_" + intentName;
		} else
		{
			actionName = "action_get" + intentName;
		}

		// take backup of file
		//check if the draft version is already available for the dataset
		String draftDataset = assistantPath + bot + "/datasets/" + "draft";
		if(new File(draftDataset).exists())
		{
			name = "draft";
		}
		else
		{
			//create a draft version of the dataset
			String newDirectory = assistantPath + bot + "/datasets/" + "draft";
			File createDirectory = new File(newDirectory);
			createDirectory.mkdir();
			File baseDir = new File(assistantPath + bot + "/datasets/" + name);
			try {
				FileUtils.copyDirectory(baseDir, createDirectory);
			}catch(Exception e)
			{
				e.printStackTrace();
			}
		    name = "draft";
		}
		boolean stepsComplete = true;
		stepsComplete = addNewIntentInNluFile(bot, name, intentName, utterances);
		stepsComplete = stepsComplete && createStory(bot, name, intentName, actionName);
		stepsComplete = stepsComplete && modifyDomain(bot, name, intentName, type, actionName, answer, utterances);
		stepsComplete = stepsComplete && addtoConfig(bot, name, intentName, actionName);
		if (type.equals("custom"))
		{
			stepsComplete = stepsComplete && addtoAction(bot,name, action);
		}
		// create a new version of dataset with updated data
		// all three steps not fulfilled, revert changes in all files
		if (!stepsComplete) {
			restoreFileBackup(bot, name);
		}

		return "Successfully created intent : " + intentName;
	}

	private String datasetVersioning(String bot, String name) {
		// take the version of existing dataset
		String[] version = name.split("-V");
		// create a new version
		int versionNumber = Integer.parseInt(version[1]) + 1;
		// name the dataset with new version
		File oldVersion = new File(assistantPath + bot + "/datasets/" + name);
		logger.debug("Actual dataset :" + assistantPath + bot + "/datasets/" + name);
		File newVersion = new File(assistantPath + bot + "/datasets/" + version[0] + "-V" + versionNumber);
		logger.debug("Updated version :" + assistantPath + bot + "/datasets/" + version[0] + "-V" + versionNumber);
		// replace the old dataset with new dataset
		oldVersion.renameTo(newVersion);
		return "Updated dataset Successfull";
	}

	public String restoreFileBackup(String bot, String name) throws IOException {
		String[] dataset = name.split("-V");
		File path = new File(assistantPath + bot + "/datasets/");
		String[] files = path.list();
		if (files != null) {
			for (String file : files) {
				if (file.startsWith(dataset[0])) {
					takeFileBackup(bot, file);
					File index = new File(assistantPath + bot + "/datasets/" + file);
					try {
						logger.debug(assistantPath + bot + "/datasets/" + file);
						FileUtils.deleteDirectory(index);
					} catch (Exception e) {
						logger.error("Restore successfully. Could not delete the directory from backup folder. "
								+ e.getMessage());
					}

				}

			}
		}
		String restoreSource = assistantPath + bot + "/backup/" + name;
		String restoreDest = assistantPath + bot + "/datasets/" + name;
		logger.debug("Restoring from :" + assistantPath + bot + "/backup/" + name);
		logger.debug("Restoring to :" + assistantPath + bot + "/datasets/" + name);
		Files.move(new File(restoreSource).toPath(), new File(restoreDest).toPath(),StandardCopyOption.REPLACE_EXISTING);
		//gitPush(bot,"Data restore successful");
		return "Dataset restore sucessfull";
	}

	private void takeFileBackup(String bot, String name) throws IOException {
		File path = new File(assistantPath + bot + "/datasets/" + name);
		logger.debug(assistantPath + bot + "/datasets/" + name);
		File backupPath = new File(assistantPath + bot + "/backup/" + name);
		logger.debug(assistantPath + bot + "/backup/" + name);
		backupPath.mkdir();
		try {
			FileUtils.copyDirectory(path, backupPath);
			//gitPush(bot,"Updated backup folder");
		} catch (Exception e) {
			logger.error("Couldn't complete file backup : " + e.getMessage());
		}

	}
	@SuppressWarnings("unchecked")
	private boolean modifyDomain(String bot, String name, String intentName, String type, String actionName, List<String> answer, List<String> utterances)
	{

		String datasetPath = assistantPath + bot + "/datasets/" + name;
		List<String> entities = filterAllEntities(utterances);
		// YAML formatting options
		DumperOptions options = new DumperOptions();
		options.setIndent(2);
		options.setPrettyFlow(true);
		options.setDefaultFlowStyle(FlowStyle.BLOCK);

		Yaml yaml = new Yaml(options);
		Map<String, Object> domainMap;
		try {
			domainMap = yaml.load(new FileReader(new File(datasetPath + domainFilePath)));
		} catch (FileNotFoundException e) {
			logger.error(e.getMessage());
			return false;
		}
		if (type.equals("direct")) {
			ArrayList<String> intentList = (ArrayList<String>) domainMap.get("intents");
			intentList.add(intentName);

			// add action to domain
			ArrayList<String> actions = (ArrayList<String>) domainMap.get("actions");
			actions.add(actionName);

			// add entities to domain
			ArrayList<String> entityList = (ArrayList<String>) domainMap.get("entities");
			for (String entity : entities) {
				entityList.add(entity);
			}
			LinkedHashMap<String, ArrayList<Object>> responses = (LinkedHashMap<String, ArrayList<Object>>) domainMap
					.get("responses");

			// create answer template
			ArrayList<Object> responseObj = createDomainResponseObject(answer, intentName);
			// add answer template to map
			responses.put(actionName, responseObj);

		} else {

			ArrayList<String> intentList = (ArrayList<String>) domainMap.get("intents");
			intentList.add(intentName);

			// add action to domain
			ArrayList<String> actions = (ArrayList<String>) domainMap.get("actions");
			actions.add(actionName);

			// add entities to domain
			ArrayList<String> entityList = (ArrayList<String>) domainMap.get("entities");
			for (String entity : entities) {
				entityList.add(entity);
			}
		}
		// add intent to domain

		try (FileWriter fw = new FileWriter(new File(datasetPath + domainFilePath), false)) {
			yaml.dump(domainMap, fw);
		} catch (IOException e) {
			logger.error(e.getMessage());
			return false;
		}
		return true;
	}

	private ArrayList<Object> createDomainResponseObject(List<String> answer, String intentName)
	{
		ArrayList<Object> x1 = new ArrayList<>();
		ArrayList<Object> x2 = new ArrayList<>();
		LinkedHashMap<String, Object> y1 = new LinkedHashMap<>();
		LinkedHashMap<String, Object> y2 = new LinkedHashMap<>();
		LinkedHashMap<String, Object> y3 = new LinkedHashMap<>();
		y3.put("type", "response");
		y3.put("text", answer);
		y3.put("intent", intentName);
		x2.add(y3);
		y2.put("blocks", x2);
		y1.put("custom", y2);
		x1.add(y1);
		return x1;
	}

	private List<String> filterAllEntities(List<String> utterances) {
		List<String> entities = new ArrayList<>();
		for (String utterance : utterances) {
			String[] words = utterance.split("\\s+");
			for (int i = 0; i < words.length; i++) {
				if (words[i].startsWith("[")) {
					String text = words[i].substring(1, words[i].length() - 1);
					entities.add(text);
				}
			}
		}
		return entities;
	}

	private boolean createStory(String bot, String name, String intentName, String actionName) {
		String storyFile = assistantPath + bot + "/datasets/" + name + storyFilePath;
		try (FileWriter fw = new FileWriter(storyFile, true)) {
			String story = "# " + intentName + "\n" + "* " + intentName + "\n" + "  - " + actionName + "\n";
			fw.write("\n" + story);
		} catch (IOException e) {
			logger.error(e.getMessage());
			return false;
		}
		return true;
	}

	private boolean addNewIntentInNluFile(String bot, String name, String intentName, List<String> utterances) {
		String datasetPath = assistantPath + bot + "/datasets/" + name;

		// edit the nluFile and add new data
		System.out.print(utterances);
		System.out.print(utterances.get(0));
		try (FileWriter fw = new FileWriter(datasetPath + nluFilePath, true)) {
			fw.write("\n" + "## intent:" + intentName);
			for (int i = 0; i < utterances.size(); i++) {
				fw.write("\n" + "- " + utterances.get(i));
			}
			fw.write("\n");
		} catch (IOException e) {
			logger.error(e.getMessage());
			return false;
		}
		return true;
	}
    
	@SuppressWarnings("unchecked")
	private boolean addtoConfig(String bot, String name, String intentName, String actionName)
	{
		String datasetPath = assistantPath + bot + "/datasets/" + name;
		// YAML formatting options
		DumperOptions options = new DumperOptions();
		options.setIndent(2);
		options.setPrettyFlow(true);
		options.setDefaultFlowStyle(FlowStyle.BLOCK);

		Yaml yaml = new Yaml(options);
		Map<String, Object> domainMap;
		try {
			domainMap = yaml.load(new FileReader(new File(datasetPath + "/bot/data/intentconfig.yml")));
		} catch (FileNotFoundException e) {
			logger.error(e.getMessage());
			return false;
		}
		HashMap<String, String> intent_responses = (HashMap<String, String>) domainMap.get("intent_responses");
		intent_responses.put(intentName, actionName);
		try (FileWriter fw = new FileWriter(new File(datasetPath + "/bot/data/intentconfig.yml"), false)) {
			yaml.dump(domainMap, fw);
		} catch (IOException e) {
			logger.error(e.getMessage());
			return false;
		}
		return true;
	}
	
	
	private boolean addtoAction(String bot, String name, String action)
	{
		
		
		action = action.substring(324);
		String datasetPath = assistantPath + bot + "/datasets/" + name +"/bot/actions.py";
		try {
			BufferedWriter output = new BufferedWriter(new FileWriter(datasetPath, true));
			output.write(action);
			output.close();
		} 
		catch (IOException e)
		{
			logger.error(e.getMessage());
			return false;
		}
		return true;
	}
	
	public String createDataset(String name, String bot) {
		if (!(name.endsWith("-V1"))) {
			name = name + "-V1";
		}
		String res = "New dataset created";
		String newDirectory = assistantPath + bot + "/datasets/" + name;
		File createDirectory = new File(newDirectory);

		// create a new directory with dataset name inside bot folder

		createDirectory.mkdir();
		File baseDir = new File( assistantPath + bot + "/default");

		// add initial data to the datasets (set of 6 intents)

		try {
			FileUtils.copyDirectory(baseDir, createDirectory);
			File file = new File(createDirectory + modelDirPath + "README.md");
			if(file.exists())
			{
				file.delete();
			}
			 
			//gitPush(bot,"Added a new dataset " + name);
			return res;
		} catch (IOException e) {
			e.printStackTrace();
			logger.error("Could not create a dataset : " + e.getMessage());
			return "Could not copy the the basic intents";
		}
	}

	public DatasetResponse getDataSets(String bot) {
		Map<String, List<Object>> versions = new TreeMap<>();
		DatasetResponse response = new DatasetResponse();
		File directory = new File(assistantPath + bot + "/datasets");

		// get all the datasets from the assistant folder

		String[] files = directory.list();
		System.out.print(files);
		if (files != null) {
			for (String name : files) {
				System.out.print(name);
				{
					List<Object> info = new ArrayList<>();
					if(!(name.equals("draft")))
					{
						String fileName = assistantPath + bot + "/datasets/" + name;
						int noOfLines = 0;
						// read the nluFile from the dataset to fetch the number of records (lines)

						try {
							List<String> allLines = Files.readAllLines(Paths.get(fileName + nluFilePath));
							logger.debug(fileName + nluFilePath);
							noOfLines = allLines.size();
						} catch (IOException e) {
							logger.error("Could not read the file :" + e.getMessage());
							e.printStackTrace();
						}

						// add the dataset name as key and number of records as value

						// info is a list of values so that, other info such as last modified date could
						// be added

						info.add(noOfLines);
						versions.put(name, info);
					}
				}
				}
		}
		response.setResponse(versions);
		return response;
	}

	@Override
	public Map<String, List<String>> getIntents(String bot, String dataset) {
		if ((!(bot.isEmpty()) || bot != null) && (!(dataset.isEmpty()) || dataset != null)) {
			List<String> utteranceList = new ArrayList<>();
			String currentKey = null;
			String file = null;
			File isExists = new File(assistantPath + bot + "/datasets/" + dataset);
			if (isExists.exists()) {
				file = assistantPath + bot + "/datasets/" + dataset + "/" + nluFilePath;

			} else {

				file = assistantPath + bot + "/backup/" + dataset + "/" + nluFilePath;
			}

			File mdFile = new File(file).getAbsoluteFile();
			// clear all the intents from this global variable to add a new list of intents

			intents.clear();

			// read the nluFile

			try {
				Scanner myReader = new Scanner(mdFile);
				while (myReader.hasNextLine()) {
					String data = myReader.nextLine();

					// add the intents as keys and the utterances as a list of values in the map
					if (data.startsWith("##")) {
							String[] keys = data.split(":");
							currentKey = keys[1];
							utteranceList = new ArrayList<>();
							intents.put(currentKey, utteranceList);
						} 
//						else if(data.startsWith("## lookup") || data.startsWith("# lookup") || data.startsWith("## synonym") || 
//								data.startsWith("# synonym") || data.startsWith("## regex") || data.startsWith("# regex"))
//						{
//							System.out.println("Do nothing because they are not intents");
//							data = myReader.nextLine();
//						}
						else {
							if (intents.containsKey(currentKey))
							{
								utteranceList = intents.get(currentKey);
								if (data.isEmpty()) {
									continue;
								} else {
									if(data.startsWith("-"))
									{
										String[] utterances = data.split("- ");
										utteranceList.add(utterances[1]);
										intents.put(currentKey, utteranceList);
									}
									
								}
							}

						}
					
				}
				myReader.close();
			} catch (FileNotFoundException e) {
				e.printStackTrace();
				logger.error("File not found to read the intents : " + e.getMessage());
			}
		}

		return intents;
	}

	public List<String> getUtterances(String intent) {
		return intents.get(intent);
	}
	@Override

	public String evaluateModel(String bot, String dataset, String modelName) {
		
		System.out.println(modelName);
		System.out.println(dataset);
		System.out.println(bot);
		String res = "Reports already present";
		if(new File(assistantPath + bot + "/datasets/" + dataset + reportstDirPath + modelName + "/"+ "intent_report.json").exists())
		{
		  return res;
		}
		
		else
		{
			File intent_data = new File(assistantPath + bot + "/datasets/" + dataset + reportstDirPath + modelName+ "/intent_report.json");
			File entity_data = new File(assistantPath + bot + "/datasets/" + dataset + reportstDirPath + modelName + "/CRFEntityExtractor_report.json");
//	        try {

		        try {
					entity_data.createNewFile();
					intent_data.createNewFile();
				} catch (IOException e2) {
					// TODO Auto-generated catch block
					e2.printStackTrace();
				}
		     
//			    File originalintent = new File(assistantPath + bot + "/datasets/" + dataset + "/bot/results/intent_report.json");
//			    File originalEntity = new File(assistantPath + bot + "/datasets/" + dataset + "/bot/results/CRFEntityExtractor_report.json");
//			    FileUtils.copyFile(originalintent, intent_data);
//			    FileUtils.copyFile(originalEntity, entity_data);
			    res = "Reports created";
				// TODO Auto-generated catch block
//				e2.printStackTrace();
//			}
			
			Path path = Paths.get(assistantPath + bot + "/datasets/" + dataset + nluFilePath);
			String body = null;
			try {
				body = Files.readString(path, StandardCharsets.ISO_8859_1);
				System.out.println(body);
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			RestTemplate restTemplate = new RestTemplate();
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_XML);
			HttpEntity<String> entity = new HttpEntity<>(body, headers);
			String url = "http://localhost:5005/model/test/intents";
//			String url = "http://"+sandboxNLP+"/model/test/intents?model="+assistantPath + bot + "/datasets/" + dataset+ modelDirPath +modelName;
			try {
				String response = restTemplate.postForObject(url, entity, String.class);
				FileWriter i_data = new FileWriter(intent_data);
				FileWriter e_data = new FileWriter(entity_data);
		        JSONParser parser = new JSONParser();
		        Object obj = parser.parse(response);
				JSONObject json = (JSONObject) obj;
				String e_object = json.get("entity_evaluation").toString();
				Object extracter_obj = parser.parse(e_object);
				JSONObject ext_obj = (JSONObject) extracter_obj;
				e_object = ext_obj.get("CRFEntityExtractor").toString();
				System.out.println(json.get("intent_evaluation").toString());
				System.out.println(e_object);
				i_data.write(json.get("intent_evaluation").toString());
		        e_data.write(e_object);
				i_data.flush();
				i_data.close();
				e_data.flush();
				e_data.close();
		        return res;
			} catch (Exception e)
			{
				res = "Couldn't create reports";
				logger.error("Exception: " + e.getMessage());
				e.printStackTrace();
				return res;
			}
		}
		
	}

	public ArrayList<String> confmatInts(String bot, String dataset, String modelName) throws IOException {
		Map<String, Integer> values = new HashMap<String, Integer>();
		try {
			JSONParser parser = new JSONParser();
			Object obj = parser.parse(new FileReader(assistantPath + bot + "/datasets/" + dataset + reportstDirPath + modelName + "/"+ "intent_report.json"));
			JSONObject i_eval_reports = (JSONObject) obj;
			Object reports = i_eval_reports.get("report");
			String result = reports.toString();
			String lines[] = result.split("\\n|\\n\\n");
			for (int i = 1; i < lines.length; i++) {
				if (!lines[i].isBlank()) {
					int j = 0;
					while (lines[i].charAt(j) == ' ') {
						j++;
					}
					char c = lines[i].charAt(j);
					j = 0;
					lines[i] = lines[i].substring(lines[i].indexOf(c));
					String intent = lines[i].split(" ")[0];
					String sup = lines[i].substring(lines[i].lastIndexOf(" "));
					values.put(intent, Integer.parseInt(sup.trim()));
				}
			}
		}catch(Exception e)
		{
			System.out.println(e.getMessage());
		}
			values.remove("micro");
			values.remove("macro");
			values.remove("weighted");
			values.remove("accuracy");
			ArrayList<String> intent = new ArrayList<>();
			 for(String key : values.keySet())
			 {
				 intent.add(key);
			 }
		return intent;

	}

	public Object[][] getConfmat(String bot, String dataset, String modelName)
	{
		
		System.out.println("Get confmat");
		Map<String, Integer> values = new HashMap<String, Integer>();

		Map<String, Map<String, Integer>> confused_with = new HashMap<>();
		try {
			JSONParser parser = new JSONParser();
			Object obj = parser.parse(new FileReader(assistantPath + bot + "/datasets/" + dataset + reportstDirPath + modelName + "/"+ "intent_report.json"));
			JSONObject i_eval_reports = (JSONObject) obj;
			Object reports = i_eval_reports.get("report");
			String result = reports.toString();
			String lines[] = result.split("\\n|\\n\\n");
			for (int i = 1; i < lines.length; i++) {
				if (!lines[i].isBlank()) {
					int j = 0;
					while (lines[i].charAt(j) == ' ') {
						j++;
					}
					char c = lines[i].charAt(j);
					j = 0;
					lines[i] = lines[i].substring(lines[i].indexOf(c));
					String intent = lines[i].split(" ")[0];
					String sup = lines[i].substring(lines[i].lastIndexOf(" "));

					values.put(intent, Integer.parseInt(sup.trim()));
				}
			}
			values.remove("micro");
			values.remove("macro");
			values.remove("weighted");
			values.remove("accuracy");
			
			Object confmat = i_eval_reports.get("predictions");
			ArrayList<Map<String, String>> confusion_matrix = (ArrayList<Map<String, String>>) confmat;
			for (int i = 0; i < confusion_matrix.size(); i++) {
				Map<String, String> confusions = confusion_matrix.get(i);
				String intent = confusions.get("intent");
				if (confused_with.containsKey(intent)) {
					Map<String, Integer> confused_intents = confused_with.get(intent);
					String prediction = confusions.get("predicted");

					if (!intent.equals(prediction)) {
						if (confused_intents.containsKey(prediction)) {
							int value = confused_intents.get(prediction);
							value = value++;
							confused_intents.put(prediction, value);
						} else {
							confused_intents.put(prediction, 1);
						}
					}

				} else {
					Map<String, Integer> confused_intents = new HashMap<>();
					String prediction = confusions.get("predicted");
					if (!intent.equals(prediction)) {
						confused_intents.put(prediction, 1);
					}
					if(values.containsKey(intent))
					{
						int val = values.get(intent);
						confused_intents.put("support", val);
						confused_with.put(intent, confused_intents);
					}
					
				}
			}
			System.out.println(confused_with);
		} 
		catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	 Object[][] arr = getMatrix(confused_with);
	 return arr;
		
	}
	
	public Object[][] getMatrix(Map<String, Map<String, Integer>> obj)
	{
		
		System.out.println("Get matrix");
		 ArrayList<String> intent = new ArrayList<>();
		 for(String key : obj.keySet())
		 {
			 intent.add(key);
		 }
			Object[][] arr = new Object[intent.size()][intent.size()];
			for (int i = 0; i < arr.length; i++) {
				for (int j = 0; j < arr[i].length; j++) {
					arr[i][j] = 0;
				}
			}
		
			for (int i = 0; i < intent.size(); i++) {
//			Object obj = new Object();
				Map<String, Integer> map = obj.get(intent.get(i));
//			Object intentObject = ((JSONObject) obj).get(intent.get(i));
				Integer correct = map.get("support");
				arr[i][i] = correct;
				if (map == null || map.isEmpty()) {
					System.out.println("empty");
				} else {
					for (String key : map.keySet()) {
						if (!key.equals("support")) {
							System.out.println(key);
							if (intent.contains(key)) {
								int col = intent.indexOf(key);
								arr[i][col] = map.get(key);
							}
						}

					}
				}
			}
		System.out.println(arr);
		for(int i = 0; i<arr.length;i++)
		{
			for(int j = 0; j<arr[i].length;j++)
			{
				System.out.println(arr[i][j]);
			}
		}
		return arr;

	}

	public Map<String, Map<String, Float>> getReports(String bot, String dataset, String modelName) {
		Map<String, Map<String, Float>> reports = new HashMap<>();
		Map<String, Float> intentReports = new HashMap<>();
		Map<String, Float> entityReports = new HashMap<>();
		String intentJsonFile = assistantPath + bot + "/datasets/" + dataset + reportstDirPath + modelName + "/"+ "intent_report.json";
		System.out.println(intentJsonFile);
		File json = new File(intentJsonFile);
		if (json.exists()) {
			// intent reports object
			JSONParser parser = new JSONParser();
			try {
				Object obj = parser.parse(new FileReader(assistantPath + bot + "/datasets/" + dataset + reportstDirPath + modelName + "/"+ "intent_report.json"));
				JSONObject i_eval_reports = (JSONObject) obj;
				System.out.println(i_eval_reports);
				System.out.println(i_eval_reports.get("precision"));
				System.out.println(i_eval_reports.get("f1_score"));
				Float intAvgpre = Float.parseFloat(i_eval_reports.get("precision").toString());
				Float intAvgrecall = Float.parseFloat(i_eval_reports.get("f1_score").toString());
				Float intAvgf1 = Float.parseFloat(i_eval_reports.get("accuracy").toString());
				intentReports.put("precision", intAvgpre);
				intentReports.put("recall", intAvgrecall);
				intentReports.put("f1Score", intAvgf1);
				reports.put("IntentClassification", intentReports);
			} catch (FileNotFoundException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (ParseException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			File f = new File(assistantPath + bot + "/datasets/" + dataset + reportstDirPath + modelName + "/"
					+ "CRFEntityExtractor_report.json");
			if (f.exists()) {
				try {
					Object obj1 = parser.parse(new FileReader(assistantPath + bot + "/datasets/" + dataset + reportstDirPath + modelName + "/"+ "CRFEntityExtractor_report.json"));
					JSONObject json2 = (JSONObject) obj1;
					JSONObject e_eval_reports = (JSONObject) parser.parse(json2.toString());

					Float avgpre = Float.parseFloat(e_eval_reports.get("precision").toString());
					Float avgrecall = Float.parseFloat(e_eval_reports.get("f1_score").toString());
					Float avgf1 = Float.parseFloat(e_eval_reports.get("accuracy").toString());
					entityReports.put("precision", avgpre);
					entityReports.put("recall", avgrecall);
					entityReports.put("f1Score", avgf1);

				} catch (FileNotFoundException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (ParseException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		
				reports.put("EntityClassification", entityReports);

			}
			return reports;
		} else {
			return reports;
		}

	}

	public Map<String, List<String>> getModels(String bot) {
		System.out.println(bot);
		Map<String, List<String>> modelMap = new HashMap<>();
		if (!(bot.isEmpty()) || bot != null) {

			String directoryPath = assistantPath + bot + "/datasets/";
			System.out.println(directoryPath);
			logger.debug("Bot path to fetch models : " + directoryPath);
			File directory = new File(directoryPath);
			if(directory.exists())
			{
				File[] files = directory.listFiles();
				if (files != null || files.length != 0) {
					for (File name : files) {
					List<String> modelList = new ArrayList<>();
					File datasetPath = new File(directoryPath + "/" + name.getName() + modelDirPath);
					if(datasetPath.exists())
					{
						File[] models = datasetPath.listFiles();
						Arrays.sort(models, Comparator.comparingLong(File::lastModified));
						for (File model : models)
						{
							if(model.getName().startsWith("README.md"))
							{
								File file = new File(datasetPath + model.getName());
								file.delete();  
							}
							modelList.add(model.getName());
						}
						modelMap.put(name.getName(), modelList);
						}
					}
					
				}
			}
		}
		return modelMap;
	}

	public Map<String, Map<Double, Integer>> getHistogram(String bot, String dataset, String modelName) {
		Map<Double, Integer> hits = new TreeMap<>();
		hits.put(0.05, 0);
		hits.put(0.10, 0);
		hits.put(0.20, 0);
		hits.put(0.25, 0);
		hits.put(0.30, 0);
		hits.put(0.35, 0);
		hits.put(0.40, 0);
		hits.put(0.45, 0);
		hits.put(0.50, 0);
		hits.put(0.55, 0);
		hits.put(0.60, 0);
		hits.put(0.65, 0);
		hits.put(0.70, 0);
		hits.put(0.75, 0);
		hits.put(0.80, 0);
		hits.put(0.85, 0);
		hits.put(0.90, 0);
		hits.put(0.95, 0);
		hits.put(1.00, 0);
		Map<Double, Integer> misses = new TreeMap<>(hits);

		List<String> item;
		List<String> items;
		Map<String, Map<Double, Integer>> histogram = new HashMap<>();
		String histValues = parseFile(assistantPath + bot + "/datasets/" + dataset + reportstDirPath + modelName + "/" + "histo.txt");
		String[] val = histValues.split("]");

		// get the list of hits and list of misses separately.

		String hit = val[0].substring(1);
		String miss = val[1].substring(2);

		// if hits list is empty then use the default values i.e 0.00 for hits

		if (hit.isEmpty()) {
			items = Arrays.asList(miss.split("\\s*,\\s*"));
			for (int i = 0; i < items.size(); i++) {
				Double dob = Double.valueOf(items.get(i));
				dob = (double) Math.round(dob * 100) / 100;
				if (misses.containsKey(dob)) {
					int count = misses.get(dob);
					misses.replace(dob, count + 1);
				} else {
					misses.put(dob, 1);
				}
			}

			// if misses list is empty then use the default values i.e 0.00 for misses

		} else if (miss.isEmpty()) {
			item = Arrays.asList(hit.split("\\s*,\\s*"));
			for (int i = 0; i < item.size(); i++) {
				String str = item.get(i).substring(0, 4);
				Double dob = Double.valueOf(str);
				if (hits.containsKey(dob)) {
					int count = hits.get(dob);
					hits.replace(dob, count + 1);
				} else {
					hits.put(dob, 1);
				}
			}

			// if both are not empty, then read the values one by one and convert them to
			// double type.

		} else {
			item = Arrays.asList(hit.split("\\s*,\\s*"));
			for (int i = 0; i < item.size(); i++) {
				Double dob = Double.valueOf(item.get(i));
				dob = (double) Math.round(dob * 100) / 100;
				if (hits.containsKey(dob)) {
					int count = hits.get(dob);
					hits.replace(dob, count + 1);
				} else {
					hits.put(dob, 1);
				}
			}
			items = Arrays.asList(miss.split("\\s*,\\s*"));
			for (int i = 0; i < items.size(); i++) {
				Double dob = Double.valueOf(items.get(i));
				dob = (double) Math.round(dob * 100) / 100;
				if (misses.containsKey(dob)) {
					int count = misses.get(dob);
					misses.replace(dob, count + 1);
				} else {
					misses.put(dob, 1);
				}
			}
		}

		// add both the lists to a map

		histogram.put("hits", hits);
		histogram.put("misses", misses);
		return histogram;

	}

	public String train(String bot, String dataset) throws IOException {
		boolean check = checkActionFile(bot, dataset);
		String model = "";

		if(check)
		{
			model = dataset + "M_";

		}
		else
		{
			model = dataset + "Mnlu_";
		}
		
		String verNumber = null;
		ArrayList<Integer> versions = new ArrayList<>();
		String directoryPath = assistantPath + bot + "/datasets/" + dataset + modelDirPath;
		logger.debug(directoryPath);
		File directory = new File(directoryPath);
		String[] files = directory.list();
		// check if the array is empty
		if (files.length == 0) {
			verNumber = "1";
		} else
		// get all the models from a particular dataset

		{
			for (String name : files) {

				// remove the extension to get only name

				String removeGzExt = FilenameUtils.removeExtension(name);
				String removeTarExt = FilenameUtils.removeExtension(removeGzExt);
				String[] version = removeTarExt.split("_");
				versions.add(Integer.parseInt(version[1]));
			}

			// sort the model names to get the latest model
			int ver = 0;
			Collections.sort(versions);
			// Take the version number from the latest modelName
			ver = (versions.get(versions.size() - 1)) + 1;
			verNumber = Integer.toString(ver);
		}
		
//   check if he lookup table data has changed
//   execute the python script here
		
//		train api
		URL url = new URL("http://"+sandboxNLP+"/model/train");
		logger.debug(url.toString());
		logger.debug(sandboxNLP);
		
		HttpURLConnection con = (HttpURLConnection) url.openConnection();
		con.setRequestMethod("POST");
		con.setRequestProperty("Content-Type", "application/json; utf-8");
		con.setRequestProperty("Accept", "application/gzip");
		con.setDoOutput(true);
		Map<String, String> varMap = new HashMap<>();
		System.out.println(assistantPath + bot + "/datasets/" + dataset + domainFilePath);
		System.out.println(assistantPath + bot + "/datasets/" + dataset + nluFilePath);
		varMap.put("domain", parseFile(assistantPath + bot + "/datasets/" + dataset + domainFilePath));
		varMap.put("config", parseFile(assistantPath + bot + "/datasets/" + dataset + configFilePath));
		varMap.put("nlu", parseFile(assistantPath + bot + "/datasets/" + dataset + nluFilePath));
		varMap.put("stories", parseFile(assistantPath + bot + "/datasets/" + dataset + storyFilePath));
		varMap.put("responses", parseFile(assistantPath + bot + "/datasets/" + dataset + domainFilePath));
		varMap.put("force", "true");
		Gson gson = new GsonBuilder().create();
		String jsonString = gson.toJson(varMap);
		try (OutputStream os = con.getOutputStream()) {
			byte[] input = jsonString.getBytes("utf-8");
			os.write(input, 0, input.length);
		}
		logger.debug("Response code", con.getResponseCode());
		if (con.getResponseCode() == 200)
		{
		try {
			GZIPOutputStream os = new GZIPOutputStream(
					new FileOutputStream(directoryPath + model + verNumber + ".tar.gz"));
			GZIPInputStream gzis = new GZIPInputStream(con.getInputStream());
			byte[] buffer = new byte[1024];
			int len = 0;
			try {
				while ((len = gzis.read(buffer)) > 0) {
					os.write(buffer, 0, len);
				}
			} finally {

				os.close();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
			File reports = new File(assistantPath + bot + "/datasets/" + dataset + reportstDirPath + model + verNumber + ".tar.gz");
			reports.mkdir();
			File dir = new File(directoryPath);
			for ( File file : dir.listFiles()) {
			    if (file.isFile() && file.getName().startsWith("20"))
			    {
			        file.delete();
			    }
			}
			return "Training successful";
		}
		else
		{
			return "Could not create a training model. Dataset error";
		}
	}

	public String loadModel(String bot, String dataset, String modelName, String env) throws IOException {
		    // check if the action file is modified
//		    boolean check = checkActionFile(bot, dataset);
		    if(modelName.contains("Mnlu"))
		    {
		    	System.out.println("Loading the model");
			    //String service = editEndpointsFile(bot, dataset, env);
//			    String service = sandboxNLP;
			    String res = "Couldn't load model. RASA Error!";
				String url = null;
				RestTemplate restTemplate = new RestTemplate();
				Map<String, Object> request = new HashMap<>();
				String model = assistantPath + bot + "/datasets/" + dataset + modelDirPath + modelName;
				request.put("model_file", model);
				Map<String, String> remoteStorage = new HashMap<>();
				remoteStorage.put("url", "http://localhost:4000/get/model/remotestorage?assistant=" + bot + "&dataset=" + dataset
						+ "&modelName=" + modelName);
				
				request.put("model_file", model);
				request.put("model_server", remoteStorage);
				HttpHeaders headers = new HttpHeaders();
				headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
				HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
				if (env.equals("sandbox"))
				{
					url = "http://"+sandboxNLP+"/model";
				}
				else if(env.equals("ThorChiring"))
				{
					System.out.println("Publishing to campus hiring");
					System.out.println(chiringNLP);
					url = "http://"+chiringNLP+"/model";
//					savePublished(bot, modelName);
				}
				else if(env.equals("ThorTarento"))
				{
					System.out.println("Publishing to tarento website");
					System.out.println(websiteNLP);
					url = "http://"+websiteNLP+"/model";
//					savePublished(bot, modelName);
				}
				else if(env.equals("ThorKronos"))
				{
					System.out.println("Publishing to kronos");
					System.out.println(websiteNLP);
					url = "http://"+kronosNLP+"/model";
//					savePublished(bot, modelName);
				}
				else if(env.equals("ThorLeadership"))
				{
					System.out.println("Publishing to leadership");
					System.out.println(websiteNLP);
					url = "http://"+leadershipNLP+"/model";
//					savePublished(bot, modelName);
				}
				else
				{
					System.out.println("Publishing to the igotNLP");
					System.out.println(igotNLP);
					url = "http://"+igotNLP+"/model";
//					savePublished(bot, modelName);
				}
				try {
					restTemplate.put(url, entity, String.class);
					res = "Model loaded successfully";
					return res;
				} catch (Exception e) {
					res = "Couldn't load model. RASA Error!";
					e.printStackTrace();
					return res;
				}
		    }
		    else
		    {
		    	//replaceModelPOD
		    	return "Successful";
		    }
		    
	}

	
public boolean checkActionFile(String bot, String dataset)
{
	boolean flag = false;
    Path file = Paths.get(assistantPath + bot + "/datasets/"+ dataset+ "/bot/actions.py");
    BasicFileAttributes attr;
	try {
		attr = Files.readAttributes(file, BasicFileAttributes.class);
	    String lm = attr.lastModifiedTime().toString().substring(0,10);
	    String today =   java.time.LocalDate.now().toString();  
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
	    Date firstDate = sdf.parse(lm);
	    Date secondDate = sdf.parse(today);
	    long diffInMillies = Math.abs(secondDate.getTime() - firstDate.getTime());
	    long diff = TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS);
	    if(diff < 2)
	    {
	    	flag = true;
	    }
	    else
	    {
	    	flag = false;
	    }
	    
	    
	} catch (IOException | java.text.ParseException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
   return flag;
}

public ResponseEntity<InputStreamResource> getModelFromRemoteStorage(String bot, String dataset, String modelName)
		throws IOException {
	System.out.println("inside model storage");
	String modelPath = assistantPath + bot + "/datasets/" + dataset + modelDirPath + modelName;
	System.out.println(modelPath);
	logger.debug("Path to fecth the model : " +modelPath);
	File file2Upload = new File(modelPath);
	HttpHeaders headers = new HttpHeaders();
	headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
	headers.add("Pragma", "no-cache");
	headers.add("Expires", "0");
	InputStreamResource resource = new InputStreamResource(new FileInputStream(file2Upload));
	return ResponseEntity.ok().headers(headers).contentLength(file2Upload.length())
			.contentType(org.springframework.http.MediaType.APPLICATION_OCTET_STREAM).body(resource);
}

	public String editEndpointsFile(String bot, String dataset, String env)
	{
		String service = sandboxNLP;
			ObjectMapper objectMapper = new YAMLMapper();
			Map<String, Object> user = null;
			try {
				user = objectMapper.readValue(new File(assistantPath +"/datasets/"+bot+ "/"+dataset+ "/bot/endpoints.yml"),
				        new TypeReference<Map<String, Object>>() { });
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
		// modify the endpoint
		Map<String, Object> endpoint = (Map<String, Object>) user.get("action_endpoint");
		if(env.equals("sandbox"))
		{
		endpoint.put("url", "http://thor-action-sandbox-service/webhook");
		try {
			objectMapper.writeValue(new File(assistantPath +"/datasets/"+bot+ "/"+dataset+ "/bot/endpoints.yml"), user);
		} catch (JsonGenerationException e) {
		
			e.printStackTrace();
		} catch (JsonMappingException e) {
		
			e.printStackTrace();
		} catch (IOException e) {
		
			e.printStackTrace();
		}
		}
		else if(env.equals("ThorChiring"))
		{
			endpoint.put("url", "http://thor-campus-hiring-action-service/webhook");
			try {
				objectMapper.writeValue(new File(assistantPath +"/datasets/"+bot+ "/"+dataset+ "/bot/endpoints.yml"), user);
			} catch (JsonGenerationException e) {
			
				e.printStackTrace();
			} catch (JsonMappingException e) {
			
				e.printStackTrace();
			} catch (IOException e) {
			
				e.printStackTrace();
			}
			service = igotNLP;
		}
		return service;
	}
	
	public String deployModel(String bot, String dataset, String modelName, String env) {
		String res = "Model loaded sucessfully.";
		String url = null;
		RestTemplate restTemplate = new RestTemplate();
		Map<String, Object> request = new HashMap<>();
		String model = assistantPath + bot + "/datasets/" + dataset + modelDirPath + modelName;
		request.put("model_file", model);
		Map<String, String> remoteStorage = new HashMap<>();
		remoteStorage.put("url", "http://localhost:4000/getmodelRemotestorage?bot=" + bot + "&dataset=" + dataset
				+ "&modelName=" + modelName);
		request.put("model_file", model);
		request.put("model_server", remoteStorage);
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
		HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
		if (env.equals("production")) {

			url = "http://localhost:5005/model";
		} else {
			url = "http://localhost:6000/model";
		}
		try {
			restTemplate.put(url, entity, String.class);

		} catch (Exception e) {

			res = "Couldn't load the Model.";
			logger.error("Exceptionnnnn: ");
			e.printStackTrace();
		}
		System.out.println("done");

		return res;
	}

	public String createAssistant(String bot) {
		String res = "New bot created";
		createBranch(bot);
		File f1 = new File(assistantPath + bot +"/datasets/README");
		File f2 = new File(assistantPath + bot +"/backup/README");
		f1.delete();
		f2.delete();
//		String newDirectory = botsPath + bot;
//		String newBackupDir = backupDataPath + bot;
//		try {
//			if (bot != null) {
//				String index = "thor_" + bot.toLowerCase();
//				res = createIndexatES(index);
//				if (res == "New bot created") {
//					res = storeToDB(bot, index, newDirectory);
//				}
//			}
//			logger.debug("Try block executed successfully");
//			return res;
//		} catch (Exception e) {
//			logger.error("Empty string :" + bot);
//			return res;
//		}
      return res;
	}

	private String storeToDB(String bot, String index, String newDirectory) {
		try {

			AssistantInfo botInfo = new AssistantInfo(bot, null, null, null, null, null, newDirectory, index, null);
			botInfo.setDomain(bot);
			botInfo.setPath(newDirectory);
			botInfo.setIndexName(index);
			botRepo.save(botInfo);
			return "New bot created";
		} catch (Exception e) {
			logger.error("Error in storing data to db : " + e.getMessage());
			return "Index created. Error in storing data to db";
		}

	}

	private String createDirectories(String newDirectory, String newBackupDir) {

		try {
			File createDirectory = new File(newDirectory);
			File createBackupDir = new File(newBackupDir);
			createDirectory.mkdir();
			createBackupDir.mkdir();
			return "New bot created";
		} catch (Exception e) {
			logger.error("Error in creating a bot/backup directory : " + e.getMessage());
			return "Error in creating a bot/backup directory";
		}
	}

	public List<String> getAssistants() {
		List<String> bots = new ArrayList<>();
		File directoryPath = new File(assistantPath);
		System.out.println(assistantPath);
		logger.debug("Base bot path " + assistantPath);
		System.out.println(directoryPath.exists());
		if (directoryPath.exists()) {
			File[] filesList = directoryPath.listFiles();
			try {
				if (filesList.length != 0 || filesList != null) {
					for (File file : filesList) {
						bots.add(file.getName());
					}
				}

			} catch (Exception e) {
				logger.error("Empty list. No bots available : " + e.getMessage());
				return bots;
			}
		} else {
			File[] filesList = directoryPath.listFiles();
			for (File file : filesList) {
				bots.add(file.getName());
			}
		}
		return bots;
	}

	// Creates Index in elastic search with the name of the bot

	public String createIndexatES(String index) {
		Map<String, Map<String, String>> properties = new HashMap<>();
		Map<String, String> type = new HashMap<>();
		type.put("type", "text");
		Map<String, Map<String, Map<String, String>>> mapping = new HashMap<>();
		mapping.put("properties", properties);

		// credentials to create an index
		IndexRequest request = new IndexRequest(index, "_doc");
		request.source(mapping);
		try {
			client.index(request);
			return "New bot created";

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Error in creating a index : " + e.getMessage());
			return "Error in creating an index";
		}
	}

	public String parseFile(String filePath) {
		StringBuilder contentBuilder = new StringBuilder();

		try (Stream<String> stream = Files.lines(Paths.get(filePath), StandardCharsets.UTF_8)) {
			stream.forEach(s -> contentBuilder.append(s).append("\n"));
		} catch (IOException e) {
			e.printStackTrace();
		}

		return contentBuilder.toString();
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object> getIntentResponse(String bot, String dataset, String intent) {
		Map<String, Object> intentResponses = new HashMap<>();
		DumperOptions options = new DumperOptions();
		options.setIndent(2);
		options.setPrettyFlow(true);
		options.setDefaultFlowStyle(FlowStyle.BLOCK);

		Yaml yaml = new Yaml(options);
		Map<String, Object> domainMap = null;
		File isExists = new File(assistantPath + bot + "/datasets/" + dataset + "/" + domainFilePath);
		if (isExists.exists()) {
			System.out.println("Exists");
			try {
				domainMap = yaml.load(new FileReader(new File(assistantPath + bot + "/datasets/" + dataset + "/" + domainFilePath)));
			} catch (FileNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		} else {
			try {
				domainMap = yaml
						.load(new FileReader(new File(assistantPath + bot + "/backup/" + dataset + "/" + domainFilePath)));
				logger.debug(
						"Path to fetch the responses : " + assistantPath + bot + "/datasets/" + dataset + "/" + domainFilePath);
			} catch (FileNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		try {
			System.out.println(domainMap);
			LinkedHashMap<String, ArrayList<ArrayList<Object>>> responses = (LinkedHashMap<String, ArrayList<ArrayList<Object>>>) domainMap
					.get("responses");
			ArrayList<Object> resObj = new ArrayList<>(responses.values());
			for (int i = 0; i < resObj.size(); i++) {
				Object result = resObj.get(i);
				ObjectMapper objectMapper = new ObjectMapper();
				String json = objectMapper.writeValueAsString(result);
				String res = json.substring(1, json.length() - 1);
				JSONParser parser = new JSONParser();
				JSONObject jsonObject = (JSONObject) parser.parse(res);
				System.out.println(jsonObject);
				String intObj = JsonPath.read(jsonObject, "$.custom.blocks[0].intent");
				Object response = JsonPath.read(jsonObject, "$.custom.blocks[0].text");
				intentResponses.put(intObj, response);
			}
		} catch (JsonProcessingException | ParseException e) {
			logger.error(e.getMessage());
		}
		return intentResponses;
	}

	@SuppressWarnings("unchecked")
	public String modifyResponse(String bot, String name, Map<String, List<String>> modifiedResponses) {
		System.out.println("Hiiiii");
//		if(intentCount == 0 && synonymCount == 0 && regexCount == 0 && lookupCount == 0 )
//		{
//			try {
//				takeFileBackup(bot, name);
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//		}
		
		String draftDataset = assistantPath + bot + "/datasets/" + "draft";
		if(new File(draftDataset).exists())
		{
			
			System.out.println("inside if");
			name = "draft";
		}
		else
		{
			System.out.println("inside else");
			//create a draft version of the dataset
			String newDirectory = assistantPath + bot + "/datasets/" + "draft";
			File createDirectory = new File(newDirectory);
			createDirectory.mkdir();
			File baseDir = new File(assistantPath + bot + "/datasets/" + name);
			try {
				FileUtils.copyDirectory(baseDir, createDirectory);
			}catch(Exception e)
			{
				e.printStackTrace();
			}
		    name = "draft";
		}
		String datasetPath = assistantPath + bot + "/datasets/" + name;
		for (Map.Entry<String, List<String>> entry : modifiedResponses.entrySet()) {
			System.out.println(entry.getKey() + " : " + entry.getValue());
			// YAML formatting options
			DumperOptions options = new DumperOptions();
			options.setIndent(2);
			options.setPrettyFlow(true);
			options.setDefaultFlowStyle(FlowStyle.BLOCK);

			Yaml yaml = new Yaml(options);
			Map<String, Object> domainMap = null;
			try {
				domainMap = yaml.load(new FileReader(new File(datasetPath + domainFilePath)));
			} catch (FileNotFoundException e) {
				logger.error(e.getMessage());
				return "File not found";
			}
			// fetch all the responses
			LinkedHashMap<String, ArrayList<Object>> responses = (LinkedHashMap<String, ArrayList<Object>>) domainMap
					.get("responses");
			// create a new response body and put it with the actionName as key
			String actionName = "utter_" + entry.getKey();
			ArrayList<Object> responseObj = createDomainResponseObject(entry.getValue(), entry.getKey());
			responses.put(actionName, responseObj);
			// modify the file
			try (FileWriter fw = new FileWriter(new File(datasetPath + domainFilePath), false)) {
				yaml.dump(domainMap, fw);
			} catch (IOException e) {
				logger.error(e.getMessage());
				return "Couldn't save response";
			}
		}
		return "Response saved successfully";
	}
	public Map<String, String> getPublishedModels(String bot) {
//		String models = botRepo.getOne(bot).getPublishedModels();
		Map<String, String> p_models = new HashMap<>();
//		if (models == null) {
//			return p_models;
//		} else {
//
//			String[] published = models.split(",");
//			for (int i = 0; i < published.length; i++) {
//				String publishedModels[] = published[i].split("\\(");
//				p_models.put(publishedModels[0], publishedModels[1].substring(0, publishedModels[1].length() - 1));
//			}
			return p_models;
		}
	
	
	
//	}

	public DatasetResponse getDatasetVersions(String bot, String dataset) {
		System.out.println(dataset);
		Map<String, List<Object>> versions = new TreeMap<>();
		DatasetResponse response = new DatasetResponse();
		File directory = new File(assistantPath + bot + "/backup/");
		String[] removeVersions = dataset.split("-");

		// get all the datasets from a bot folder

		String[] files = directory.list();
		if (files != null)
		{
			for (String name : files)
			{
				if (name.startsWith(removeVersions[0]))
				{
					File file = new File(assistantPath + bot + "/backup/" + name);
					SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy");
					List<Object> info = new ArrayList<>();
					info.add(sdf.format(file.lastModified()));
					versions.put(name, info);
				}
			}
		}	
		if(new File(assistantPath + bot + "/datasets/" + "draft").exists())
		{
			File file = new File(assistantPath + bot + "/datasets/" + "draft");
			SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy");
			List<Object> info = new ArrayList<>();
			info.add(sdf.format(file.lastModified()));
			versions.put("draft", info);
		}
		response.setResponse(versions);
		return response;
	}

	public String removeDataset(String bot, String dataset) {
		String directoryPath = assistantPath + bot + "/datasets/" + dataset;
		File file = new File(directoryPath);
		try {
			FileUtils.deleteDirectory(file);
		} catch (IOException e) {
			e.printStackTrace();
		}
		int version = Integer.parseInt(dataset.split("-V")[1]);
		System.out.println(version);
		ArrayList<Integer> versions = new ArrayList<>();
		File directory = new File(assistantPath + bot + "/backup/");
		File[] files = directory.listFiles();

		for (File name : files) {
			System.out.print(name.getName());
			if (name.getName().split("-V")[0].equals(dataset.split("-V")[0])) {
				versions.add(Integer.parseInt(name.getName().split("-V")[1]));
			}
		}
		System.out.println(versions);
		int min = Integer.MAX_VALUE;

		if (!versions.isEmpty() || versions != null) {
			for (int v : versions) {
				final int diff = Math.abs(v - version);

				if (diff < min) {
					min = diff;
					version = v;
				}
			}
			System.out.println(version);
			String restore = directory + "/" + dataset.split("-V")[0] + "-V" + version;
			System.out.println(restore);
			try {
				Files.move(Paths.get(restore),
						Paths.get(assistantPath + bot + "/datasets/" + dataset.split("-V")[0] + "-V" + version));
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}
		return "Successfully deleted dataset" + dataset;
	}

	public String removeIntent(String bot, String dataset, String intent) {
		try {
			takeFileBackup(bot, dataset);
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		String directoryPath = assistantPath + bot + "/datasets/" + dataset;
		// get the required intent and the utterances that are to be removed
		File nlu = new File(directoryPath + nluFilePath).getAbsoluteFile();
		File story = new File(directoryPath + storyFilePath).getAbsoluteFile();
		File domain = new File(directoryPath + domainFilePath).getAbsoluteFile();
		boolean stepsComplete = true;
		stepsComplete = removeFromNlu(nlu, directoryPath, intent);
		stepsComplete = stepsComplete && removeFromStory(story, directoryPath, intent);
		stepsComplete = stepsComplete && removeFromDomain(domain, intent);

		if (stepsComplete)
		{
			datasetVersioning(bot, dataset);
		} else
		{
			try
			{
				restoreFileBackup(bot, dataset);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return "Intent deleted successfully";
	}
	
	
	private boolean removeFromStory(File story, String directoryPath, String intent)
	{
		HashSet<String> hs = getStoryData(directoryPath, intent);
		System.out.println(hs);
		try
		// tmp file to save the data
		{
			File tmpFile = new File(directoryPath + "/" + "output.md");
			FileWriter writer = new FileWriter(tmpFile);
			Scanner myReader = new Scanner(story);
			while (myReader.hasNextLine()) {
				String data = myReader.nextLine();
				// if the line is not present in the set (set of lines that to be removed)
				if (!hs.contains(data)) {
					// add the line to the file
					writer.write(data);
					writer.write("\n");
				}
			}
			myReader.close();
			writer.close();
			// copy the contents from tmp file to the actual nlu file
			Files.copy(tmpFile.toPath(), story.toPath(), StandardCopyOption.REPLACE_EXISTING);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	private HashSet<String> getStoryData(String directoryPath, String intent) {
		File story = new File(directoryPath + storyFilePath).getAbsoluteFile();
		HashSet<String> hs = new HashSet<>();
		try {
			Scanner myReader = new Scanner(story);
			while (myReader.hasNextLine()) {
				String data = myReader.nextLine();
				// find the intent which is to be deleted
				if (data.startsWith("*") && data.endsWith(intent))
				{
					hs.add(data);
					data = myReader.nextLine();
					hs.add(data);
				}
			}
			myReader.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		return hs;
	}
	
	private boolean removeFromNlu(File nlu, String directoryPath, String intent) {
		HashSet<String> hs = getIntentData(directoryPath, intent);
		try
		// tmp file to save the data
		{
			File tmpFile = new File(directoryPath + "/" + "output.md");
			FileWriter writer = new FileWriter(tmpFile);
			Scanner myReader = new Scanner(nlu);
			while (myReader.hasNextLine()) {
				String data = myReader.nextLine();
				// if the line is not present in the set (set of lines that to be removed)
				if (!hs.contains(data)) {
					// add the line to the file
					writer.write(data);
					writer.write("\n");
				}
			}
			myReader.close();
			writer.close();
			// copy the contents from tmp file to the actual nlu file
			Files.copy(tmpFile.toPath(), nlu.toPath(), StandardCopyOption.REPLACE_EXISTING);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;

	}

	@SuppressWarnings("unchecked")
	private boolean removeFromDomain(File domain, String intent) {

		DumperOptions options = new DumperOptions();
		options.setIndent(2);
		options.setPrettyFlow(true);
		options.setDefaultFlowStyle(FlowStyle.BLOCK);

		Yaml yaml = new Yaml(options);
		Map<String, Object> domainMap;
		try {
			domainMap = yaml.load(new FileReader(domain));
		} catch (FileNotFoundException e) {
			logger.error(e.getMessage());
			return false;
		}
		String actionName = "utter_" + intent;

		// remove intent from domain
		ArrayList<String> intentList = (ArrayList<String>) domainMap.get("intents");
		intentList.remove(intent);

		// remove action from domain
		ArrayList<String> actions = (ArrayList<String>) domainMap.get("actions");
		actions.remove(actionName);
		// remove the response obj for that particular intent
		LinkedHashMap<String, ArrayList<Object>> responses = (LinkedHashMap<String, ArrayList<Object>>) domainMap
				.get("responses");
		responses.remove(actionName);

		try (FileWriter fw = new FileWriter(domain, false)) {
			yaml.dump(domainMap, fw);
		} catch (IOException e) {
			logger.error(e.getMessage());
			return false;
		}
		return true;

	}

	private HashSet<String> getIntentData(String directoryPath, String intent) {
		File nlu = new File(directoryPath + nluFilePath).getAbsoluteFile();

		HashSet<String> hs = new HashSet<>();
		try {
			Scanner myReader = new Scanner(nlu);
			while (myReader.hasNextLine()) {
				String data = myReader.nextLine();
				// find the intent which is to be deleted

				if (data.startsWith("##") && data.endsWith(intent)) {
					hs.add(data);
					data = myReader.nextLine();
					while (data.startsWith("-")) {
						hs.add(data);
						if (myReader.hasNext()) {
							data = myReader.nextLine();
						} else {
							break;
						}
					}
				}
			}
			myReader.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		return hs;
	}

	public String removeUtterance(String bot, String dataset, String utterance) {
		try {
			takeFileBackup(bot, dataset);
		} catch (IOException e1) {
			e1.printStackTrace();
		}

		String text = "- " + utterance;
		// Instantiating the File class
		String filePath = assistantPath + bot + "/datasets/" + dataset + nluFilePath;
		// Instantiating the Scanner class to read the file
		Scanner sc;
		StringBuilder buffer = new StringBuilder();
		try {
			sc = new Scanner(new File(filePath));
			while (sc.hasNextLine()) {
				buffer.append(sc.nextLine() + System.lineSeparator());
			}
			String fileContents = buffer.toString();
			// closing the Scanner object
			sc.close();
			// Replacing the old line with new line
			fileContents = fileContents.replaceAll(text, "");
			// instantiating the StringBuffer class
			// Reading lines of the file and appending them to StringBuffer
			FileWriter writer = new FileWriter(filePath);
			writer.append(fileContents);
			writer.close();
			// instantiating the FileWriter class

		} catch (IOException e) {
			e.printStackTrace();
		}
		datasetVersioning(bot, dataset);
		return "Successfull";
	}

	@Override
	public String saveDraftData(String intent, String utterances, String domain, String type, String dataset) {
		List<DraftData> details = intentRepo.findByDomainAndDataset(domain, dataset);
		List<String> intentList = new ArrayList<>();
		String utr = null;
		for (int i = 0; i < details.size(); i++) {
			intentList.add(details.get(i).getIntent());
			if (details.get(i).getIntent() == intent) {
				utr = details.get(i).getUtterances();
			}
		}
		utterances = utterances + utr;
		if (intentList.contains(intent)) {
			intentRepo.insert(domain, intent, utr);
			return "Draft data saved successfully";
		} else {
			DraftData data = new DraftData(intent, utterances, domain, type, dataset);
			intentRepo.save(data);
			return "Draft data saved successfully";
		}

	}

	@Override
	public Map<String, String> getIntentTypes(String domain, String dataset) {
		Map<String, String> intentTypes = new HashMap<>();
		List<DraftData> data = intentRepo.findByDomainAndDataset(domain, dataset);
		for (int i = 0; i < data.size(); i++) {
			intentTypes.put(data.get(i).getIntent(), data.get(i).getType());
		}
		return intentTypes;
	}

	@Override
	public Map<String, List<String>> getIncompleteIntents(String domain, String dataset) {
		System.out.println(domain + " and " + dataset);
		Map<String, List<String>> incompleteIntents = new HashMap<>();
		String[] utterances;
		List<DraftData> data = intentRepo.findByDomainAndDataset(domain, dataset);
		System.out.println("============");
		System.out.println(data);
		for (int i = 0; i < data.size(); i++) {
			utterances = data.get(i).getUtterances().split(";");
			List<String> tmputr = new ArrayList<>();
			for (int j = 0; j < utterances.length; j++) {
				tmputr.add(utterances[j]);
			}
			incompleteIntents.put(data.get(i).getIntent(), tmputr);
		}
		System.out.println(incompleteIntents);
		return incompleteIntents;
	}

	@Override
	public String getRemainingUtterances(String domain, String intent, String dataset) {
		List<DraftData> data = intentRepo.findByDomainAndIntentAndDataset(domain, intent, dataset);
		System.out.println(data);
		String utterances = data.get(0).getUtterances();
		System.out.println(utterances);
		return utterances;
	}

	@Override
	public String gitPush(String domain, String commitMsg) {
		try {
			Git localGit = Git.open(new File(gitClonePath));
			localGit.add().addFilepattern(".").call();
			localGit.commit().setAll(true).setMessage(commitMsg).call();
			localGit.push().setRemote(gitRepo).add(gitBranch).setCredentialsProvider(new UsernamePasswordCredentialsProvider(gitUsername, gitToken)).call();
			return "Git push successful";
		} catch (GitAPIException | IOException e) {
			e.printStackTrace();
			return e.getMessage();
		}
	
	}
	
	@Override
	public String gitClone(String domain) {
		String firstLetStr = domain.substring(0, 1);
        String remLetStr = domain.substring(1);
        firstLetStr = firstLetStr.toLowerCase();
        String sl = firstLetStr + remLetStr;
		try {
				Git.cloneRepository().setBranchesToClone(Arrays.asList(sl+"_storage")).setBranch(sl+"_storage").setURI("https://git.idc.tarento.com/nxt/thor/thor-assistant.git")
				.setCredentialsProvider(new UsernamePasswordCredentialsProvider(gitUsername, gitToken)).setDirectory(new File(assistantPath+domain)).call();
				return "Clone successful";
			} catch (InvalidRemoteException e) {
				e.printStackTrace();
				return e.getMessage();
			} catch (TransportException e) {
				e.printStackTrace();
				return e.getMessage();
			} catch (GitAPIException e) {
				e.printStackTrace();
				return e.getMessage();
			}
//		}
	}

	public List<String> getDomains() {
		List<String> domains = new ArrayList<>();
		List<AssistantInfo> bot = botRepo.findAll();
		for (int i = 0; i < bot.size(); i++) {
			domains.add(bot.get(i).getDomain());
		}
		return domains;
	}

	public String savePublished(String bot, String modelName) {
		String models = botRepo.getOne(bot).getPublishedModels();
		models = modelName + "(null)," + models;
		botRepo.savePublishedModel(models, bot);
		return "Saved models successfully";
	}

	 public void createBranch(String domain) {
			String firstLetStr = domain.substring(0, 1);
	        String remLetStr = domain.substring(1);
	        firstLetStr = firstLetStr.toLowerCase();
	        String sl = firstLetStr + remLetStr;
	     
		 try {
			 Git git = Git.cloneRepository().setBranchesToClone(Arrays.asList("refs/heads/default")).setBranch("default")
						.setURI("https://git.idc.tarento.com/nxt/thor/thor-assistant.git")
						.setCredentialsProvider(new UsernamePasswordCredentialsProvider(gitUsername, gitToken))
						.setDirectory(new File(assistantPath + domain)).call();
			 			git.checkout().setCreateBranch(true).setName(sl+"_storage").call();
			 			git.push().setRemote("origin").setCredentialsProvider(new UsernamePasswordCredentialsProvider(gitUsername, gitToken)).call();	
			 			git.close();
		} catch (InvalidRemoteException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (TransportException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (GitAPIException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		 
	 }
	 
	 
	@Override
	public String testvar() {
		logger.debug(System.getenv("git_username"));
		logger.debug(assistantPath);
		return System.getenv("git_username") + assistantPath;
	}

	@SuppressWarnings("unchecked")
	@Override
	public String compilerAddnewFile(String intent) {
		Map<String, String> request = new HashMap<String, String>();
		request.put("intent", intent);
		Map<String, String> res = restTemplate.postForObject(compilerUrl + "/addnewFile", request, Map.class);
		return res.get("message");
	}

	@SuppressWarnings("unchecked")
	@Override
	public String compilerReadFile(String intent) {
		Map<String, String> request = new HashMap<String, String>();
		request.put("intent", intent);
		Map<String, String> res = restTemplate.postForObject(compilerUrl + "/readFile", request, Map.class);
		if (res.get("message").equals("success")) {
			return res.get("payload");
		} else {
			return "Couldn't read the file";
		}

	}

	@Override
	public String compilePY(String file) {
		Map<String, String> request = new HashMap<String, String>();
		request.put("file", file);
		String res = restTemplate.postForObject(compilerUrl + "/compilePY", request, String.class);
		System.out.println(res);
		return res;
	}

	@Override
	public String reloadData() {
		Map<String, String> res = restTemplate.getForObject(compilerUrl + "/reloadData", Map.class);
		System.out.println(res);
		if (res.get("message").equals("success")) {
			return res.get("payload");
		} else {
			return "Couldn't read the file";
		}
	}

	@Override
	public String compileJS() {
		String res = restTemplate.getForObject(compilerUrl + "/compileJS", String.class);
		System.out.println(res);
		return res;
	}

	@Override
	public String saveFile(String file) {
		Map<String, String> request = new HashMap<String, String>();
		request.put("file", file);
		Map<String, String> res = restTemplate.postForObject(compilerUrl + "/saveFile", request, Map.class);
		return res.get("message");
	}

	@Override
	public String addMultipleConvos(Map<String, List<String>> convoList, String name, String bot) {
		try {
			takeFileBackup(bot, name);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		for (int i = 0; i < convoList.size(); i++) {
			String intent = convoList.keySet().toArray()[i].toString();
			List<String> convos = convoList.get(intent);
			convos = convos.stream().distinct().collect(Collectors.toList());
			List<String> formattedconvos = new ArrayList<>();
			for (int j = 0; j < convos.size(); j++) {
				formattedconvos.add("- " + convos.get(j));
			}
			Map<String, List<String>> trainingData = new HashMap<>();
			trainingData.put(intent, formattedconvos);
			try {
				appendToOrCreateFileWithConvos(bot, name, trainingData);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		datasetVersioning(bot, name);
		return "Added conversations to dataset";
	}
	
	
//	public String importDataset(String bot, String dataset, String nlu, String stories, String actions, String domains)
	public String importDataset(String bot, String dataset, Object files)
	{
		
		System.out.println(files);
		String res = "New dataset created";
		String newDirectory = assistantPath + bot + "/datasets/" + dataset;
		File createDirectory = new File(newDirectory);
		// create a new directory with dataset name inside bot folder
		createDirectory.mkdir();
		File baseDir = new File(baseDirectory);
		// add initial data to the datasets (set of 6 intents)
		try {
			FileUtils.copyDirectory(baseDir, createDirectory);
			File file = new File(newDirectory + modelDirPath + "README.md");
			if(file.exists())
			{
				file.delete();
			}
			
//				File action = new File(newDirectory + "/bot/actions.py");
//				File story = new File(newDirectory + "/bot/data/stories.md");
//				File nluData = new File(newDirectory + "/bot/data/nlu.md");
//				File domain = new File(newDirectory + "/bot/domain.yml");
//			    FileWriter nluWriter = new FileWriter(nluData);
//				nluWriter.write(nlu);
//				nluWriter.close();
//				FileWriter storyWriter = new FileWriter(story);
//				storyWriter.write(stories);
//				storyWriter.close();
//				FileWriter actionWriter = new FileWriter(action);
//				actionWriter.write(actions);
//				actionWriter.close();
//				FileWriter domainWriter = new FileWriter(domain);
//				domainWriter.write(domains);
//				domainWriter.close();
			gitPush(bot,"Added a new dataset " + dataset);
			return res;
		} catch (IOException e) {
			e.printStackTrace();
			logger.error("Could not create a dataset : " + e.getMessage());
			return "Could not create dataset";
		}
	}
	
	@Override
	public String readLookupScript(String bot, String dataset)
	{
		String fileName = assistantPath + bot + "/datasets/" + dataset + "/refreshLookups.py";
		System.out.println(fileName);
		String content = null;
		try {
			content = FileUtils.readFileToString(new File(fileName), StandardCharsets.UTF_8);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return content;
	}
	
	
	@Override
	public String createSynonym(String bot, String name, String synonym, List<String> synonymValues)
	{
		String draftDataset = assistantPath + bot + "/datasets/" + "draft";
		if(new File(draftDataset).exists())
		{
			name = "draft";
		}
		else
		{
			try {
				String newDirectory = assistantPath + bot + "/datasets/" + "draft";
				File createDirectory = new File(newDirectory);
				createDirectory.mkdir();
				File baseDir = new File(assistantPath + bot + "/datasets/" + name);
				FileUtils.copyDirectory(baseDir, createDirectory);
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		    name = "draft";
		}
		File file = new File(assistantPath + bot + "/datasets/" + name + nluFilePath);
		// edit the nluFile and add new data
		try (FileWriter fw = new FileWriter(file, true)) {
			fw.write("\n" + "## synonym:" + synonym);
			for (int i = 0; i < synonymValues.size(); i++) {
				fw.write("\n" + "- " + synonymValues.get(i));
			}
			fw.write("\n");
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return "successfully created synonym "+ synonym ;
	}

	@Override
	public String createRegex(String bot, String name, String regex, String regexValue)
	{
//		if(intentCount == 0 && synonymCount == 0 && regexCount == 0 && lookupCount == 0 )
//		{
//			try {
//				takeFileBackup(bot, name);
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//		}
		String draftDataset = assistantPath + bot + "/datasets/" + "draft";
		if(new File(draftDataset).exists())
		{
			name = "draft";
		}
		else
		{
			try {
				String newDirectory = assistantPath + bot + "/datasets/" + "draft";
				File createDirectory = new File(newDirectory);
				createDirectory.mkdir();
				File baseDir = new File(assistantPath + bot + "/datasets/" + name);
				FileUtils.copyDirectory(baseDir, createDirectory);
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		    name = "draft";
		}
		File file = new File(assistantPath + bot + "/datasets/" + name + nluFilePath);
		// edit the nluFile and add new data
		try (FileWriter fw = new FileWriter(file, true)) {
			fw.write("\n" + "## regex:" + regex);
			fw.write("\n" + "- " +regexValue);
			fw.write("\n");
		} catch (IOException e) {
			e.printStackTrace();
		}
		return "successfully created regex "+regex;
	}
	
	@Override
	public String createLookup(String bot, String name, String lookup, String lookupType, List<String> lookupValues,
			String lookupData)
	{
		String draftDataset = assistantPath + bot + "/datasets/" + "draft";
		if(new File(draftDataset).exists())
		{
			name = "draft";
		}
		else
		{
			try {
				String newDirectory = assistantPath + bot + "/datasets" + "draft";
				File createDirectory = new File(newDirectory);
				createDirectory.mkdir();
				File baseDir = new File(assistantPath + bot + "/datasets/" + name);
				FileUtils.copyDirectory(baseDir, createDirectory);
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		    name = "draft";
		}
		File file = new File(assistantPath + bot + "/datasets/" + name + nluFilePath);
		// edit the nluFile and add new data
		try (FileWriter fw = new FileWriter(file, true)) {
			fw.write("\n" + "## lookup:" + lookup);
			fw.write("\n" + "data/"+lookup+".txt");
			fw.write("\n");
		} catch (IOException e) {
			e.printStackTrace();
		}
		if(lookupType.equals("static"))
		{
			try {
				FileWriter writer = new FileWriter(assistantPath + bot + "/datasets/" + name + "/bot/data/"+lookup+".txt");
				for(String str: lookupValues)
				{
					  writer.write(str + System.lineSeparator());
				}
				writer.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 	
		}
		
		return "successfully created lookup "+lookup;
	}
	
	private String appendToOrCreateFileWithConvos(String bot, String name, Map<String, List<String>> trainingData)
			throws IOException {
		File file = new File(assistantPath + bot + "/datasets/" + name + nluFilePath);

		List<String> lines = Files.readAllLines(Paths.get(file.getAbsolutePath()));
		CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>(lines);

		for (String key : trainingData.keySet()) {
			for (String line : list) {
				if (line.startsWith("##") && line.endsWith(key)) {
					for (int i = 0; i < trainingData.size(); i++) {
						list.addAll(list.indexOf(line) + 1, trainingData.get(key));
					}

				}
			}
		}
		try (FileWriter fw = new FileWriter(file, false)) {
			for (String line : list) {
				fw.write(line + "\n");
			}
		}
		return "Successfully created utterance";
	}

	public List<String> getAllUtterances(String bot, String name) {
		File file = new File(assistantPath + bot + "/datasets/" + name + nluFilePath);
		List<String> allUtterances = new ArrayList<>();
		try {
			List<String> lines = Files.readAllLines(Paths.get(file.getAbsolutePath()));
			CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>(lines);
			for (String line : list) {
				if (line.startsWith("- ")) {
					allUtterances.add(line);
				}
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return allUtterances;
	}
	
	public String updateDataset(String bot, String name)
	{
		System.out.println("Save dataset");
		String res = "Successfully updated dataset";
		String draftDataset = assistantPath + bot + "/datasets/" + "draft";
		if(new File(draftDataset).exists())
		{
			draftDatasetVersioning(bot, name);
			try {
				takeFileBackup(bot, name);
				 FileUtils.deleteDirectory(new File(assistantPath + bot + "/datasets/" + name));
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		else
		{
			res = "No changes to update the dataset";
		}
		return res;
	}
	
	
	private String draftDatasetVersioning(String bot, String name)
	{
		System.out.println("Storing data to draft");
		// take the version of existing dataset
		String[] version = name.split("-V");
		// create a new version
		int versionNumber = Integer.parseInt(version[1]) + 1;
		// name the dataset with new version
		File oldVersion = new File(assistantPath + bot + "/datasets/" + "draft");
		logger.debug("Actual dataset :" + assistantPath + bot + "/datasets/" + "draft");
		File newVersion = new File(assistantPath + bot + "/datasets/" + version[0] + "-V" + versionNumber);
		logger.debug("Updated version :" + assistantPath + bot + "/datasets/" + version[0] + "-V" + versionNumber);
		// replace the old dataset with new dataset
		oldVersion.renameTo(newVersion);
//		gitPush(bot,"Updated dataset");
		return "Updated dataset Successfull";
	}

	@Override
	public String removeModel(String bot, String name, String model)
	{
		
		System.out.println(name);
		String res = null;
		try {
			File modelFile = new File(assistantPath + bot + "/datasets/"+ name + "/" + modelDirPath + model);
			System.out.println(modelFile);
			
			File reportsFile = new File(assistantPath + bot + "/datasets/" + name + "/" + reportstDirPath + model);
			FileUtils.deleteDirectory(reportsFile);
			modelFile.delete();
			res = "Model deleted Successfully";
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return res;
	}
	
	public Map<String, Map<String, List<Map<String, String>>>> sendDataToShadowService() {
		Map<String, Map<String, List<Map<String, String>>>> domains = new HashMap<>();
		String[] assistants = new File(assistantPath).list();
		if (assistants != null) {
			for (String file : assistants) {
				String[] datasets = new File(assistantPath + file + "/dataset/").list();
				String nluFile = assistantPath + file + "/dataset/" + datasets[0] + nluFilePath;
				Map<String, List<Map<String, String>>> assistantData = new HashMap<>();
				List<Map<String, String>> nluContent = new ArrayList<>();

				try {
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
							intentsUtterances.put("example", utterance);
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

	@Override
	public List<Map<String, Object>> getFeedbacks(String assistant) {
		List feedbacks = new ArrayList<>();
		String indexName = "thor_feedback";
		SearchSourceBuilder builder = new SearchSourceBuilder();
		builder.query(QueryBuilders.matchAllQuery()).size(50).sort("rating",SortOrder.DESC);
		SearchRequest req = new SearchRequest(indexName).source(builder);
		
		try {
			SearchResponse result = client.search(req);
			for (SearchHit hit : result.getHits())
			{
				Feedback f = new Feedback();
				Map<String, Object> payload = hit.getSourceAsMap();
				System.out.println(payload);
					if(payload.get("email_id") == null)
					{
						f.setEmail_id("NA");
					}
					else
					{
						f.setEmail_id(payload.get("email_id").toString());
					}
					
					f.setSession_id(payload.get("session_id").toString().toString());
					f.setRating(Integer.parseInt(payload.get("rating").toString()));
					f.setComment(payload.get("comment").toString());
					
				feedbacks.add(f);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
//		
		return feedbacks;
	}


	
}

