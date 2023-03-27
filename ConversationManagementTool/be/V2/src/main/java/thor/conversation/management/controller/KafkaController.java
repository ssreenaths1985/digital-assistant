package thor.conversation.management.controller;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.kafka.core.KafkaTemplate;
//import org.springframework.kafka.support.SendResult;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;

@RestController
public class KafkaController {
	
//	@Autowired
//    KafkaTemplate<String, Object> kafkaTemplate;
	
//	@Value("${spring.kafka.template.default-topic}")
//	String kafkaTopic;
//	
//	@Autowired
//    private Gson gson;
//
//    
//	@PostMapping("/produce/{message}")
//	public String sendMessage(@PathVariable(value="message") String message) {
//
//		try {
//			kafkaTemplate.send(kafkaTopic, message);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		return "Message sent succuessfully";
//	}
//	
//	
//	@PostMapping("/kafka/producer")
//	public ResponseEntity<Object> postModelToKafka(@RequestBody Map<String, List<String>> userMap) throws InterruptedException, ExecutionException {
//	        ListenableFuture<SendResult<String, Object>> result = kafkaTemplate.send(kafkaTopic, gson.toJson(userMap));
//	        return new ResponseEntity<>(result.get().getProducerRecord().value(), HttpStatus.OK);
//	    }

}
