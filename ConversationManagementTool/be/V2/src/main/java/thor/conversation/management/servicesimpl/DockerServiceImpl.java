package thor.conversation.management.servicesimpl;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.elasticsearch.client.RestHighLevelClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;
import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.model.AuthConfig;
import com.github.dockerjava.api.model.PushResponseItem;
import com.github.dockerjava.core.DockerClientBuilder;
import com.github.dockerjava.core.command.BuildImageResultCallback;
import com.github.dockerjava.core.command.PushImageResultCallback;
import com.google.common.io.Files;

import io.fabric8.kubernetes.api.model.IntOrString;
import io.fabric8.kubernetes.api.model.ServiceBuilder;
import io.fabric8.kubernetes.api.model.apps.Deployment;
import io.fabric8.kubernetes.api.model.apps.DeploymentBuilder;
import io.fabric8.kubernetes.client.DefaultKubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClient;
import thor.conversation.management.entity.AssistantInfo;
import thor.conversation.management.model.ImageInfo;
import thor.conversation.management.model.K8ImageInfo;
import thor.conversation.management.repo.AssistantRepo;
import thor.conversation.management.services.DockerService;
import thor.conversation.management.services.PersistenceService;



@Service
public class DockerServiceImpl implements DockerService {

	
	Logger logger = LoggerFactory.getLogger(DockerService.class);
//	@Autowired
//	DockerClient dockerClient;

	
	@Autowired
	PersistenceService persistenceService;
	
	@Autowired
	RestTemplate restTemplate;
	
	@Value("${assistant.training.bots}")
	String botsPath;
	
	@Autowired
	AssistantRepo botRepo;
	
	@Value("${assistant.staging.env}")
	String stagingEnv;
	
	@Value("${assistant.production.env}")
	String productionEnv;
	
	@Value("${docker.router.url}")
	String routerUrl;

	@Value("${path.docker.file}")
	String dockerFilePath;
	
	@Value("${docker.bot.port}")
	Long dockerBotPort;
	
	@Value("${docker.container.path}")
	String dockerContainerPath;
	
	@Value("${docker.router.domains}")
	String domainsFile;
	
	@Value("${docker.router.domainsTemp}")
	String domainsTemp;
	
	@Value("${docker.bot.start.message}")
	String botStartMessage;
	
	@Autowired
	RestHighLevelClient client;

	@Override
	public String createImage(String domainName, String dataset, String env, String type) {
		//System.out.println(image);
		Set<String> tagSet = new HashSet<>();
		String version = "1";
		String imagename = null;
		String dname = domainName.toLowerCase();
		if(env.equals("router"))
		{
//			version = "latest";
			imagename = "tarentonxt/:router-"+version;
			
		}
		else if(env.equals("sandbox"))
		{
			if(type.equals("nlp"))
			{
//				version = "latest";
				imagename = "tarentonxt/"+dname+":"+env+"-"+type+"server-"+version;
			}
			else
			{
//				version = "latest";
				imagename = "tarentonxt/vega:sandbox-action-server-"+version;
			}
			
		}
		else
		{
			if(type.equals("nlp"))
			{
//				version = "latest";
				imagename = "tarentonxt/vega:vega-nlp-server-"+version;
			}
			else
			{
//				version = "latest";
				imagename = "tarentonxt/vega:vega-action-server-"+version;
			}
			
		}
//		version = version.split("M_")[1];
//		version = version.split(".tar")[0];
		tagSet.add(imagename);
//		String ip = botRepo.getOne(domainName).getIP();
//		logger.debug(ip);
		String host = "tcp://localhost:2375";
		logger.debug(host);
//		persistenceService.gitClone(image.getDomainName());
		File dockerfile = new File(botsPath + "/" + domainName + "/datasets/" + dataset + "/" +"Dockerfile");
		DockerClient d = DockerClientBuilder.getInstance(host).build();
		    /*.withRegistryEmail("")
		    .withRegistryPassword("")
		    .withRegistryUsername("")
		    .withDockerCertPath("/home/.docker/certs")
		    .withDockerConfig("/home/.docker/")
		    .withDockerTlsVerify("1")*/
		String imageID = d.buildImageCmd()
				.withDockerfile(dockerfile)
				.withPull(true)
				.withNoCache(true)
				.withTags(tagSet)
				.exec(new BuildImageResultCallback())
				.awaitImageId();
		System.out.println(imageID);
		logger.debug(imageID);
//		AssistantInfo botInfo = botRepo.getOne(domainName);
//		botInfo.setDockerImageID(imageID);
//		botRepo.save(botInfo);
	    PushImageResultCallback pushImageResultCallback = new PushImageResultCallback(){
	        @Override
	        public void onNext(PushResponseItem item){
	            System.out.println("It's done too - >" + item);
	            super.onNext(item);
	        }
	    };
		  AuthConfig authConfig = new AuthConfig()
				  .withUsername("tarentonxt").withPassword("NXT@12345") 
				  .withRegistryAddress("http://hub.docker.com/v2/"); 
		  d.pushImageCmd(imagename).withName(imagename.split(":")[0]).withTag(imagename.split(":")[1])
		  .withAuthConfig(authConfig)
		  .exec(pushImageResultCallback)
		  .awaitSuccess();
		return imageID;
	}
	
