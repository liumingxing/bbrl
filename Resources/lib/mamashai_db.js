var Mamashai = Mamashai || {};
Mamashai.db = {};

Mamashai.show_window = function(file, attr){
	s = file.split("/");
	s = "_code_" + s[s.length-1];
	
	cache_http_call(file, s, function(e){
			var User = eval(e.responseText);
			
			attr.backButtonTitle = "";
			attr.backgroundColor = "white";
			var win = new User(attr);
			
			if (!Ti.App.is_android) {
				win.hideTabBar();
			}
			Ti.App.currentTabGroup.activeTab.open(win, {
				animated : true
			});
	});
	return;
};

//数据库操作
Mamashai.db.insert_json = function(json_type, id, json) {
	var now = new Date();
	var mili_seconds = now.getTime();
	Ti.App.db.execute('delete from jsons where json_type = ? and id = ?', json_type, id + "")
	Ti.App.db.execute('INSERT INTO jsons (json_type, id, json, created_at) VALUES (?,?,?,?)', json_type, id + "", json, mili_seconds);
	Ti.API.log("insert json " + json_type + " " + id)
};

Mamashai.db.insert_json_if_not_exist = function(json_type, id, json) {
	var now = new Date();
	var record = Ti.App.db.execute('SELECT * FROM jsons where json_type=? and id=?', json_type, id + "");
	if (!record.isValidRow()){
		var mili_seconds = now.getTime();
		Ti.App.db.execute('INSERT INTO jsons (json_type, id, json, created_at) VALUES (?,?,?,?)', json_type, id + "", json, mili_seconds);
		Ti.API.log("insert json " + json_type + " " + id)
	}
};

Mamashai.db.select_one_json = function(json_type, id) {
	var record = Ti.App.db.execute('SELECT * FROM jsons where json_type=? and id=?', json_type, id + "");
	Ti.API.log("select json " + json_type + " " + id)
	var result = null;
	if(record.isValidRow()) {
		result = {
			json : record.fieldByName('json'),
			created_at : record.fieldByName('created_at'),
			blank : false
		}

	} else {
		result = {
			blank : true
		}
	}

	record.close();
	return result;
};

Mamashai.db.select_with_check = function(json_type, id) {
	var record = Mamashai.db.select_one_json(json_type, id)
	var now = new Date();

	//数据3天过期
	if(Titanium.Network.online && !record.blank && now.getTime() - record.created_at > 1000 * 3600 * 24 * 3) {
		Mamashai.db.delete_one_json(json_type, id);
		return {blank: true}
	}
	return record
};

Mamashai.db.delete_one_json = function(json_type, id) {
	Ti.App.db.execute("delete from jsons where json_type=? and id=?", json_type, id)
}

module.exports = Mamashai
