Ti.include("public.js")

var win = Titanium.UI.currentWindow;
var url = Ti.App.mamashai + "/api/account/qzone_mobile";
if (win.id){
	url += "/" + win.id
}

if (Ti.App.is_android){
	url += "?from_android=true"
}

var webview = Ti.UI.createWebView({
	top: 0,
	url: url
});

webview.addEventListener('load',function(e) {
    if(!Ti.App.is_android){
	    var info = webview.evalJS("get_token_and_secret()"); 
	    if (info.length > 0)
	    {
	    	var json = JSON.parse(info);
	    	Ti.App.Properties.setString("userid", json.user.id);
	    	Ti.App.Properties.setString("email", json.user.email);
			Ti.App.Properties.setString("name", json.user.name);
			Ti.App.Properties.setString("login_type", "3");		//0:主站, 1:新浪 2:腾讯, 3:qzone
			Ti.App.Properties.setString("qzone_token", json.token);
			Ti.App.Properties.setString("qzone_secret", json.secret);
			Ti.App.Properties.setString("token_type", "qzone");
			Ti.App.Properties.setString("qzone_expire_at", json.expire_at);
			
	    	require('lib/mamashai_db').db.insert_json("user_profile", json.user.id, JSON.stringify(json.user));
			Titanium.UI.currentWindow.close();
			Ti.App.fireEvent("qzone_login");
	    }
    }
    else{
    	if (e.url.indexOf("blank?")>0){
    		var param_url = e.url.split("blank?")[1]
    		var _params = param_url.split('&')
    		var params = {}
    		for(var i=0; i<_params.length; i++){
    			var s = _params[i]
    			params[s.split('=')[0]] = s.split('=')[1]
    		}
    		
    		Ti.App.Properties.setString("userid", params.user_id);
	    	Ti.App.Properties.setString("email", params.email);
			Ti.App.Properties.setString("name", params.user_name);
			Ti.App.Properties.setString("login_type", "3");		//0:主站, 1:新浪 2:腾讯, 3:qzone
			Ti.App.Properties.setString("qzone_token", params.token);
			Ti.App.Properties.setString("qzone_secret", '');
			Ti.App.Properties.setString("token_type", "qzone");
			Ti.App.Properties.setString("qzone_expire_at", params.expire_at);
			
			var xhr = Ti.Network.createHTTPClient()
			xhr.timeout = Ti.App.timeout
			xhr.onerror = function() {
					if (Titanium.Network.online){
						show_notice("获取数据失败");
						show_timeout_dlg(xhr, url);	
					}
			}
			xhr.onload = function() {
					require('lib/mamashai_db').db.insert_json("user_profile", params.user_id, this.responseText)
					win.close();
					Ti.App.fireEvent("qzone_login");
			}
			var url = Ti.App.mamashai + "/api/users/show/" + params.user_id + "?" + account_str();
			xhr.open('GET', url);
			xhr.send();
    	}
    }
});

Titanium.UI.currentWindow.add(webview);

logEvent('qzone');

add_default_action_bar(win, win.title, true)
