function MessagePost(attr) {
	Ti.include("public.js");
	var win = Titanium.UI.createWindow(attr);
	add_default_action_bar2(win, win.title, "删除", function(e){
		right.fireEvent("click");
	});

	var right = Ti.UI.createButton({
		title : "删除"
	});
	right.addEventListener("click", function(e) {
		var alert_dialog = Titanium.UI.createAlertDialog({
			title : "提示",
			message : '删除私信后将不可恢复，确认删除吗！',
			buttonNames : ['再想想', '确定'],
		});
		alert_dialog.addEventListener("click", function(e2) {
			if (e2.index == 1) {
				http_call(Ti.App.mamashai + "/api/direct_messages/destroy2/" + win.id + "?" + account_str(), function(e) {
					show_notice(e.responseText);
					
					if (e.responseText != "无法删除此私信"){
						Ti.App.fireEvent("delete_message", {id: win.id});
					}
					win.close();
				});

			}
		});
		alert_dialog.show();
	});
	if (!Ti.App.is_android)
		win.setRightNavButton(right);

	win.addEventListener("open", function(e) {
		var tableview = Titanium.UI.createTableView({
			top : Ti.App.android_offset
		});
		win.add(tableview);

		function insert_rows_to_tableview(json) {
			var json_size = json.length;
			var data = [];
			for (var i = 0; i < json_size; i++) {
				var row = Ti.UI.createTableViewRow({
					height : Ti.UI.SIZE,
					json : json[i],
					className : 'posts',
					width : Ti.App.platform_width,
					selectedBackgroundColor : '#E8E8E8'
				});

				var user_logo = Ti.UI.createImageView({
					top : __l(8),
					left : __l(10),
					width : __l(30),
					height : __l(30),
					defaultImage : "./images/default.gif",
					hires : true
				});

				if (json[i].user.logo_url_thumb48.length > 0) {
					user_logo.image = "http://www.mamashai.com" + encodeURI(json[i].user.logo_url_thumb140);
				}

				var post = Ti.UI.createView({
					height : Ti.UI.SIZE,
					layout : 'vertical',
					left : __l(46),
					right : __l(8),
					top : 0,
					bottom : __l(8),
					touchEnabled : false
				});

				var top_section = Ti.UI.createView({
					height : __l(26),
					left : 0,
					top : 0,
					right : 0
				});

				var user = Ti.UI.createLabel({
					top : __l(8),
					left : 0,
					height : __l(18),
					font : {
						fontSize : __l(14)
					},
					color : "#333",
					text : json[i].user.name
				});

				var refer = Ti.UI.createLabel({
					top : __l(8),
					left : __l(150),
					right : 6,
					textAlign : 'right',
					height : __l(15),
					font : {
						fontSize : __l(13)
					},
					color : "gray",
					touchEnabled : false,
					text : referTime(json[i].created_at)
				});

				if (json[i].user.id != user_id()) {
					top_section.add(user);
				}
				top_section.add(refer);
				post.add(top_section);

				var content = Ti.UI.createLabel({
					top : __l(6),
					left : 0,
					right : __l(8),
					bottom : __l(8),
					height : Ti.UI.SIZE,
					font : {
						fontSize : __l(15)
					},
					color : "#333",
					touchEnabled : false,
					text : json[i].content
				});
				post.add(content);

				row.add(user_logo)
				row.add(post)

				if (json[i].user.id == user_id()) {
					user_logo.left = Ti.App.platform_width - __l(42), post.left = __l(8);
					post.right = __l(50);
					refer.textAlign = "left";
					refer.left = 0;
					row.className += "_me";
				}
				data.push(row);
			}
			tableview.setData(data);
		}


		tableview.addEventListener("click", function(e) {
			if (e.rowData.json.user.id == user_id())
				return;

			var optionsDialogOpts = {
				options : ['回复', '删除', '取消'],
				cancel : 2
			};

			var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
			dialog.addEventListener("click", function(e1) {
				if (e1.index == 0) {
					var win = Titanium.UI.createWindow({
						url : "write_message.js",
						title : "写私信",
						name : e.rowData.json.user.name,
						text : "回复" + e.rowData.json.user.name + "：",
						backgroundColor : '#fff',
						backButtonTitle : ""
					});
					pre(win);

					Ti.App.currentTabGroup.activeTab.open(win, {
						animated : true
					});
				} else if (e1.index == 1) {
					var alert_dialog = Titanium.UI.createAlertDialog({
						title : "提示",
						message : '删除私信后将不可恢复，确认删除吗！',
						buttonNames : ['再想想', '确定'],
					});
					alert_dialog.addEventListener("click", function(e2) {
						if (e2.index == 1) {
							http_call(Ti.App.mamashai + "/api/direct_messages/destroy/" + e.row.json.id + "?" + account_str(), function(e) {
								if (e.responseText == "ok") {
									show_notice("删除私信成功");
									tableview.deleteRow(e.row);
								} else
									show_notice("删除私信失败");
							});

						}
					});
					alert_dialog.show();
				}
			});
			dialog.show();
		});

		var xhr = Ti.Network.createHTTPClient();
		xhr.timeout = Ti.App.timeout;
		xhr.onerror = function() {
			hide_loading();
			show_timeout_dlg(xhr, Ti.App.mamashai + "/api/direct_messages/messages.json?id=" + win.id + "&" + account_str());
		};
		xhr.onload = function() {
			var json = JSON.parse(this.responseText);
			if (json.length > 0) {
				require('lib/mamashai_db').db.insert_json("column_books", win.id, this.responseText);
			}

			insert_rows_to_tableview(json);
			Titanium.App.fireEvent('hide_indicator');
		};

		var json_row = require('/lib/mamashai_db').db.select_with_check("message_posts", win.id);
		if (json_row.blank) {
			xhr.open('GET', Ti.App.mamashai + "/api/direct_messages/messages.json?id=" + win.id + "&" + account_str());
			xhr.send();
			show_loading();
		} else {
			insert_rows_to_tableview(JSON.parse(json_row.json));
		}

		function refresh_message() {
			tableview.data = [];
			xhr.open('GET', Ti.App.mamashai + "/api/direct_messages/messages.json?id=" + win.id + "&" + account_str());
			xhr.send();
			show_loading();
		}


		Ti.App.addEventListener("refresh_message", refresh_message);
		win.addEventListener("close", function(e) {
			Ti.App.removeEventListener("refresh_message", refresh_message);
		});
	});

	logEvent('message_posts');
	return win;
}

module.exports = MessagePost; 