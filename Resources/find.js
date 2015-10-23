function Find(attr){
	Ti.include("public.js");
	var win = Titanium.UI.createWindow(attr);
	
	Ti.App.find_win = win;
	
	var url = Ti.App.mamashai + "/bbrl_code/find2.txt";
	cache_http_call(url, 'find_2', function(e){
		eval(e.responseText);
	});
	
	var search = Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.SEARCH,
	});
	search.addEventListener("click", function(e){
		show_window("search", {
			title: "搜索"
		});
	});
				
	if (!Ti.App.is_android){
		win.setRightNavButton(search);
	}
	else{
		add_default_action_bar2(win, win.title, Ti.Android.R.drawable.ic_menu_search, function(){
			search.fireEvent("click");
		}, true);
	}
	
	logEvent('find');
	
	return win;
}

module.exports = Find;