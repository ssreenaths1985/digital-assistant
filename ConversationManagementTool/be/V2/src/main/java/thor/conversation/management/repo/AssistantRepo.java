package thor.conversation.management.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import thor.conversation.management.entity.AssistantInfo;

@Repository
public interface AssistantRepo extends JpaRepository<AssistantInfo, String>{
	@Query(value = "UPDATE Bot_Management.bot_info SET published_models = ?1 where domain = ?2", nativeQuery = true)
		void savePublishedModel(String model, String domain);
}
