function AlbumSucai(attr){
	Ti.include("public.js");
	var Mamashai = require("lib/mamashai_ui");
	Mamashai.ui.tab = Ti.App.currentTabGroup.activeTab
	
	var page_count = 16
	
	var win = Titanium.UI.createWindow(attr);
	win.backButtonTitle = "";
	
	var done = Titanium.UI.createButton({
		title : '确定',
	});
	done.addEventListener("click", function(e){
		var selected_rows = 0;
		for(var i=0; i<tableview.data.length; i++){
			var section = tableview.data[i];
			for(var j=0; j<tableview.data[i].rows.length; j++){
				if (tableview.data[i].rows[j].hasCheck)
					selected_rows += 1
			}
		}
		
		if (selected_rows > page_count){
			show_alert("对不起", "最多只能选择16条素材")
			return;
		}
		selected.sort(function(a, b){
			return a.created_at > b.created_at ? 1 : -1
			//return a.id - b.id
		})
		var jsons = [];
		for(var i=0; i<selected.length; i++){
			var json = {content : selected[i].content,
								logo_url : selected[i].logo_url,
								logo_url_thumb400 : selected[i].logo_url_thumb400,
								created_at : selected[i].created_at,
								from: selected[i].from,
								imageSize: selected[i].imageSize
			}
					
			jsons.push(json)
		}
		win.close();
		Ti.API.log(Ti.App.parent)
		Ti.App.parent.fireEvent("mbook.new2", {name: win.name, template_id: win.template_id, sucai: jsons})
	});
	
	var label_wrapper = Ti.UI.createView({
		top: 0, 
		height: __l(40),
		left: 0,
		right: 0,
	});
	
	var header_label = Ti.UI.createLabel({
		font:{fontSize:__l(14)},
		text: win.mode == "single" ? "只能选择一条" : "已选择0条，最多选中16条",
		color:'#31457C',
		textAlign:'left',
		left:__l(10),
		height: __l(40),
		width: __l(300)
	});
	label_wrapper.add(header_label);
		
	var filter_button = Ti.UI.createButton({
		title : "选择月份",
		height : __l(30),
		width : __l(80),
		right: __l(40),
		font: {fontSize: __l(14)}
	});
	filter_button.addEventListener("click", function(e){
		var cancel =  Titanium.UI.createButton({
			title: '取消',
			style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
		});
		
		cancel.addEventListener('click',function() {
			win.remove(toolbar)
			win.remove(picker)
			win.add(tableview)
		});
		
		var done =  Titanium.UI.createButton({
			title:'确定',
			style:Titanium.UI.iPhone.SystemButtonStyle.DONE
		});
		
		done.addEventListener('click',function() {
			win.remove(toolbar)
			win.remove(picker)
			win.remove(tableview)
			
			var year_row = picker.getSelectedRow(0)
			var month_row = picker.getSelectedRow(1)
			tableview = null;
			
			var url = Ti.App.mamashai + "/api/statuses/user_timeline.json?1=1&cond=posts.forward_post_id is null and posts.created_at <= '" + year_row.custom_item + "-" + month_row.custom_item + "-31'"
			tableview = Mamashai.ui.make_weibo_tableview("my", url, user_id(), "posts")
			tableview.make_row_callback = make_post_row;
			tableview.addEventListener("click", row_click)
			tableview.top = __l(40)
			win.add(tableview)
			tableview.send()
		});
		
		var spacer =  Titanium.UI.createButton({
			systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});
		var l = Ti.UI.createLabel({
				text: "请选择月份",
				color: Ti.App.ios7 ? 'black' : 'white',
				font:{fontSize: 15},
				width: __l(200),
				textAlign: "center"
		});
		var toolbar =  Titanium.UI.createToolbar({
			bottom: 216,
			items:[cancel, spacer, l, spacer, done]
		});	
		if (!Ti.App.ios7)
			toolbar.barColor = Ti.App.bar_color;
		win.remove(tableview)
		win.add(toolbar)
		
		var picker = Ti.UI.createPicker({bottom: __l(0)});
		
		var column1 = Ti.UI.createPickerColumn({opacity:0});
		var now = new Date();
		for(var i=now.getFullYear() - 4; i< now.getFullYear(); i++){
			column1.addRow(Ti.UI.createPickerRow({title: "      " + i + '年', custom_item: i}));
		}
		column1.addRow(Ti.UI.createPickerRow({title: "      " + i + '年', custom_item: i, selected:true}));
		
		var column2 = Ti.UI.createPickerColumn();
		for(var i=1; i<=page_count; i++){
			column2.addRow(Ti.UI.createPickerRow({title: "      " + i + '月', custom_item: i}));
		}
		picker.add([column1,column2]);
		picker.setSelectedRow(0, 2, false);
		
		picker.selectionIndicator = true;
		win.add(picker);
	});
	if (!Ti.App.is_android)
		label_wrapper.add(filter_button);
	
	win.add(label_wrapper);
	
	var url = Ti.App.mamashai + "/api/statuses/user_timeline.json?1=1&cond=forward_post_id is null";
	var tableview = Mamashai.ui.make_weibo_tableview("my", url, user_id(), "posts");
	tableview.top = __l(40);
	win.add(tableview);
	
	var kid = null;
	var current_kid_id = Ti.App.Properties.getString("current_kid_id", "")
	var record = require('/lib/mamashai_db').db.select_one_json("user_profile", user_id())
	if (!record.blank){
		var json = JSON.parse(record.json)
		if (json.user_kids.length > 0){
			kid = json.user_kids[0]
	
			if (current_kid_id != ""){
				for(var i=0; i<json.user_kids.length; i++){
					if (json.user_kids[i].id == parseInt(current_kid_id)){
						kid = json.user_kids[i]
						break;
					}
				}
			}
		}
	}
		
	function make_post_row(json) {
		var row = Ti.UI.createTableViewRow({
			height : __l(70),
			name : json.title,
			id : json.id,
			selectedBackgroundColor : '#fee',
			json: json,
			hasCheck: false,
			className : json.logo_url_thumb120 ? 'post_logo' : 'post_text'
		})
	
		if(json.logo_url_thumb120 && json.logo_url_thumb120.length > 0) {
			var logo_wrapper = Ti.UI.createView({
				top: __l(5),
				left: __l(5),
				width: __l(60),
				height: __l(60)
			})
			var logo = Ti.UI.createImageView({
				//top : 0,
				left : 0,
				//bottom: 0,
				right: 0,
				height: Ti.UI.SIZE,
				width: __l(60),
				hires: true,
				row: row,
				touchEnabled : false
			});
			logo_wrapper.add(logo)
			logo.addEventListener("load", function(e){
				if (!Ti.App.is_android){
					var imageSize = e.source.toImage()
					e.source.row.imageSize = {width: imageSize.width, height: imageSize.height}
					imageSize = null;
				}
			})	
			
			if (Ti.App.is_android){
				logo.width = Ti.UI.SIZE;
				logo.image = "http://www.mamashai.com" + encodeURI(json.logo_url_thumb120);
			}
			else{
				logo.image = "http://www.mamashai.com" + encodeURI(json.logo_url_thumb120);
			}
			
			row.add(logo_wrapper);
		}
				
		var refer = Ti.UI.createLabel({
			top : __l(4),
			left : json.logo_url_thumb120 ? __l(70) : __l(7),
			right : __l(4),
			textAlign : 'left',
			height : __l(18),
			font : {
				fontSize : __l(13)
			},
			color : "gray",
			text : referDay(json.created_at) + " " + kid_desc(kid, json.created_at),
			touchEnabled : false
		});
		row.add(refer);
		
		var content = Ti.UI.createLabel({
			top : __l(26),
			left : json.logo_url_thumb120 ? __l(70) : __l(7),
			right : __l(10),
			textAlign : 'left',
			height : __l(34),
			font : {
				fontSize : __l(14)
			},
			color : "#333",
			text : json.content.replace(/(^\s*)|(\s*$)/g, "").replace("\n", ""),
			touchEnabled : false
		});
		row.add(content);
		
		return row;
	}
	
	tableview.make_row_callback = make_post_row;
	tableview.no_click = true
	win.addEventListener("open", function(e){
		if (win.json){
			tableview.insert_rows_to_tableview(win.json.slice(0, 30));
		}
		else{
			tableview.send()
		}
	});
	
	var selected = new Array;
	function add_selected(json){
		for(var i=0; i<selected.length; i++){
			if (selected[i].id == json.id)
				return
		}
		
		selected.push(json)
	}
	
	function remove_selected(json){
		for(var i=0; i<selected.length; i++){
			if (selected[i].id == json.id){
				selected.splice(i, 1);
				return;
			}
				
		}
	}
	
	function row_click(e){
		if (e.source.className != "post_logo" && e.source.className != "post_text")
			return;
	
		//单选一个素材
		if (win.mode == "single"){
			var json = {content : e.source.json.content,
						logo_url : e.source.json.logo_url,
						logo_url_thumb400 : e.source.json.logo_url_thumb400,
						created_at : e.source.json.created_at,
						from: e.source.json.from,
						imageSize: e.source.imageSize
			}
			
			Ti.App.parent.fireEvent("select_sucai", {json: json})
			win.close()
			return;
		}
		
		var selected_rows = 0
		for(var i=0; i<tableview.data.length; i++){
			var section = tableview.data[i];
			for(var j=0; j<tableview.data[i].rows.length; j++){
				if (tableview.data[i].rows[j].hasCheck)
					selected_rows += 1
			}
		}
		
		e.source.hasCheck = !e.source.hasCheck;
		if (selected.length >= page_count && e.source.hasCheck){
			show_alert("提示", "最多只能选定16页哦");
			e.source.hasCheck = false;
			e.source.backgroundColor = "#fff";
			remove_selected(e.source.json);
			return;
		}
		
		if (e.source.hasCheck){
			e.source.backgroundColor = "#fEE"
			var json = e.source.json
			json.imageSize = e.source.imageSize
			add_selected(json)
		}
		else{
			e.source.backgroundColor = "#fff"
			remove_selected(e.source.json)
		}
		
		
		header_label.text = "已选择" + selected.length + "条，最多可选16条"
	}
	tableview.addEventListener("click", row_click)
	
	if (!Ti.App.is_android)
		win.setRightNavButton(done);
	else{
			if (win.mode == "single"){
				add_default_action_bar(win, win.tite, true)
			}
			else{
				add_default_action_bar2(win, win.title, "确定", function(){
					done.fireEvent("click");
				});
			}
	}
	
	logEvent('album_sucai');
	return win;
}

module.exports = AlbumSucai;
