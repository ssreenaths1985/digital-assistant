package thor.conversation.management;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(0)
public class SimpleCORSFilter implements Filter {
	Logger logger = LoggerFactory.getLogger(SimpleCORSFilter.class);
	
//	@Value("${spring.datasource.username}")
//	 String username;
//	@Value("${spring.datasource.url}")
//	String url;
	

	private final Logger log = LoggerFactory.getLogger(SimpleCORSFilter.class);

	public SimpleCORSFilter() {
//		log.info("SimpleCORSFilter init");
//		log.info("====" + username);
//		log.info("-----"+url);
//		log.info(System.getenv("spring.datasource.url"));
//		log.info(System.getenv("spring.datasource.username"));
	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
			throws IOException, ServletException {

		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) res;
		response.setHeader("Access-Control-Allow-Origin", "*");
	    response.setHeader("Access-Control-Allow-Credentials", "true");
	    response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
	    response.setHeader("Access-Control-Max-Age", "3600");
	    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With, remember-me, Authorization, X-XSRF-TOKEN,token , auth");

//		response.setHeader("Access-Control-Allow-Origin", "*");
//		response.setHeader("Access-Control-Allow-Credentials", "true");
//		response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, HEAD, PATCH");
//		response.setHeader("Access-Control-Max-Age", "3600");
//		response.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With, remember-me,Authorization, X-XSRF-TOKEN,token , auth");
		chain.doFilter(req, res);
	}

	@Override
	public void init(FilterConfig filterConfig) {
		log.info("SimpleCORSFilter init");
		
		
	}

	@Override
	public void destroy() {
	}

}