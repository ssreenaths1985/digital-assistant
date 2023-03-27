package thor.conversation.management.controller;
import java.io.IOException;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import thor.conversation.management.dto.ReqAddConvos;
import thor.conversation.management.dto.ReqAddUtterances;
import thor.conversation.management.dto.ReqMultipleIntentUtterances;
import thor.conversation.management.dto.ReqNewTrainingData;
import thor.conversation.management.dto.ResponseDTO;
import thor.conversation.management.entity.DraftData;
import thor.conversation.management.model.Assistant;
import thor.conversation.management.model.Datasets;
import thor.conversation.management.model.ImageInfo;
import thor.conversation.management.model.Compiler;
import thor.conversation.management.model.ImportDataset;
import thor.conversation.management.model.IntentResponse;
import thor.conversation.management.model.LoadModel;
import thor.conversation.management.model.DatasetResponse;
import thor.conversation.management.model.Status;
import thor.conversation.management.services.DockerService;
import thor.conversation.management.services.PersistenceService;

@CrossOrigin(origins = "*")
@RestController
public class TrainingDataCreationController {
	
	Logger logger = LoggerFactory.getLogger(TrainingDataCreationController.class);
	
	@Autowired
	PersistenceService persistenceService;
	
	
	@Autowired
	DockerService dockerservice;
	
	String failureMessage = "failure";
	String successMessage = "success";
	
	
	
	// apis for super admin roles to create a bot and publish model
	
