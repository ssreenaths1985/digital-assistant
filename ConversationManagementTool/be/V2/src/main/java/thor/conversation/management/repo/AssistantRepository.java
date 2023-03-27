package thor.conversation.management.repo;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import thor.conversation.management.entity.Assistant;

@Repository
public interface AssistantRepository extends JpaRepository<Assistant, Integer>
{
	
	@Query("select  path from Assistant where name = ?1")
	   String getBotPath(@Param("name") String name);
	
	@Query("select  indexName from Assistant where name = ?1")
	   String getBotIndex(@Param("name") String index);
	
	 
	}
