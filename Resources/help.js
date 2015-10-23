function Help(attr){
	Ti.include("public.js");
	var win = Titanium.UI.createWindow(attr);
	
	win.addEventListener("open", function(e){
		var scrollableView = Ti.UI.createScrollableView({
			showPagingControl : true,
			backgroundColor: "white",
			pagingControlColor : Ti.App.bar_color
		});
		
		win.add(scrollableView);
		
		var view1 = Ti.UI.createView({
			backgroundColor: "white",
		});
		var img1 = Ti.UI.createView({
			top: 0,
			width: __l(320),
			height: __l(460),
			hires : true,
			backgroundImage : "./images/start/1.png"
		});
		view1.add(img1);
		scrollableView.addView(view1);
		
		var view2 = Ti.UI.createView({
			backgroundColor: "white",
		});
		var img2 = Ti.UI.createView({
			top: 0,
			width: __l(320),
			height: __l(460),
			hires : true,
			backgroundImage : "./images/start/2.png"
		});
		view2.add(img2);
		scrollableView.addView(view2);
		
		var view3 = Ti.UI.createView({
			backgroundColor: "white",
		});
		var img3 = Ti.UI.createView({
			top: 0,
			width: __l(320),
			height: __l(460),
			hires : true,
			backgroundImage : "./images/start/3.png"
		});
		view3.add(img3);
		scrollableView.addView(view3);
		/*
		var view4 = Ti.UI.createView({
			backgroundColor: "white",
		});
		var img4 = Ti.UI.createView({
			top: 0,
			width: __l(320),
			height: __l(460),
			hires : true,
			backgroundImage : "./images/start/4.png"
		});
		view4.add(img4);
		scrollableView.addView(view4);
	*/
		var aButton = Ti.UI.createImageView({
			backgroundImage: Titanium.Platform.osname == 'ipad' ?  "./images/start/anniu2.png" : "./images/start/anniu@2x.png",
			hires: true,
			height : __l(42),
			width : __l(164),
			//top : __l(340),
			bottom: Ti.App.is_android ? __l(36) : __l(10),
			left : (Ti.App.platform_width - __l(164))/2,
			style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN
		});
		
		aButton.addEventListener('click', function() {
			if (Ti.App.is_android){
				win.close();
			}
			else{
				win.animate({opacity: 0, duration: 800}, function(){
					win.close();
				});
			}
				
		});
		view3.add(aButton);
		
		if (Ti.App.is_android)
			scrollableView.add(Ti.UI.createView({
				bottom: 0,
				left: 0,
				right: 0,
				height: __l(24),
				backgroundColor: '#ddd'
			}));
		add_android_scroll_ind(scrollableView, Ti.App.platform_width);
	});
	
	return win;
}

module.exports = Help