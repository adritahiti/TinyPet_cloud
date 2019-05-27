package com.tinypet;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.Date;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.KeyRange;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;

@WebServlet(name = "PetServlet", urlPatterns = { "/petgen" })
public class PetServlet extends HttpServlet {

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");

		long startTime = System.currentTimeMillis();

		response.getWriter().println("creating Petitions");

		Random r = new Random();

		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

		// Create users
		/*for (int i = 0; i < 5; i++) {
			Key keyUser = KeyFactory.createKey("Petition", i);
			Entity e = new Entity("Petition", keyUser);
			e.setProperty("owner", "m" + i);
			e.setProperty("description", "d" + i);
			e.setProperty("pubDate", new Date());

			datastore.put(e);

			response.getWriter().print("<li> created petition:" + e.getKey() + "<br>");

		}*/



		int maxPet=100;
		int maxSign=50;
		for (int i = 1; i < maxPet; i++) {
			//Key keyUser = KeyFactory.createKey("Petition", i);
			Entity pet = new Entity("Petition");
			//Entity pet = new Entity("Petition");
			int r_tmp = r.nextInt(maxPet);
			pet.setProperty("title", "wrote by "+"u" + r_tmp);
			List<String> sign = new ArrayList<String>();
			for (int j = 0; j < maxSign; j++) {
				String Suser = "u"+r.nextInt(maxPet+1);
				if(!sign.contains(Suser)){
					sign.add(Suser);
				}
			}
			pet.setProperty("sign", sign);
			pet.setProperty("nbsign", sign.size());
			pet.setProperty("owner", "u" + r_tmp);

			datastore.put(pet);
		}
/*
		Query q = new Query("Petition").addSort("nbsign", Query.SortDirection.DESCENDING);

		PreparedQuery pq= datastore.prepare(q);
		List<Entity> results=pq.asList(FetchOptions.Builder.withDefaults());
		
		response.getWriter().println("Petition");
		for (Entity re : results) {
			response.getWriter().println("<li>"+re.getProperty("owner")+", "+re.getProperty("title")+", "+re.getProperty("description")+", "+re.getProperty("pubDate")+", "+re.getProperty("nbsign"));
		}
*/
		//response.getWriter().println();
		//response.getWriter().println("finished");
		long endTime = System.currentTimeMillis();
		response.getWriter().println("Done in " + (endTime - startTime)+ " milliseconds");
	}
}