	@PostMapping("/users/data/new/createAssistant")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String> createAssistant(@RequestBody Assistant a){
		try {
			return new ResponseDTO<>(new Status<>(200, successMessage), persistenceService.createAssistant(a.getName()));
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, failureMessage),persistenceService.createAssistant(a.getName()));
	}
	
	
	@PostMapping("/users/data/new/publishModel")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String>publishModel(@RequestBody LoadModel lm) throws IOException
	{
		System.out.println("loading ...");
		try
		{
			return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.loadModel(lm.getAssistant(),lm.getName(), lm.getModel(), lm.getEnv()));
		} catch(Exception e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, successMessage),"Couldn't load the model");
		
	}
	
	
	// apis to modify the dataset and create reports
	
	
	@PostMapping(value="/users/data/edit/saveUtterances", consumes=MediaType.APPLICATION_JSON_VALUE)
	@CrossOrigin(origins = "*")
	public ResponseDTO<String> saveUtterances(@RequestBody ReqMultipleIntentUtterances req){
		try {
		  return new ResponseDTO<>(new Status<>(200, successMessage), persistenceService.addUtterances(req.getMultipleIntentUtterances(),req.getName(), req.getAssistant()));
			
		} catch (IOException | URISyntaxException e) {
			logger.error(e.getMessage());
		} 
		return new ResponseDTO<>(new Status<>(500, failureMessage),"Could not create utterance");
	}
	
	@PostMapping(value="/users/data/edit/addMultipleConvos", consumes=MediaType.APPLICATION_JSON_VALUE)
	@CrossOrigin(origins = "*")
	public ResponseDTO<String> addMultipleConvos(@RequestBody ReqAddConvos req){
		try {
		  return new ResponseDTO<>(new Status<>(200, successMessage), persistenceService.addMultipleConvos(req.getConvoList(),req.getName(), req.getAssistant()));
			
		} catch (Exception e) {
			logger.error(e.getMessage());
		} 
		return new ResponseDTO<>(new Status<>(500, failureMessage),"Could not create utterance");
	}
	
	@PostMapping("/users/data/edit/createNewIntent")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String> createIntent(@RequestBody ReqNewTrainingData req){
		try {
			
			return new ResponseDTO<>(new Status<>(200, successMessage), 
					persistenceService.createIntent(req.getAssistant(),req.getName(),req.getIntentName(), req.getType(), req.getUtterances(), req.getAnswer(), req.getAction()));
		} catch (IOException | URISyntaxException e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, failureMessage),"Could not create new Intent");
	}
	
	@PostMapping("/users/data/edit/updateDataset")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String> updateDataset(@RequestBody ReqNewTrainingData req){
		try {
			
			return new ResponseDTO<>(new Status<>(200, successMessage), 
					persistenceService.updateDataset(req.getAssistant(),req.getName()));
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, failureMessage),"Could not create new Intent");
	}
	
	@PostMapping("/users/data/edit/createRegex")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String> createRegex(@RequestBody ReqNewTrainingData req){
		try {
			return new ResponseDTO<>(new Status<>(200, successMessage), 
			persistenceService.createRegex(req.getAssistant(),req.getName(), req.getRegex(), req.getRegexValue()));
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, failureMessage),"Could not create regex");
		
	}
	
	@PostMapping("/users/data/edit/createSynonym")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String> createSynonym(@RequestBody ReqNewTrainingData req){
		try {
			return new ResponseDTO<>(new Status<>(200, successMessage), 
					persistenceService.createSynonym(req.getAssistant(),req.getName(), req.getSynonym(), req.getSynonymValues()));
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, failureMessage),"Could not create synonym");
		
	}
	
	@PostMapping("/users/data/edit/createLookup")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String> createLookup(@RequestBody ReqNewTrainingData req){
		try {
			return new ResponseDTO<>(new Status<>(200, successMessage), 
					persistenceService.createLookup(req.getAssistant(),req.getName(), req.getLookup(), req.getLookupType(), req.getLookupValues(), req.getLookupData()));
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, failureMessage),"Could not create lookup");
		
	}
	
	@PostMapping("/users/data/edit/create/dataset")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String> createDataset(@RequestBody Datasets ds){
		try {
			return new ResponseDTO<>(new Status<>(200, successMessage), persistenceService.createDataset(ds.getName(),ds.getAssistant()));
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, failureMessage),"Could not create new Dataset");
	}

	@PostMapping("/users/data/edit/evaluate/model")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String> evaluateModels(@RequestBody LoadModel lm){
		try
		{
			return new ResponseDTO<>(new Status<>(200, successMessage), persistenceService.evaluateModel(lm.getAssistant(),lm.getName(),lm.getModel()));
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, failureMessage),"Could not create reports");
	}
	
	@PostMapping("/users/data/edit/confmat/ints")
	@CrossOrigin(origins = "*")
	public ResponseDTO<List<String>> confmatInts(@RequestBody LoadModel lm) throws IOException
	{
		
		return new ResponseDTO<>(new Status<>(200, successMessage), persistenceService.confmatInts(lm.getAssistant(), lm.getName(), lm.getModel()));
	}
	
	
	@PostMapping("/users/data/edit/train")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String>train(@RequestBody Datasets ds) throws IOException
	{
		String res = persistenceService.train(ds.getAssistant(),ds.getName());
		
			if(res == "Training successful")
			{
				return new ResponseDTO<>(new Status<>(200, successMessage),res);
			}
			else 
			{
				
				return new ResponseDTO<>(new Status<>(500, successMessage),res);
			}
	}
	
	@PostMapping("/users/data/edit/import/dataset")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String>importDataset(@RequestBody ImportDataset id) throws IOException
	{
		try
		{
			return new ResponseDTO<>(new Status<>(200, successMessage), persistenceService.importDataset(id.getAssistant(), id.getDataset(), id.getFiles()));
		} catch(Exception e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, successMessage),"Couldn't import dataset");
		
	}
	
	
	@PostMapping("/users/data/edit/load/model")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String>loadModel(@RequestBody LoadModel lm) throws IOException
	{
		try
		{
			return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.loadModel(lm.getAssistant(),lm.getName(), lm.getModel(), lm.getEnv()));
		} catch(Exception e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, successMessage),"Couldn't load the model");
		
	}
	
	@PostMapping("/users/data/edit/modify/response")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String> modifyResponse(@RequestBody IntentResponse ir)
	{
		try
		{
			return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.modifyResponse(ir.getAssistant(),ir.getName(), ir.getModifiedResponses()));
		} catch(Exception e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, successMessage),"Couldn't modify the response");
		
	}

	
	@PostMapping("/users/data/edit/restore/dataset")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String> restoredataset(@RequestBody IntentResponse ir)
	{
		try {
			return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.restoreFileBackup(ir.getAssistant(),ir.getName()));
		} catch (IOException e) {
			e.printStackTrace();
		}
		return new ResponseDTO<>(new Status<>(500, failureMessage),"Couldn't restore the dataset");
	}
	
	@PostMapping("/users/data/edit/save/draft/data")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String> saveDraftData (@RequestBody DraftData data){
		try {
			return new ResponseDTO<>(new Status<>(200, successMessage), persistenceService.saveDraftData(data.getIntent(), data.getUtterances(), data.getDomain(), data.getType(), data.getDataset()));
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, failureMessage),"Could not save the intents to db");
	}
	
	@PostMapping("/users/data/edit/git/clone")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String>gitClone(String domain)
	{
		try {
			return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.gitClone(domain));
		} catch(Exception e) {
			logger.error(e.getMessage());
		}
	return new ResponseDTO<>(new Status<>(500, successMessage),persistenceService.gitClone(domain));
	
}
	@PostMapping("/users/data/edit/git/push")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String>gitPush(String domain, String commitMsg)
	{
		try {
			return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.gitPush("Thor","pushing the changes"));
		} catch(Exception e) {
			logger.error(e.getMessage());
		}
	return new ResponseDTO<>(new Status<>(500, successMessage),persistenceService.gitPush("THOR","pushing the changes"));
}
	
	
	//compiler apis
	
	@PostMapping("/users/data/edit/compiler/addnewfile")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String>compilerAddnewFile(@RequestBody Compiler data)
	{
		try {
			return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.compilerAddnewFile(data.getIntent()));
		} catch(Exception e) {
			logger.error(e.getMessage());
		}
	return new ResponseDTO<>(new Status<>(500, successMessage),persistenceService.compilerAddnewFile(data.getIntent()));
}
	
	
	@PostMapping("/users/data/edit/compiler/readfile")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String>compilerReadFile(@RequestBody DraftData data)
	{
		try {
			return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.compilerReadFile(data.getIntent()));
		} catch(Exception e) {
			logger.error(e.getMessage());
		}
	return new ResponseDTO<>(new Status<>(500, successMessage),persistenceService.compilerReadFile(data.getIntent()));
}
	@PostMapping("/users/data/edit/compiler/compilepy")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String>compilePY(@RequestBody Compiler data)
	{
		try {
			return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.compilePY(data.getFile()));
		} catch(Exception e) {
			logger.error(e.getMessage());
		}
	return new ResponseDTO<>(new Status<>(500, successMessage),persistenceService.compilePY(data.getFile()));
}
	@GetMapping("/users/data/edit/compiler/reload")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String>readloadData()
	{
		try {
			return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.reloadData());
		} catch(Exception e) {
			logger.error(e.getMessage());
		}
	return new ResponseDTO<>(new Status<>(500, successMessage),persistenceService.reloadData());
}
	@PostMapping("/users/data/edit/compiler/savefile")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String>saveFile(@RequestBody Compiler data)
	{
		try {
			return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.saveFile(data.getFile()));
		} catch(Exception e) {
			logger.error(e.getMessage());
		}
	return new ResponseDTO<>(new Status<>(500, successMessage),persistenceService.saveFile(data.getFile()));
	}
	
	@GetMapping("/users/data/edit/compiler/compilejs")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String>compileJS()
	{
		try {
			return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.compileJS());
		} catch(Exception e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, successMessage),persistenceService.compileJS());
}
	
	
	//apis to display the data from the storages
	
	
	@PostMapping("/users/data/show/intents")
	@CrossOrigin(origins = "*")
	public ResponseDTO<Map<String,List<String>>> getIntents(@RequestBody Datasets ds) {
		return new ResponseDTO<>(new Status<>(200, successMessage), persistenceService.getIntents(ds.getAssistant(),ds.getName()));
	}
	
	@PostMapping("/users/data/show/lookup")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String>readLookupScript(@RequestBody ImportDataset id) throws IOException
	{
		return new ResponseDTO<>(new Status<>(200, successMessage), persistenceService.readLookupScript(id.getAssistant(), id.getDataset()));
	}
	
	
	@PostMapping("/users/data/show/confmat")
	@CrossOrigin(origins = "*")
	public ResponseDTO<Object[][]>getConfmat(@RequestBody  LoadModel lm)
	{
		return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.getConfmat(lm.getAssistant(), lm.getName(), lm.getModel()));
	}
	

	
	@PostMapping("/users/data/show/reports")
	@CrossOrigin(origins = "*")
	public ResponseDTO<Map<String,Map<String,Float>>> getReports(@RequestBody LoadModel lm)
	{ 
		return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.getReports(lm.getAssistant(), lm.getName(), lm.getModel()));
	}
	
	@PostMapping("/users/data/show/models")
	@CrossOrigin(origins = "*")
	public ResponseDTO<Map<String, List<String>>> getModels(@RequestBody Datasets ds)
	{
		return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.getModels(ds.getAssistant()));
	}
	
	@PostMapping("/users/data/show/published/models")
	@CrossOrigin(origins = "*")
	public ResponseDTO<Map<String,String>> getPublishedModels(@RequestBody Datasets ds)
	{
		return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.getPublishedModels(ds.getAssistant()));
	}
	
	@PostMapping("/users/data/show/intent/response")
	@CrossOrigin(origins = "*")
	public ResponseDTO<Map<String, Object>> getIntentResponse(@RequestBody IntentResponse ir)
	{
		return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.getIntentResponse(ir.getAssistant(),ir.getName(), ir.getIntent()));
	}

	
	@PostMapping("/users/data/show/dataset/versions")
	@CrossOrigin(origins = "*")
	public ResponseDTO<DatasetResponse> getDatasetVersions(@RequestBody Datasets ds)
	{
		DatasetResponse response;
		response=persistenceService.getDatasetVersions(ds.getAssistant(), ds.getName());
		if(null!=response) {
		return new ResponseDTO<>(new Status<>(200,successMessage),response);
		}
		else {
			return new ResponseDTO<>(new Status<>(500, failureMessage),response);
		}
	}
	
	@GetMapping("/users/data/show/assistants")
	@CrossOrigin(origins = "*")
	public ResponseDTO<List<String>> getAssistants(){
		try {
			return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.getAssistants());
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, failureMessage),persistenceService.getAssistants());
	}
	
	@PostMapping("/users/data/show/datasets")
	@CrossOrigin(origins = "*")
	public ResponseDTO<DatasetResponse> getDataSets(@RequestBody Datasets ds)
	{
		DatasetResponse response;
		response=persistenceService.getDataSets(ds.getAssistant());
		if(null!=response) {
		return new ResponseDTO<>(new Status<>(200,successMessage),response);
		}
		else {
			return new ResponseDTO<>(new Status<>(500, failureMessage),response);
		}
	}
	
	@PostMapping("/users/data/show/intent/types")
	@CrossOrigin(origins = "*")
	public ResponseDTO<Map<String, String>> getIntentTypes(@RequestBody DraftData data){
		return new ResponseDTO<>(new Status<>(200, successMessage), persistenceService.getIntentTypes(data.getDomain(), data.getDataset()));
		}
	
	@PostMapping("/users/data/show/incomplete/intents")
	@CrossOrigin(origins = "*")
	public ResponseDTO<Map<String, List<String>>> getIncompleteIntents (@RequestBody DraftData data){
		return new ResponseDTO<>(new Status<>(200, successMessage), persistenceService.getIncompleteIntents(data.getDomain(), data.getDataset()));
		}
	
	@PostMapping("/users/data/show/remaining/utterances")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String> getReaminingUtterances(@RequestBody DraftData data){
		return new ResponseDTO<>(new Status<>(200, successMessage), persistenceService.getRemainingUtterances(data.getDomain(), data.getIntent(), data.getDataset()));
		}
	
	@PostMapping("/users/data/show/allutterances")
	@CrossOrigin(origins = "*")
	public ResponseDTO<List<String>> getAllUtterances(@RequestBody IntentResponse ir)
	{
		return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.getAllUtterances(ir.getAssistant(),ir.getName()));
	}
	
	@PostMapping("/users/data/show/histogram")
	@CrossOrigin(origins = "*")
	public ResponseDTO<Map<String, Map<Double, Integer>>>getHistogram(@RequestBody  LoadModel lm)
	{
		return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.getHistogram(lm.getAssistant(), lm.getName(), lm.getModel()));
	}
	
	
	// apis to delete the data from datasets
	
	@PostMapping("/users/data/delete/dataset")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String> removeDataset(@RequestBody IntentResponse ir)
	{
		try {
			return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.removeDataset(ir.getAssistant(),ir.getName()));
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, failureMessage),"Could delete the dataset");
	}
	
	@PostMapping("/users/data/delete/intent")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String> removeIntent(@RequestBody IntentResponse ir)
	{
		try {
			return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.removeIntent(ir.getAssistant(),ir.getName(), ir.getIntent()));
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, failureMessage),"Could delete the intent");
		
	}
	
	@PostMapping("/users/data/delete/utterance")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String> removeUtterance(@RequestBody IntentResponse ir)
	{
		try {
			return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.removeUtterance(ir.getAssistant(),ir.getName(),ir.getUtterance()));
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, failureMessage),"Could delete the utterance");
		
	}
	
	@PostMapping("/users/data/delete/removeModel")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String> removeModel(@RequestBody  LoadModel lm)
	{
		try {
			return new ResponseDTO<>(new Status<>(200, successMessage),persistenceService.removeModel(lm.getAssistant(), lm.getName(), lm.getModel()));
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, failureMessage),"Could delete the utterance");
		
	}
	
	// get feedbacks
	@PostMapping("users/data/show/feedback")
	@CrossOrigin(origins = "*")
	public ResponseDTO<List<Map<String, Object>>> getFeedbacks(@RequestBody  LoadModel lm) throws IOException
	{
		
			return new ResponseDTO<>(new Status<>(200, successMessage), persistenceService.getFeedbacks(lm.getAssistant()));
	}
	
	
	@PostMapping("users/data/show/createDeployment")
	@CrossOrigin(origins = "*")
	public ResponseDTO<String> createImage(@RequestBody  ImageInfo im) throws IOException
	{
		
			return new ResponseDTO<>(new Status<>(200, successMessage), dockerservice.deployNewBotK8(im.getDomainName(), im.getDataset(), im.getEnv(), im.getType()));
	}
	
	
	
	
	//public String createImage(ImageInfo image)
	
	
	// api to get model from remote storage for model publishing
	@GetMapping("/get/model/remotestorage")
	@CrossOrigin(origins = "*")
	public ResponseEntity<InputStreamResource> getModelfromRemoteStorage(@RequestParam String assistant,
			@RequestParam String dataset, @RequestParam String modelName) throws IOException
	{
		return persistenceService.getModelFromRemoteStorage(assistant, dataset, modelName);
		
	}
	
	
//	@GetMapping("/get/last/modified")
//	@CrossOrigin(origins = "*")
//	public boolean checkActionFile(@RequestParam String assistant,
//			@RequestParam String dataset) throws IOException
//	{
//		return persistenceService.checkActionFile(assistant, dataset);
//		
//	}

	
	
	// rain apis
	
	
//	public String getRainData()
//	{
//		
//	}
//	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
