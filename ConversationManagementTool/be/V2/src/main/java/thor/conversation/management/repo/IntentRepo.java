package thor.conversation.management.repo;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import thor.conversation.management.entity.DraftData;


@Repository
public interface IntentRepo extends JpaRepository<DraftData, String>{
	
	
	List<DraftData> findByDomainAndDataset(@Param("domain") String domain, @Param("dataset") String dataset); 
	
	List<DraftData> findByDomainAndIntentAndDataset(@Param("domain") String domain, @Param("intent") String intent, @Param("dataset") String dataset); 
	
	@Modifying
	@Transactional
	void deleteByDomainAndIntent(@Param("domain") String domain, @Param("intent") String intent);
	
	
	
    @Query(value="UPDATE Bot_management.draft_data SET utterances = ?3 WHERE intent = ?2 AND domain = ?1;", nativeQuery = true)
    public void insert(String domain, String intent, String utterances);
}


