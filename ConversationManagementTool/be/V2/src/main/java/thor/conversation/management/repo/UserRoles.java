package thor.conversation.management.repo;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import thor.conversation.management.model.Role;




@Repository
public interface UserRoles extends CrudRepository<Role, Integer>
{
	@Query(value = "INSERT INTO users_roles (user_id, role_id) VALUES (?1, ?2);", nativeQuery = true)
	void addUserRole(int user_id, int role_id);
}