	@Override
	public String deployNewBotK8(String domainName, String dataset, String env, String type) throws IOException {
		K8ImageInfo imageInfo = new K8ImageInfo();
		imageInfo.setDeploymentName(domainName.toLowerCase());
		imageInfo.setPort(80);
		imageInfo.setServiceType("ClusterIP");
		imageInfo.setSvcName(domainName.toLowerCase() +"nlp-service");
		imageInfo.setTargetPort(4000);
		//DockerClient dockerClient = DockerClientBuilder.getInstance("tcp://localhost:2375").build();
		//ImageInfo image = new ImageInfo(domainName, type, dataset, env);
		String imageID = createImage(domainName, dataset, env, type);
		imageInfo.setImage(imageID);
		KubernetesClient k8Client = new DefaultKubernetesClient();
		Deployment deployment = getDeployment(imageInfo);
		System.out.println(deployment);
		io.fabric8.kubernetes.api.model.Service service = getService(imageInfo);
		System.out.println(service);
		Deployment deploymentResponse = k8Client.apps().deployments().inNamespace("default").createOrReplace(deployment);
		io.fabric8.kubernetes.api.model.Service serviceResponse = k8Client.services().inNamespace("default").create(service);
		logger.info("deployment created");
		k8Client.close();
		logger.info("client closed");
		logger.info(deploymentResponse.getStatus().toString());
		logger.info(serviceResponse.getStatus().toString());
        //return "Testing";
		return "Deployment: "+deploymentResponse.getStatus().toString() + "\n Service:" + serviceResponse.getStatus().toString();
	}

	private io.fabric8.kubernetes.api.model.Service getService(K8ImageInfo imageInfo) {
		System.out.println(imageInfo.getTargetPort());
		return new ServiceBuilder()
				.withNewMetadata()
					.withName(imageInfo.getSvcName())
				.endMetadata()
				.withNewSpec()
					.withSelector(Collections.singletonMap("app", imageInfo.getSvcName()))
					.addNewPort()
						.withPort(imageInfo.getPort())
						.withTargetPort(new IntOrString(imageInfo.getTargetPort()))
					.endPort()
					.withType(imageInfo.getServiceType())
				.endSpec()
				.build();
	}

