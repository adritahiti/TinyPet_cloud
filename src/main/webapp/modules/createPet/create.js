var MyPet = {
	list: [],
	loadList: function() { // load my petition
		return m.request({
			method: "GET",
			url: "https://tinypet-m1-miage.appspot.com/_ah/api/tinypet/v1/entity/" + encodeURIComponent(window.userFullName)
		})
		.then(function(result) {
			MyPet.list = result.items
	        	m.redraw(true)
	        })
	},
	current: {},
	add: function() { // add my new petition
		return m.request({
			method: "POST",
			url: "https://tinypet-m1-miage.appspot.com/_ah/api/tinypet/v1/addPetition/" + encodeURIComponent(window.userFullName) + "/" + MyPet.current.title
		})
		.then(function(result) {
			MyPet.loadList()
		})
	}
}

// petition view html
var MyPetView = {
	oninit: MyPet.loadList,
	view: function() {
		return m("table", {"class":"table table-striped"},
			[
			m("thead", 
				m("tr", {"class": "text-center"},
					[
					m("th", {"scope":"col"}, 
						"Title"
						),
					m("th", {"scope":"col"}, 
						"Number of signatures"
						)
					]
					)
				),
			m("tbody", MyPet.list.map(function(item){
				return m("tr",
					[
					m("td", {"scope":"row", "class": "text-justify"}, 
						item.properties.title
						),
					m("td", {"class": "text-center"}, 
						item.properties.nbsign
						)
					]
					)
			})
			)
			]
			)
	},	
}

// create petition view html
var createPet = {
	view: function() {
		return m("main", [
			m("h1", {class: "title"}, "Create a petition"),
			m("div", {id: "form"}, window.log ? m(formToAdd) : m(needConnectCreate)),
			m("br"),
			m("h2", {class: ""}, "All my petitions"),
			m("div", {id: "box"}, m(MyPetView)),
			])
	}
}

// message of connection required
var needConnectCreate = {
	view: function() {
		return m("h1", {class: "title"}, "Connection required to create a petition.")
	}
}

// form to create a new petition
var formToAdd = {
	view: function() {
		return m("form", {
			onsubmit: function(e) {
				e.preventDefault();
				MyPet.add();
			}
		}, [
		m("label.label", "Title of petition"),
		m("input",{
			oninput: function (e) {MyPet.current.title=e.target.value},
			value: MyPet.current.title,
			"class":"form-control",
			"type":"text",
			"placeholder":"Enter title"
		}),
		m("button", {"class":"btn btn-primary","type":"submit"}, "Add a petition"),
		])
	}
}