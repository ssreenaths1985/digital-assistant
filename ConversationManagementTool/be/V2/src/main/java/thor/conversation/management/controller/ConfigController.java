package thor.conversation.management.controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;


@CrossOrigin(origins = "*")
@RestController
public class ConfigController {

	@Autowired
	JedisConnectionFactory redisConnectionFactory;

	Logger logger = LoggerFactory.getLogger(ConversationController.class);
	String failureMessage = "failure";
	String successMessage = "success";
//
//	@GetMapping("/router/getConfig")
//	@CrossOrigin(origins = "*")
//	public List<String> getConfig() {
//		List<String> domainConfigs = new ArrayList<>();
//		RedisTemplate<String, List<String>> redisTemplate = new RedisTemplate<>();
//		redisTemplate.setConnectionFactory(redisConnectionFactory);
//		redisTemplate.afterPropertiesSet();
//		HashOperations<String, String, List<String>> hashOperations = redisTemplate.opsForHash();
//		domainConfigs = hashOperations.get("DOMAINS", "domainConfig");
//		return domainConfigs;
//	}
//
//	@PutMapping("/router/putConfig")
//	@CrossOrigin(origins = "*")
//	public String saveConfig() {
//		String result = "Saved configuration successfully";
//		RedisTemplate<String, List<String>> redisTemplate = new RedisTemplate<>();
//		redisTemplate.setConnectionFactory(redisConnectionFactory);
//		redisTemplate.afterPropertiesSet();
//		HashOperations<String, String, List<String>> hashOperations = redisTemplate.opsForHash();
//		List<String> domains = new ArrayList<>();
//		domains.add("domain1-svc");
//		domains.add("domain2-svc");
//		hashOperations.put("DOMAINS", "domainConfig", domains);
//		return result;
//	}
}
