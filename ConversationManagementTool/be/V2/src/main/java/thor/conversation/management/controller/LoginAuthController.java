package thor.conversation.management.controller;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.jsonwebtoken.impl.DefaultClaims;
import thor.conversation.management.dto.ResponseDTO;

import thor.conversation.management.model.LoginRequest;
import thor.conversation.management.model.Role;
import thor.conversation.management.model.SignupRequest;
import thor.conversation.management.model.Status;
import thor.conversation.management.model.User;
import thor.conversation.management.repo.UserRepo;
import thor.conversation.management.repo.UserRoles;
import thor.conversation.management.servicesimpl.UserDetailsImpl;
import thor.conversation.management.util.JwtUtils;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/api/auth")


public class LoginAuthController {
	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserRepo userRepository;
	
	@Autowired
	UserRoles userRoleRepository;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	JwtUtils jwtUtils;

	
	String failureMessage = "failure";
	String successMessage = "success";

	
//	@CrossOrigin(origins = "*")
	@PostMapping("/signin")
	public ResponseDTO<UserDetailsImpl> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
		Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);
		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
		Boolean active = userRepository.getActive(userDetails.getUsername());
		userDetails.setIsActive(active);
		userDetails.setjwToken(jwt);
		
		return new ResponseDTO<>(new Status<>(200, successMessage), userDetails);
		
	}

	@PostMapping("/signup")
	public ResponseDTO<String> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
		if (userRepository.existsByUsername(signUpRequest.getUsername())) {
			
			return new ResponseDTO<>(new Status<>(500, failureMessage), "Error: Username is already taken!");
		}

		// Create new user's account
		User user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(),
							 encoder.encode(signUpRequest.getPassword()),signUpRequest.getIsActive(), signUpRequest.getRoles());
		userRepository.save(user);
		//update the user_roles table with user_id and role_id
		Set<Role> role = signUpRequest.getRoles();
//		System.out.println(role.getClass());
		System.out.println(role);
		int id  = userRepository.getUserByUsername(signUpRequest.getUsername()).getId();
//		for (Role roles : role)
//		{
//			int role_id = roles.getId();
//			userRoleRepository.addUserRole(id, role_id);
//	    }
        
		return new ResponseDTO<>(new Status<>(200, successMessage), "User registered successfully!");
	}
	@RequestMapping(value = "/refreshtoken", method = RequestMethod.GET)
	public ResponseEntity<?> refreshtoken(HttpServletRequest request) throws Exception {
		// From the HttpRequest get the claims
		DefaultClaims claims = (io.jsonwebtoken.impl.DefaultClaims) request.getAttribute("claims");

		Map<String, Object> expectedMap = getMapFromIoJsonwebtokenClaims(claims);
		String token = jwtUtils.doGenerateRefreshToken(expectedMap, expectedMap.get("sub").toString());
		return ResponseEntity.ok(token);
	}

	public Map<String, Object> getMapFromIoJsonwebtokenClaims(DefaultClaims claims) {
		Map<String, Object> expectedMap = new HashMap<String, Object>();
		for (Entry<String, Object> entry : claims.entrySet()) {
			expectedMap.put(entry.getKey(), entry.getValue());
		}
		return expectedMap;
	}
}