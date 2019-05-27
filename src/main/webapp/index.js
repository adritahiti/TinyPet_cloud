window.userFullName = null;
window.log = false;

var urlBase = "https://tinypet-project.appspot.com/_ah/api/tinypet/v1/";

var buttonDisabled = {
	view: function() {
		return m("button", {"class":"btn btn-primary", "disabled":"disabled"}, "Already registered.")
	}
}
function onSignIn(googleUser) {
	var profile = googleUser.getBasicProfile();
	console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
	console.log('Name: ' + profile.getName());
	console.log('Image URL: ' + profile.getImageUrl());
	console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
	
	window.userFullName = profile.getName();

	var login = document.getElementById("login");
	var logout = document.getElementById("logout");
	login.classList.add("d-none");
	logout.classList.remove("d-none");
	window.log = true;
	m.redraw(true);
	m.route.set("/top");
}

function userSignOut(e) {
	let auth2 = gapi.auth2.getAuthInstance();
	auth2.userSignOut().then(function () {
		var login = document.getElementById("login");
		var logout = document.getElementById("logout");
		logout.classList.add("d-none");
		login.classList.remove("d-none");
		window.userFullName = null;
		window.log = false;
		m.redraw(true);
		m.route.set("/top");
	});
}

    var searchForm = {
    	view: function() {
    		return m("form", {
    			onsubmit: function(e) {
    				e.preventDefault()
    				searchPet.loadList()
    				m.route.set('/search');

    			},
    			"class":"form-inline mt-2 mt-md-0",
    		}, [
    		m("input", {
    			"class":"input-search form-control mr-sm-2",
    			"type":"text",
				"placeholder":"Search petitions",
    			oninput: function (e) {searchPet.current.user=e.target.value},
    			value: searchPet.current.user,
    		}),
    		m("button", {"class":"btn-search btn btn-primary","type":"submit"}, 
    			"Search"
    			)
    		])
    	},
    }

    var navigation = {
    	view: function() {
    		return m("div", {"class":"navbar navbar-expand-lg navbar-dark bg-dark fixed-top"}, 
    			m("div", {"class":"container-fluid"},
    			[
    				m("div", {"class":"navbar-header"},
    					[
    					m("span", {"class":"navbar-brand"}, 
    						"TinyPetition"
    						)
    					]
					),					
    				m("ul", {"class":"nav navbar-nav navbar-right"},
    					[
    					m("li", {"id":"login"}, 
    						m("div", {"class":"g-signin2 ","data-onsuccess":"onSignIn"})
    						),
    					m("li", {"class":"d-none","id":"logout","style":{"padding-left":"20px"}}, 
    						m("button", {"class":"btn btn-info","href":"#", onclick: userSignOut},
    							[
    							m("span", {"class":"glyphicon glyphicon-log-out"}),
    							"log out"
    							]
    						)
    					)]
					)
				])
			)
    	}
	}
	
	var menu = {
		view: function() {
            return m("div", {"class":"sidebar-sticky"}, 
                [
                    m(searchForm),
                    m("ul", {"class":"nav flex-column"},[
                        m("li", {"class":"nav-item"}, 
                            m("a", {"class":"dropdown-item","href":"/add", oncreate: m.route.link}, 
                                "Add petition"
                            )
                        ),
                        m("li", {"class":"nav-item"}, 
                            m("a", {"class":"dropdown-item","href":"/top", oncreate: m.route.link}, 
                                "Most 100 petition"
                            )
                        )	
                    ])
                ]
            )
		}
	}

    var myPet = {
    	list: [],
    	loadList: function() {
    		return m.request({
    			method: "GET",
    			url: urlBase + "entity/" + encodeURIComponent(window.userFullName)
    		})
    		.then(function(result) {
    			myPet.list = result.items
	        	m.redraw(true)
	        })
    	},
    	current: {},
    	save: function() {
    		return m.request({
    			method: "POST",
    			url: urlBase + "addPetition/"+ encodeURIComponent(window.userFullName) + "/" + myPet.current.name
    		})
    		.then(function(result) {
    			myPet.loadList()
    		})
    	}
    }

    var buttonEnabled = {
    	view: function(vnode) {
    		return m("form", vnode.attrs,
    			m("button", {"class":"btn btn-primary","type":"submit"}, "Sign")
    		)
    	}
    }


    var myPetViews = {
    	oninit: myPet.loadList,
    	view: function() {
    		return m("table", {"class":"table table-striped"},
    			[
    			m("thead", 
    				m("tr", {"class": "text-center"},
    					[
    					m("th", {"scope":"col"}, 
    						"#"
    						),
    					m("th", {"scope":"col"}, 
    						"Title"
    						),
    					m("th", {"scope":"col"}, 
    						"Number of signatures"
    						)
    					]
    					)
    				),
    			m("tbody", myPet.list.map(function(item){
    				return m("tr",
    					[
    					m("th", {"scope":"row", "class": "text-center"}, 
    						myPet.list.indexOf(item) + 1
    						),
    					m("td", {"scope":"row", "class": "text-justify"}, 
    						item.properties.title
    						),
    					m("td", {"class": "text-center"}, 
    						item.properties.nbsign
    						),
    					]
    					)
    		}))])
    	},	
    }

    var count = 0;

    var addPet = {
    	view: function() {
    		return m("main", [
    			m("h1", {class: "title"}, "All my petitions"),
    			m("div", {id: "form", class:"form-group"}, m(formToAdd)),
    			m("div", {id: "box"}, m(myPetViews)),
    			])
    	}
    }


    var formToAdd = {
    	view: function() {
    		return m("form", {
    			onsubmit: function(e) {
    				e.preventDefault();
    				window.log ? myPet.save() : alert("Connection required.");
    			}
    		}, [
    		m("label.label", "Petition title"),
    		m("input",{
    			oninput: function (e) {myPet.current.name=e.target.value},
    			value: myPet.current.name,
    			"class":"form-control",
    			"type":"text",
    			"placeholder":"Enter title"
    		}),
    		m("button", {"class":"btn btn-primary btn-margin-top","type":"submit"}, "Add"),
    		])
    	}
    }

var navBar = document.getElementById("navigation");
var menuVar = document.getElementById("menu");
var body = document.getElementById("body");

m.mount(navBar, navigation)
m.mount(menuVar, menu)

m.route(body, "/top", {
	"/add": addPet,
	"/top": TopTenPetIndex,
	"/search": searchUser,
})