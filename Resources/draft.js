function Draft(attr){
	Ti.include("public.js");
	var win = Titanium.UI.createWindow(attr);
	
	var clear = Titanium.UI.createButton({
			title: "清空"
	});
	if (!Ti.App.is_android){
			win.setRightNavButton(clear);
	}
	else{
			add_default_action_bar2(win, win.title, Ti.Android.R.drawable.ic_menu_delete, function(){
				clear.fireEvent("click");
			});
	}
	
	win.addEventListener("open", function(e){
		var tableview = Titanium.UI.createTableView({
			backgroundColor : 'transparent',
			rowBackgroundColor : 'white',
			top : 0
		});
		
		win.add(tableview)
		
		function select_all_draft(){
			var result = []
			var record = Ti.App.db.execute('SELECT * FROM drafts where user_id=?', user_id());
			while (record.isValidRow())
			{
			  var content 		= record.fieldByName('content');
			  var pic 			= record.fieldByName('pic');
			  var kind 			= record.fieldByName('kind');
			  var created_at 	= record.fieldByName('created_at');
			  
			  result.push([content, pic, kind, created_at])
			  record.next();
			}
			record.close();
			return result;
		}
		
		var drafts = select_all_draft()
		if (drafts.length == 0)
			show_notice("草稿箱是空的");
		
		function make_draft_tableview(drafts){
			tableview.data = []
			
			for(var i=0; i<drafts.length; i++){
				var row = Ti.UI.createTableViewRow({
					height : 'auto',
					hasChild : true,
					tag : drafts[i][0],
					selectedBackgroundColor : "#E8E8E8",
					arr : drafts[i]
				});
				
				var title = Ti.UI.createLabel({
					left : __l(10),
					right : __l(10),
					top : __l(12),
					bottom : __l(12),
					height : 'auto',
					font : {
						fontSize : __l(14)
					},
					color: "#333",
					text : drafts[i][0]
				});
				row.add(title)
				tableview.appendRow(row)
			}
		}
		
		make_draft_tableview(drafts)
		if (drafts.length == 0){
			win.addEventListener("open", function(e){
				show_notice("发布未成功的记录保存在这里")
			});
		}
		
		tableview.addEventListener('click', function(e) {
			var WritePost = require("write_post")
			var win = new WritePost({
				title : "随便记记",
				backgroundColor : '#fff',
				text : e.rowData.arr[0],
				kind : e.rowData.arr[2],
				//image : e.rowData.arr[1],
				from : e.rowData.arr[2],
				draft: e.rowData.arr[0]
			});
			if (!Ti.App.is_android)
				win.image = e.rowData.arr[1];
				
			pre(win);
			win.backButtonTitle = '';
			Ti.App.currentTabGroup.activeTab.open(win, {
				animated : true
			});
		});
		
		function delete_draft(content){
			Ti.App.db.execute("delete from drafts where content=?", content)
		}
		
		function delete_draft_(e){
			delete_draft(e.tag);
			var drafts = select_all_draft();
			make_draft_tableview(drafts)
		}
		Ti.App.addEventListener("delete_draft", delete_draft_)
		win.addEventListener("close", delete_draft_)
		
		
		clear.addEventListener("click", function(e){
			Ti.App.db.execute("delete from drafts");
			make_draft_tableview([])
		})
		
		
		
		logEvent('draft');
	});
	
	return win;
}

module.exports = Draft;
