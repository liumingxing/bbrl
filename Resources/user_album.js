function UserAlbum(attr){
	Ti.include("public.js");
	
	var win = Titanium.UI.createWindow(attr);
	
	var book_wrapper = Ti.UI.createScrollView({
		left: 0,
		top: __l(0),
		right: 0,
		bottom: 0,
		contentWidth: Ti.App.platform_width,
		contentHeight: 'auto',
		width: Ti.App.platform_width,
		showVerticalScrollIndicator: true,
		layout: "horizontal"
	})
	win.add(book_wrapper)
	
	var more_button = Titanium.UI.createButton({
		top : __l(10),
		bottom : __l(20),
		left : Titanium.Platform.osname == 'ipad' ? 104 : 20,
		width : Ti.App.platform_width - (Titanium.Platform.osname == 'ipad' ? 208 : 40),
		height : __l(40),
		title : "更多",
		font : {fontSize: __l(18)}
	});
	pre_btn(more_button)
	var page = 1
	more_button.addEventListener("click", function(){
		show_loading();
		page += 1;
		var url2 = url + "&page=" + page
		http_call(url2, callback)
	})
	
	logEvent('user_album');
	add_default_action_bar(win, win.title, true);
	
	show_loading();
	
	var url = Ti.App.mamashai + "/api/mbook/album_list2/" + win.id + "?1=1"
	if (win.id == user_id()){
		url += "&all=true"
	}
	
	function callback(e){
			var json = JSON.parse(e.responseText);
			if (book_wrapper.has_more){
				book_wrapper.remove(more_button);
				book_wrapper.has_more = false;
			}	
			
			for(var i=0; i<json.length; i++){
				var tiny_wrapper = Ti.UI.createView({
					width : __l(150),
					height : __l(144),
					left : Ti.App.is_ipad ? __l(20) : __l(5),
					right : Ti.App.is_ipad ? __l(20) : __l(5),
					top : __l(8)
				});
				if (Ti.App.is_android && Ti.App.platform_width > __l(310)){
					var diff = (Ti.App.platform_width-__l(151)*2)/4
					tiny_wrapper.left = diff
					tiny_wrapper.right = diff 
				}
				
				var bg = Ti.UI.createImageView({
					hires: true,
					image: "/images/album_book_bg2.png",
					width: __l(150),
					height: __l(143),
					left: 0,
					top: 0,
					zIndex: 2,
					touchEnabled: false
				});
				
				var face = Ti.UI.createImageView({
					width : __l(135),
					height : __l(135),
					top : __l(4),
					left: __l(7.5),
					hires : true,
					id: json[i].id,
					json : json[i],
					zIndex: 1,
					defaultImage : '/images/default.gif',
					image : "http://www.mamashai.com" + json[i].logo_url_thumb300
				});
				tiny_wrapper.face = face;
				
				var name_wrapper = Ti.UI.createView({
					width : __l(135),
					height : __l(26),
					top : __l(114),
					left: __l(7),
					backgroundColor: 'black',
					opacity: 0.5,
					zIndex: 3
				});
				
				var name = Ti.UI.createLabel({
					font:{fontSize:__l(13)},
					text: json[i].name,
					color:'white',
					textAlign:'center',
					width : __l(135),
					height : __l(26),
					top : __l(114),
					left: __l(7),
					zIndex: 4
				});
				tiny_wrapper.add(name_wrapper)
				tiny_wrapper.add(name)
				
				face.addEventListener("click", function(e) {
					var AlbumMv = require('album_mv')
					var win = new AlbumMv({
						title : e.source.json.name,
						backgroundColor : '#78A1A7',
						json : e.source.json,
						id : e.source.id,
						backButtonTitle: ''
					});
					pre(win)
							
					Ti.App.currentTabGroup.activeTab.open(win, {
						animated : true
					});
					
				});
			
				tiny_wrapper.add(face);
				tiny_wrapper.add(bg);
				
				var shadow = Ti.UI.createImageView({
					top : __l(50),
					left : __l(55),
					width : __l(40),
					height : __l(40),
					image : "/images/video_mask.png",
					zIndex : 11,
					touchEnabled: false
				});
				
				tiny_wrapper.add(shadow);
				
				book_wrapper.add(tiny_wrapper)
			}
			
			hide_loading();
			
			if (json.length == 10){
				book_wrapper.add(more_button);
				book_wrapper.has_more = true;
			}
	}
	http_call(url, callback)
	
	return win;
}

module.exports = UserAlbum;
