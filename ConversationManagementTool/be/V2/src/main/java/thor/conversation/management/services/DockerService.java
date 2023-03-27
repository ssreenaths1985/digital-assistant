package thor.conversation.management.services;

import java.io.IOException;
import java.util.List;

import com.github.dockerjava.api.model.Container;
import com.github.dockerjava.api.model.Image;

import thor.conversation.management.dto.AssistantStatus;
import thor.conversation.management.exceptions.CouldNotFetchPortException;
import thor.conversation.management.model.AssistantTrainDto;
import thor.conversation.management.model.ContainerInfo;
import thor.conversation.management.model.ImageInfo;
import thor.conversation.management.model.K8ImageInfo;
import thor.conversation.management.model.RunContainerInfo;



public interface DockerService {

	String createImage(String domainName, String dataset, String env, String type);

	String deployNewBotK8(String domainName, String dataset, String env, String type) throws IOException;

	String replaceModel(K8ImageInfo imageInfo);

	String deleteBotK8(K8ImageInfo imageInfo) throws IOException;

}
