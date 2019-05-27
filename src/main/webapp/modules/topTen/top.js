var TopTenPet = {
	list: [],
	onchange : m.redraw(),
	loadList: function() {
		return m.request({
			method: "GET",
			url: "https://tinypet-project.appspot.com/_ah/api/tinypet/v1/entitycollection"
		})
		.then(function(result) {
			TopTenPet.list = result.items;
	        	m.redraw(true);
	        	m.redraw();
	        })
	},
}

var TopTenPetView = {
	oninit: TopTenPet.loadList,
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
						),
					m("th", {"scope":"col"}, 
						"Signature"
						)
					]
					)
				),
			m("tbody", TopTenPet.list.map(function(item){
				return m("tr",
					[
						m("th", {"scope":"row", "class": "text-center"}, 
							TopTenPet.list.indexOf(item)+1
							),
						m("td", {"scope":"row", "class": "text-justify"}, 
							item.properties.title
							),
						m("td", {"class": "text-center"}, 
							item.properties.nbsign
							),
						m("td", {"class": "text-center"}, item.properties.sign.includes(window.userFullName) ? m(buttonDisabled) : m(buttonEnabled, {
							onsubmit: function(e) { 
								e.preventDefault(); window.log ? addSignTopPet.sign(item.key.id) : alert("Connection required.");
							}
						})),
					]
					)
			})
			)
			]
			)
	},	
}

var addSignTopPet = {
	list: [],
	sign: function(id) {
		return m.request({
			method: "POST",
			url: "https://tinypet-project.appspot.com/_ah/api/tinypet/v1/addSignature/" + encodeURIComponent(window.userFullName) + "/" + id
		})
		.then(function(result) {
			TopTenPet.loadList()
		})
	},
}

var TopTenPetIndex = {
	view: function() {
		return m("main", [
			m("h1", {class: "title"}, "Most 100 petitions"),
			m("div", {id: "box"}, m(TopTenPetView)),
			])
	}
}