	private Deployment getDeployment(K8ImageInfo imageInfo) {
		return new DeploymentBuilder()
				.withNewMetadata()
				.withName(imageInfo.getDeploymentName())
				.addToLabels("app", imageInfo.getDeploymentName())
			.endMetadata()
			.withNewSpec()
				.withReplicas(1)
				.withNewSelector()
					.addToMatchLabels("app", imageInfo.getDeploymentName())
				.endSelector()
				.withNewTemplate()
					.withNewMetadata()
						.addToLabels("app", imageInfo.getDeploymentName())
					.endMetadata()
					.withNewSpec()
						.addNewContainer()
							.withName(imageInfo.getDeploymentName())
//							.withImage(imageInfo.getImage().getImageName()+ ":" + imageInfo.getImage().getVersion())
							.withImage(imageInfo.getImage())
							.addNewPort()
								.withContainerPort(80)
							.endPort()
						.endContainer()	
					.endSpec()
				.endTemplate()
			.endSpec()
			.build();
	}

	
	@Override
	public String deleteBotK8(K8ImageInfo imageInfo) throws IOException {
		KubernetesClient k8Client = new DefaultKubernetesClient();
		k8Client.apps().deployments().inNamespace("default").withName(imageInfo.getDeploymentName()).delete();
		k8Client.services().inNamespace("default").withName(imageInfo.getSvcName()).delete();
		k8Client.close();
		return "Success";
	}
	
