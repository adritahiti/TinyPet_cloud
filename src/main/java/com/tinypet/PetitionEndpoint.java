package com.tinypet;

import java.util.*;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.config.Named;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.PreparedQuery.TooManyResultsException;
import com.google.appengine.api.datastore.Query.CompositeFilter;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.KeyRange;
import com.google.appengine.api.datastore.EntityNotFoundException;

@Api(name = "tinypet", version = "v1", namespace = @ApiNamespace(ownerDomain = "tinypet", ownerName = "tinypet", packagePath = "services"))

public class PetitionEndpoint {

	@ApiMethod(name = "addPetition")
	public Entity addPetition(@Named("owner") String owner, @Named("title") String title) {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Entity petition = new Entity("Petition");
		petition.setProperty("title", title);
		List<String> sign = new ArrayList<String>();
		sign.add(owner);
		petition.setProperty("sign", sign);
		petition.setProperty("score", sign.size());
		petition.setProperty("owner", owner);
		datastore.put(petition);
		return petition;
	}

	@ApiMethod(name = "addSignature")
	public Entity addSignature(@Named("user") String user, @Named("petitionID") long petitionID)
			throws EntityNotFoundException {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Key key = KeyFactory.createKey("Petition", petitionID);
		Entity pet = datastore.get(key);
		List sign = (ArrayList<String>) pet.getProperty("sign");
		sign.add(user);
		pet.setProperty("sign", sign);
		pet.setProperty("score", sign.size());
		datastore.put(pet);
		return pet;
	}

	

	@ApiMethod(name = "listSelfPetition")
	public List<Entity> listSelfPetition(@Named("owner") String owner) {
		Query q = new Query("Petition").setFilter(new FilterPredicate("owner", FilterOperator.EQUAL, owner));
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		PreparedQuery pq = datastore.prepare(q);
		List<Entity> result = pq.asList(FetchOptions.Builder.withDefaults());
		return result;
	}
	
	@ApiMethod(name = "listAllPetitions")
	public List<Entity> listAllPetitions() {
		Query q = new Query("Petition");
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		PreparedQuery pq = datastore.prepare(q);
		List<Entity> result = pq.asList(FetchOptions.Builder.withDefaults());
		return result;
	}

	@ApiMethod(name = "getTop100Petitions")
	public List<Entity> getTopPetitions() {
		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
		com.google.appengine.api.datastore.Query q = new Query("Petition").addSort("score", SortDirection.DESCENDING);
		PreparedQuery pq = ds.prepare(q);
		List<Entity> results = pq.asList(FetchOptions.Builder.withLimit(100));
		return results;
	}

	@ApiMethod(name = "getPetitionsSignedByUser")
	public List<Entity> getPetitionsSignedByUser(@Named("user") String user) {
		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
		Filter f = new FilterPredicate("sign", FilterOperator.EQUAL, user);
		Query q = new Query("Petition").setFilter(f);
		PreparedQuery pq = ds.prepare(q);
		List<Entity> results = pq.asList(FetchOptions.Builder.withDefaults());
		return results;
	}

}