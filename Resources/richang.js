function Richang(attr){
	Ti.include("public.js");
	var win = Ti.UI.createWindow(attr);
	
	add_default_action_bar(win, win.title, true);
	
	var kid = null;
	var now = new Date();
	var today_str = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
	var g_today_str = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
	function calc_kid(){
		var record = require('/lib/mamashai_db').db.select_one_json("user_profile", user_id());
		if (!record.blank){
			var json = JSON.parse(record.json);
			if (json.user_kids.length > 0){
				kid = json.user_kids[0];
				var current_kid_id = Ti.App.Properties.getString("current_kid_id", "");
				if (current_kid_id != ""){
					for(var i=0; i<json.user_kids.length; i++){
						if (json.user_kids[i].id == parseInt(current_kid_id)){
							kid = json.user_kids[i];
							break;
						}
					}
				}
			}	
		}	
	}
	calc_kid();
	
	function make_jiance_view(){
				var container = Ti.UI.createView({
					top: 0,
					left: 0,
					bottom: 0,
					backgroundColor: "white",
					width: Ti.App.platform_width
				});
				
				var button_wrapper = Ti.UI.createView({
					top: __l(20),
					left: 0,
					bottom: 0,
					backgroundColor: "white",
					width: Ti.App.platform_width,
					layout: "horizontal"
				});
				container.add(button_wrapper);
				
				var yun = false;
				if (kid && kid.birthday){
					var birthday = new Date();
					birthday.setFullYear(kid.birthday.split("-")[0]);
					birthday.setMonth(parseInt(kid.birthday.split("-")[1], 10) - 1);
					birthday.setDate(parseInt(kid.birthday.split("-")[2], 10));
					var now = new Date();
					if (birthday.getTime() > now.getTime()){		//孕期
						yun = true;
					}
				}
				
				if (yun){
					var data = ["体重", "体温", "孕吐", "胎动", "睡眠", "营养", "孕检"];
					for(var i=0; i<data.length; i++){
						var aButton = Ti.UI.createButton({
							title : data[i],
							height : __l(55),
							width : Titanium.Platform.osname == 'ipad' ? __l(75) : __l(60),
							top : __l(10),
							bottom: __l(10),
							left: (Ti.App.platform_width-4*(Titanium.Platform.osname == 'ipad' ? __l(75) : __l(60)))/8,
							right: (Ti.App.platform_width-4*(Titanium.Platform.osname == 'ipad' ? __l(75) : __l(60)))/8,
							kind: data[i] + "_yun",
							font : {fontSize: __l(17)}
						});
						pre_btn(aButton)
						var now = new Date();
						var real_today = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
						if (today_str == g_today_str && g_today_str != real_today){
							today_str = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
							g_today_str = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
						}
						aButton.addEventListener("click", function(e){
							JiancePopup = require("lib/jiance_popup").jiance_popup;
							var popup = new JiancePopup(win, e.source.kind, kid, today_str, Ti.App.currentTabGroup.activeTab);
						})
						button_wrapper.add(aButton)
					}
				}
				else{
					var data = ["身高", "体重", "体温", "吃喝", "拉撒", "睡眠", "疫苗", "娱乐"]
					for(var i=0; i<data.length; i++){
						var aButton = Ti.UI.createButton({
							title : data[i],
							height : __l(55),
							width : Titanium.Platform.osname == 'ipad' ? __l(75) : __l(60),
							top : __l(10),
							bottom: __l(10),
							left: (Ti.App.platform_width-4*(Titanium.Platform.osname == 'ipad' ? __l(75) : __l(60)))/8,
							right: (Ti.App.platform_width-4*(Titanium.Platform.osname == 'ipad' ? __l(75) : __l(60)))/8,
							//left: __l(13),
							//right: __l(5),
							kind: data[i],
							font : {fontSize: __l(17)}
						});
						pre_btn(aButton)
						var now = new Date();
						var real_today = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
						if (today_str == g_today_str && g_today_str != real_today){
							today_str = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
							g_today_str = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
						}
						aButton.addEventListener("click", function(e){
							JiancePopup = require("lib/jiance_popup").jiance_popup;
							var popup = new JiancePopup(win, e.source.kind, kid, today_str, Ti.App.currentTabGroup.activeTab);
						});
						button_wrapper.add(aButton);
					}
				}
				return container;
	}
	
	var container = make_jiance_view();
	win.add(container);
	
	return win;
}


module.exports = Richang;
