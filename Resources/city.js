function CityWindow(attr){
	Ti.include("public.js");
	
	var win = Titanium.UI.createWindow(attr);
	
	var url = Ti.App.mamashai + "/api/provinces";
	cache_http_call(url, 'select_city', function(e){
		var json = JSON.parse(e.responseText);
		var tableview = Titanium.UI.createTableView({
			separatorColor : "#ccc",
			backgroundColor: '#e8e8e8',
			top : 0
		});
		
		for(var i=0; i<json.length; i++){
			var province_row = Ti.UI.createTableViewRow({
				height : Ti.App.is_android ? __l(40) : __l(36),
				hasChild : Ti.App.is_android ? false : true,
				selectedBackgroundColor: "#E8E8E8",
				backgroundColor: win.s_province == json[i].name ? '#FEE' : 'white',
				name: json[i].name,
				id: json[i].id,
				cities: json[i].cities,
				className: 'province'
			});
			
			province_row.add(Ti.UI.createLabel({
				top : Ti.App.is_android ? __l(11) : __l(9),
				bottom : Ti.App.is_android ? __l(11) : __l(9),
				left : __l(20),
				height : __l(18),
				width: Ti.UI.SIZE,
				font : {
					fontSize : __l(15)
				},
				color: "#333",
				text : json[i].name,
				touchEnabled : false
			}));
			
			if (Ti.App.is_android){
				province_row.add(Ti.UI.createImageView({
					right: __l(10),
					top: __l(11),
					bottom: __l(11),
					width: __l(18),
					height: __l(18),
					touchEnabled: false,
					image: "/images/table_right.png"
				}));
			}
			tableview.appendRow(province_row);
		}
		tableview.addEventListener("click", function(e){
			var json_cities = e.rowData.cities;
			var win_city = Titanium.UI.createWindow({
				title: "选择地区",
				backgroundColor: 'white',
				province: e.rowData.name,
				province_id: e.rowData.id,
				backButtonTitle: ""
			});
			var tableview_cities = Titanium.UI.createTableView({
				separatorColor : "#ccc",
				backgroundColor: '#e8e8e8',
				top : 0
			});
			if (win.filter)
				json_cities = [{id: 0, name: '全部'}].concat(json_cities);
			for(var i=0; i<json_cities.length; i++){
				var city_row = Ti.UI.createTableViewRow({
					height : Ti.App.is_android ? __l(40) : __l(36),
					hasChild : Ti.App.is_android ? false : true,
					selectedBackgroundColor: "#E8E8E8",
					backgroundColor: win.s_city == json_cities[i].name ? '#FEE' : 'white',
					id: json_cities[i].id,
					city : json_cities[i].name,
					className: 'city'
				});
				
				city_row.add(Ti.UI.createLabel({
					top : Ti.App.is_android ? __l(11) : __l(9),
					bottom : Ti.App.is_android ? __l(11) : __l(9),
					left : __l(20),
					height : __l(18),
					width: Ti.UI.SIZE,
					font : {
						fontSize : __l(15)
					},
					color: "#333",
					text : json_cities[i].name,
					touchEnabled : false
				}));
				
				if (Ti.App.is_android){
					city_row.add(Ti.UI.createImageView({
						right: __l(10),
						top: __l(11),
						bottom: __l(11),
						width: __l(18),
						height: __l(18),
						touchEnabled: false,
						image: "/images/table_right.png"
					}));
				}
				tableview_cities.appendRow(city_row);
			}
			tableview_cities.addEventListener("click", function(e){
				win_city.close();
				win.close();
				
				if (e.rowData.id == 0){
					Ti.App.fireEvent("select_city", {
						province_name: win_city.province,
						province_id: win_city.province_id	
					});
				}
				else{
					Ti.App.fireEvent("select_city", {
						city_id: e.rowData.id, 
						city_name: e.rowData.city,
						province_name: win_city.province,
						province_id: win_city.province_id	
					});
				}
			});
			win_city.add(tableview_cities);
			add_default_action_bar(win_city, win_city.title, true);
			Ti.App.currentTabGroup.activeTab.open(win_city, {
				animated : true
			});
		});
		win.add(tableview);
	});		

	add_default_action_bar(win, win.title, true);
	
	return win;
}

module.exports = CityWindow;
