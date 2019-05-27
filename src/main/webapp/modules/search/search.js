// add a signature
var searchAddSign = {
	list: [],
	sign: function(id) {
		return m.request({
			method: "POST",
			url: "https://tinypet-project.appspot.com/_ah/api/tinypet/v1/addSignature/" + encodeURIComponent(window.userFullName) + "/" + id
		})
		.then(function(result) {
			searchPet.loadList()
		})
	},
}

// url to search petition
var searchPet = {
	list: [],
	loadList: function() {
		return m.request({
			method: "GET",
			url: "https://tinypet-project.appspot.com/_ah/api/tinypet/v1/entitycollection/" + searchPet.current.user
		})
		.then(function(result) {
			searchPet.list = result.items
	        	m.redraw(true)
	        })
	},
	current: {},
}

// search user
var searchUser = {
	view: function() {
		return m("main", [
			m("h1", {class: "title"}, "Signatures"),
			m("div", {id: "box"}, m(searchPetitionView)),
			])
	}
}

// result of the search in table html
var searchPetitionView = {
	oninit: searchPet.loadList,
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
						),
					m("th", {"scope":"col"}, 
						"Signature"
						)
					]
					)
				),
			m("tbody", searchPet.list.map(function(item){
				return m("tr",
					[
					m("td", {"scope":"row", "class": "text-justify"}, 
						item.properties.title
						),
					m("td", {"class": "text-center"}, 
						item.properties.nbsign
						),
					m("td", {"class": "text-center"}, 
					item.properties.sign.includes(window.userFullName) ? m(buttonDisabled) : m(buttonEnabled, {
						onsubmit: function(e) { 
							e.preventDefault(); window.log ? searchAddSign.sign(item.key.id) : alert("Connection required.");
						}
					})),
					]
					)
			})
			)])
	},	
}