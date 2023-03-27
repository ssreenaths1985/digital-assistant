package thor.conversation.management.jwt;

import java.io.IOException;
import java.util.Date;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import thor.conversation.management.servicesimpl.UserDetailsServiceImpl;
import thor.conversation.management.util.JwtUtils;


public class AuthTokenFilter extends OncePerRequestFilter {
	
	@Value("${bezkoder.app.jwtSecret}")
	private String jwtSecret;
	
	@Autowired
	private JwtUtils jwtUtils;
	
	@Autowired
	private UserDetailsServiceImpl userDetailsService;

	private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
			String jwt = parseJwt(request);
		try {
			if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
			
				String username = jwtUtils.getUserNameFromJwtToken(jwt);
			
				UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			

				if(userDetails.getUsername() != null && jwtUtils.validateJwtToken(jwt) && jwtExpiration(jwt) == false)
				{
					UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
							userDetails, null, userDetails.getAuthorities());
					authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

					SecurityContextHolder.getContext().setAuthentication(authentication);	
					logger.debug("authentication successful");
				}
				else
				{
					logger.debug("Could not authenticate");
				}
				
				
			}
		} catch (Exception e) {
			logger.error("Cannot set user authentication: {}", e);
		}
		
		filterChain.doFilter(request, response);
		
	}
	
	private void allowForRefreshToken(ExpiredJwtException ex, HttpServletRequest request) {

		// create a UsernamePasswordAuthenticationToken with null values.
		UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
				null, null, null);
		// After setting the Authentication in the context, we specify
		// that the current user is authenticated. So it passes the
		// Spring Security Configurations successfully.
		SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
		// Set the claims so that in controller we will be using it to create
		// new JWT
		request.setAttribute("claims", ex.getClaims());

	}


	private String parseJwt(HttpServletRequest request) {
		String headerAuth = request.getHeader("Authorization");
		if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
			return headerAuth.substring(7, headerAuth.length());
		}

		return null;
	}
	
	private boolean jwtExpiration(String jwtToken)
	{
		Date expiration = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(jwtToken).getBody().getExpiration();
		logger.debug("TokenExpiry flag" + expiration.before(new Date(System.currentTimeMillis())));
		return expiration.before(new Date(System.currentTimeMillis())) ;
	}
}