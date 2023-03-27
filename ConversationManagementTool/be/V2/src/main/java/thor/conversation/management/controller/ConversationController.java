package thor.conversation.management.controller;

import java.io.IOException;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import thor.conversation.management.dto.RequestByDate;
import thor.conversation.management.dto.RequestByUser;
import thor.conversation.management.dto.ResponseDTO;
import thor.conversation.management.model.Conversation;
import thor.conversation.management.model.Status;
import thor.conversation.management.repo.AssistantRepo;
import thor.conversation.management.services.UtteranceService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/users/data/show")
public class ConversationController {
	
	Logger logger = LoggerFactory.getLogger(ConversationController.class);
	
	@Autowired
	UtteranceService utteranceService;
	
	
	
	String failureMessage = "failure";
	String successMessage = "success";
	
	@PostMapping(value="/convo/by/date", consumes=MediaType.APPLICATION_JSON_VALUE)
	@CrossOrigin(origins = "*")
	public ResponseDTO<Map> getConvoByDate(@RequestBody RequestByDate req){
		
//		return new ResponseDTO<>(new Status(200, successMessage), utteranceService.getConversations(req.getDomain()));
		try {
			System.out.println("INSIDE the CONVERSATIONS");
			Map<String, Conversation> response = utteranceService.getConvoByDate(req.getDomain());
//			Map<String, Conversation> response = utteranceService.getConvoByDate(req.getDomain(), req.getFromDate(), req.getToDate(), req.getPage(), req.getPageSize());
			return new ResponseDTO<>(new Status<>(200, successMessage), response);
		} catch (IOException e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, failureMessage),null);
	}
	
	@PostMapping(value="/convo/by/user", consumes=MediaType.APPLICATION_JSON_VALUE)
	@CrossOrigin(origins = "*")
	public ResponseDTO<Conversation> getConvoByDate(@RequestBody RequestByUser req){
		try {
			Conversation response = utteranceService.getConvoByUser(req.getDomain(), req.getUserID(), req.getPage(), req.getPageSize());
			return new ResponseDTO<>(new Status<>(200, successMessage), response);
		} catch (IOException e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, failureMessage),null);
	}
}