	public String replaceModel(String domainName, String dataset, String env, String type, String deployment, String svc) {
		
		//persistenceService.gitClone(imageInfo.getDomainName());
//		editEndpointsFile(imageInfo.getSvcName(), imageInfo.getDomainName(), imageInfo.getDataset());
//		File dockerfile = new File(botsPath +"/"+imageInfo.getDomainName() + "/"+imageInfo.getDataset()+"/Dockerfile");
//		if (dockerfile.exists()) {
//			System.out.println("Dockerfile exists");
//		} else {
//			try {
//				dockerfile.createNewFile();
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//		}
//		if(imageInfo.getSvcName().contains("rasa-action"))
//		{
//			//mkdir called actions and add actions file there
//			File actions = new File(botsPath +"/"+imageInfo.getDomainName() + "/"+imageInfo.getDataset()+ "/actions");
//			logger.debug(botsPath +"/"+imageInfo.getDomainName() + "/"+imageInfo.getDataset()+ "/actions");
//			actions.mkdir();
//			try {
//				Files.copy(new File(botsPath +"/"+imageInfo.getDomainName() + "/"+imageInfo.getDataset()+"/bot/actions.py"),
//						new File(botsPath +"/"+imageInfo.getDomainName() + "/"+imageInfo.getDataset()+ "/actions/actions.py"));
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//			try {
//				PrintWriter writer = new PrintWriter(dockerfile);
//				writer.println("FROM rasa/rasa-sdk:1.10.0\n"
//						+"USER root\n"
//						+"RUN apt-get update && apt-get install git -y\n"
//						+"COPY ./actions /app/actions\n"
//						+"USER 1001\n"
//						+"EXPOSE 5055");
//				writer.close();
//			} catch (FileNotFoundException e1) {
//				// TODO Auto-generated catch block
//				e1.printStackTrace();
//			}
//			//delete the unwanted folder
//			File tmp = new File(botsPath +"/"+imageInfo.getDomainName() + "/"+imageInfo.getDataset()+ "/actions");
//			String[]entries = tmp.list();
//			for(String s: entries){
//			    File currentFile = new File(tmp.getPath(),s);
//			    currentFile.delete();
//			}
//			tmp.delete();
//		}
//		else if(imageInfo.getSvcName().contains("router-service"))
//		{
//			try {
//				PrintWriter writer = new PrintWriter(dockerfile);
//				writer.println("FROM node:8-alpine\n"
//						+ "WORKDIR /app\n"
//						+ "COPY ./router /app/\n"
//						+ "COPY ./router/package.json /app\n"
//						+ "RUN npm install\n"
//						+ "RUN npm install -g nodemon\n"
//						+ "RUN apk --no-cache add curl \n"
//						+ "WORKDIR /app\n"
//						+ "EXPOSE 4005\n"
//						+ "CMD nodemon app.js");
//				writer.close();
//			} catch (FileNotFoundException e1) {
//				// TODO Auto-generated catch block
//				e1.printStackTrace();
//			}
//			//delete router folder
//		}
//		else
//			try {
//				PrintWriter writer = new PrintWriter(dockerfile);
//				writer.println("FROM rasa/rasa:1.10.0-full\n"
//						+ "USER root\n"
//						+ "WORKDIR /app\n"
//						+ "COPY . /app/\n"
//						+ "RUN  rasa train -c ./bot/config.yml -d ./bot/domain.yml --data ./bot/data --debug \n"
//						+ "VOLUME ./bot\n"
//						+ "VOLUME ./bot/data\n"
//						+ "VOLUME ./bot/models\n"
//						+ "WORKDIR ./bot\n"
//						+ "EXPOSE 5005\n"
//						+ "CMD [ \"run\",\"-m\",\"./bot/models/\",\"--enable-api\",\"--cors\",\"*\",\"--debug\"]\n");
//				writer.close();
//			} catch (FileNotFoundException e1) {
//				// TODO Auto-generated catch block
//				e1.printStackTrace();
//			}
//		//ImageInfo image = new ImageInfo(imageInfo.getDomainName(), imageInfo.getType(), imageInfo.getDataset(), imageInfo.getEnv());
//		String imageID = createImage(domainName, dataset, env, type);
//		imageInfo.setImage(imageID);
//		KubernetesClient k8Client = new DefaultKubernetesClient();
//		Deployment deployment = k8Client.apps().deployments().inNamespace("default").withName(imageInfo.getDeploymentName()).get();
//		if(deployment!=null) {
//			List<io.fabric8.kubernetes.api.model.Container> containers = deployment.getSpec().getTemplate().getSpec().getContainers();
//			for(io.fabric8.kubernetes.api.model.Container container : containers) {
//				container.setImage(imageInfo.getImage().getImageName()+ ":" + imageInfo.getImage().getVersion());
//				container.setImage(imageInfo.getImage());
//			}
//			deployment.getSpec().getTemplate().getSpec().setContainers(containers);
//			k8Client.apps().deployments().inNamespace("default").createOrReplace(deployment);
//		}
//		k8Client.close();
//		return "updated service image";
//	}
//	
//	@SuppressWarnings("unchecked")
//	public String editEndpointsFile(String serviceName, String domain, String dataset)
//	{
//			ObjectMapper objectMapper = new YAMLMapper();
//			Map<String, Object> user = null;
//			try {
//				user = objectMapper.readValue(new File(botsPath +"/"+domain+ "/"+dataset+ "/bot/endpoints.yml"),
//				        new TypeReference<Map<String, Object>>() { });
//			} catch (JsonParseException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			} catch (JsonMappingException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//		    
//		// modify the endpoint
//		Map<String, Object> endpoint = (Map<String, Object>) user.get("action_endpoint");
//		if(serviceName.equals("vega-rasa-nlp-sandbox-service"))
//		{
//		endpoint.put("url", "http://vega-rasa-action-sandbox-service/webhook");
////		try {
//////			objectMapper.writeValue(new File(botsPath +"/"+domain+ "/"+dataset+ "/bot/endpoints.yml"), user);
////		} catch (JsonGenerationException e) {
////		
////			e.printStackTrace();
////		} catch (JsonMappingException e) {
////		
////			e.printStackTrace();
////		} catch (IOException e) {
////		
////			e.printStackTrace();
////		}
//		}
//		else if(serviceName.equals("vega-rasa-nlp-igot-service"))
//		{
//			endpoint.put("url", "http://vega-rasa-action-igot-service/webhook");
////			try {
//////				objectMapper.writeValue(new File(botsPath +"/"+domain+ "/"+dataset+ "/bot/endpoints.yml"), user);
////			} catch (JsonGenerationException e) {
////			
////				e.printStackTrace();
////			} catch (JsonMappingException e) {
////			
////				e.printStackTrace();
////			} catch (IOException e) {
////			
////				e.printStackTrace();
////			}
//		}
//		else {
//			System.out.println("Do nothing because its not an nlp-service");
//		}
		return "Edit successfull";
	}

	@Override
	public String replaceModel(K8ImageInfo imageInfo) {
		// TODO Auto-generated method stub
		return null;
	}
	

}
