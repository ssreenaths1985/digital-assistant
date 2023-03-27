package thor.conversation.management.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import thor.conversation.management.dto.RequestByDate;
import thor.conversation.management.dto.ResponseDTO;
import thor.conversation.management.model.Status;
import thor.conversation.management.services.ShadowService;

@RestController
public class ShadowMonitorController {
	
	Logger logger = LoggerFactory.getLogger(ShadowMonitorController.class);
	
	@Autowired
	ShadowService shadowService;
	String failureMessage = "failure";
	String successMessage = "success";
	
	
	
	@GetMapping("/domains/nlu/data")
	@CrossOrigin(origins = "*")
	public ResponseDTO<Map<String, Map<String, List<Map<String, String>>>>> sendDataToShadowService(){
		try {
			return new ResponseDTO<>(new Status<>(200, successMessage), shadowService.sendDataToShadowService());
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, failureMessage),shadowService.sendDataToShadowService());
	}
	
	@PostMapping(value="/shadow/response", consumes=MediaType.APPLICATION_JSON_VALUE)
	@CrossOrigin(origins = "*")
	public ResponseDTO<String> getShadowResponse(@RequestBody RequestByDate req){
		try {
			 String response = shadowService.getShadowResponse(req.getDomain(), req.getMessage());
			return new ResponseDTO<>(new Status<>(200, successMessage), response);
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return new ResponseDTO<>(new Status<>(500, failureMessage),null);
	}

}
