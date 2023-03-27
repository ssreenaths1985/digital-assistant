package thor.conversation.management.servicesimpl;

import java.util.Collection;
import java.util.Objects;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import thor.conversation.management.model.Role;
import thor.conversation.management.model.User;

public class UserDetailsImpl implements UserDetails {
	private static final long serialVersionUID = 1L;

	private int id;

	private String email;
	
	private String username;
	
	private Boolean isActive;
	
	private String jwToken;
	
	private Set<Role> roles;
	
	@JsonIgnore
	private String password;

	public UserDetailsImpl(int id, String email, String username, String password, boolean isActive, Set<Role> roles) {
		this.id = id;
		this.email = email;
		this.username = username;
		this.password = password;
		this.isActive = isActive;
		this.roles = roles;
	}
	
	public static UserDetailsImpl build(User user) {

		return new UserDetailsImpl(
				user.getId(),
				user.getEmail(),
				user.getUsername(),
				user.getPassword(),
				user.getIsActive(),
				user.getRoles());
	}
    


	public int getId() {
		return id;
	}

	public String getEmail() {
		return email;
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return username;
	}
	
	public Boolean isActive() {
		return isActive;
	}
	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}
	
	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}

	public String getjwToken() {
		return jwToken;
	}
	public void setjwToken(String jwToken) {
		this.jwToken = jwToken;
	}
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		UserDetailsImpl user = (UserDetailsImpl) o;
		return Objects.equals(id, user.id);
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		return null;
	}

}