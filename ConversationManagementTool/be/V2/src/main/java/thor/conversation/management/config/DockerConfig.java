package thor.conversation.management.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientBuilder;

@Configuration
public class DockerConfig {
	
////	@Value("${docker.host.url}")
////	String dockerHostUrl;
//	
//	@Bean
//	public DockerClient dockerClient() {
//		String env = "52.173.240.27";
//		String dockerHostUrl = "tcp://" + env + ":2375";
////		DefaultDockerClientConfig config
////		  = DefaultDockerClientConfig.createDefaultConfigBuilder()
//		    /*.withRegistryEmail("")
//		    .withRegistryPassword("")
//		    .withRegistryUsername("")
//		    .withDockerCertPath("/home/.docker/certs")
//		    .withDockerConfig("/home/.docker/")
//		    .withDockerTlsVerify("1")*/
////		    .withDockerHost(dockerHostUrl).build();
//		
//		
//
//		 
//		return DockerClientBuilder.getInstance(dockerHostUrl).build();
//	}
	
	@Bean
	public RestTemplate restTemplate(RestTemplateBuilder builder) {
		return builder.build();
	}
}
