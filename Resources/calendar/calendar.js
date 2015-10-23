var selectDate = function(){
	var thisWindow = Ti.UI.currentWindow;
	var mainView = Ti.UI.createView({width:320,height:480,bottom:-480, backgroundColor: 'black', opacity: 0.8});
	var calView = Ti.UI.createWebView({url:'calendar/index.html',height:270,bottom:0, opacity: 1});
	mainView.add(calView);
	win.add(mainView);
	var slideUp =  Titanium.UI.createAnimation({bottom:0,duration:350});
	var slideDown =  Titanium.UI.createAnimation({bottom:-480,duration:350});

	mainView.animate(slideUp);
	
	mainView.slideDown = function(callback){
		var slideDown =  Titanium.UI.createAnimation({bottom:-480,duration:350});
		this.animate(slideDown);
		if (callback)
			slideDown.addEventListener("complete", callback)
	}
	return mainView;	
};