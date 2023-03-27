package thor.conversation.management.repo;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import thor.conversation.management.model.User;



@Repository
public interface UserRepo extends CrudRepository<User, Integer>
{
	
//	Optional<User> findByUsername(String username);
	
//	User findByEmail(String email);
	
	
	
	@Query("SELECT u FROM User u WHERE u.username = :username")
    public User getUserByUsername(@Param("username") String username);
	
	@Query(value = "SELECT is_active FROM users where username = ?1", nativeQuery = true)
	boolean getActive(String username);
	Boolean existsByUsername(String username);
	
	
}