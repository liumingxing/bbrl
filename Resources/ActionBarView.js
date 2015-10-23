/*
 * 	Android API Guide
 *		http://developer.android.com/guide/topics/ui/actionbar.html
 *  Android Design Guide
 *		http://developer.android.com/design/patterns/actionbar.html
 *  Titanium Mobile will support someday
 *		https://jira.appcelerator.org/browse/TIMOB-2371
 */
function __l(x){
	if (Ti.App.is_android){
		 if (Ti.App.platform_height/Ti.App.logicalDensityFactor > 800)
			return x * Ti.App.logicalDensityFactor * 1.4;
		else
			return x * Ti.App.logicalDensityFactor;
			
		 //return parseInt(Ti.App.platform_width*x/(Ti.App.logicalDensityFactor == 1 ? 360 : 320));
	}
	
	if (!Ti.App.is_android && !Ti.App.is_ipad && Ti.App.platform_width > 320){
		return parseInt(375.0*x/320);
	}
	
	return Ti.App.is_ipad ? 2*x : x;
	/*
	if (Ti.App.is_android && Ti.App.platform_width > 320 && Ti.App.platform_width <=400){
		return parseInt(1.1*x);
	}
	if (Ti.App.is_android && Ti.App.platform_width >=480){
		return parseInt(1.5*x);
	}
	return Ti.App.is_ipad ? 2*x : x;
	*/
}

var osName = Ti.Platform.osname, isAndroid = osName === 'android', isIOS = osName === 'iphone' || osName === 'ipad' || osName === 'ipod', theme = {
	fontFamily : isIOS ? 'Helvetica Nue' : 'Droid Sans',
	backgroundColor : '#EA609E',
	borderColor : '#b5b5b5',
	//textColor : '#000',
	textColor : '#eee',
	dividerColor : '#b5b5b5',
	selectedColor : '#00b7e3',
	height : __l(44),
	buttonHeight : __l(44),
	selectedButtonHeight : __l(38),
	dividerWidth : __l(1),
	dividerHeight : __l(30),
	fontSize : __l(14)
}, events = {
	'TAB_CLICK' : 'ActionBar.NavigationTab:Click'
};

function createNavigationTabGroup(tabs, actionbar) {
	var _tabs = tabs || [], _tabCount = _tabs.length, _i = 0, _deviceWidth = Ti.App.platform_width, _width = (_deviceWidth / _tabCount) - 1, _selectedTab, _view = Ti.UI.createView({
		layout : 'horizontal',
		width : Ti.UI.FILL,
		top : 1,
		bottom : 1
	});

	for (; _i < _tabCount; _i++) {
		var no_sep = _tabs[_i].no_sep
		_tabs[_i].width = _width;
		_tabs[_i] = buildTab(_tabs[_i]);
		_view.add(_tabs[_i].tabView);
		
		if (!no_sep && _i < _tabCount - 1)
			_view.add(tabSeperator());
	}

	_view.addEventListener(events.TAB_CLICK, function(e) {
		if (!e.ignore_select){
			var _n = 0, _len = _tabs.length, _aTab;
			for (; _n < _len; _n++) {
				_aTab = _tabs[_n];
				if (_aTab.tabView.id == _selectedTab) {
					_aTab.select(false);
				}
				if (_aTab.tabView.id == e.tabId) {
					_aTab.select(true);
				}
			}
			_selectedTab = e.tabId;
		}
		
		actionbar.fireEvent(events.TAB_CLICK, e)
	});

	function tabSeperator() {
		var seperatorView = Ti.UI.createView({
			backgroundColor : "#E88EBE",
			width : theme.dividerWidth,
			height: theme.dividerHeight,
			top: __l(7)
		});
		
		return seperatorView;
	}

	function buildTab(params) {
		var _params = params || {}, _tabView, _tabLabel, _config = {
			id : _params.id || (new Date()).getTime() + '',
			text : _params.text || "",
			selectedColor : _params.selectedColor || theme.selectedColor,
			backgroundColor : _params.backgroundColor || theme.backgroundColor,
			textColor : _params.textColor || theme.textColor,
			width : _params.width || 'auto',
			selected : _params.selected || false
		};

		if (_config.selected) {
			_selectedTab = _config.id;
		}

		_tabView = Ti.UI.createView({
			id : _config.id,
			width : _params.__width || _config.width,
			textAlign : _params.align || 'center',
			layout : 'vertical'
		});
		if (_params.isButton || _params.isLabel || _params.isBack){
			/*
			_tabView.backgroundGradient = {
			        type: 'linear',
			        startPoint: { x: '0%', y: '0%' },
			        endPoint: { x: '0%', y: '100%' },
			        colors: [ { color: '#E88EBE', offset: 0.0}, { color: '#DC4790', offset: 1.0 }],
			  }
			 */
		}
		else{
			_tabView.backgroundColor = _config.selectedColor;
		}
		
		var tabLabel = null;
		if (_params.isButton){
			_tabLabel = Ti.UI.createButton({
				title : Ti.App.platform_width > 320 ?  _config.text + " " : _config.text + " ",
				//backgroundImage: "/images/bj.png",
				backgroundColor: 'transparent',
				backgroundSelectedImage : "/images/bj2.png",
				//backgroundImage: "/images/red_button_1.png",
				//backgroundSelectedImage : "/images/red_button_2.png",
				//height: __l(30),
				//width: _config.text.length * __l(17) + __l(20),
				font: {fontSize: __l(16)},
				color: "white",
				top: 0,
				bottom: 0,
				id: _config.id,
				borderRadius: __l(0),
				horizontalWrap: false,
				visible: _params.isHide ? false : true
			});
			if (_params.hasImage){
				_tabLabel.title = null;
				//_tabLabel.image = _config.text;
				_tabLabel.backgroundImage = _config.text;
				if (_params.text_selected){
					_tabLabel.backgroundSelectedImage =  _params.text_selected;
				}
				
				_tabLabel.height = __l(30);
				_tabLabel.width = __l(30);
				_tabLabel.top = __l(7);
			}
			
			if (_params.b_width){
				_tabLabel.width = _params.b_width; 
			}
				
			if (_params.align == "right"){
				_tabLabel.right = 10;
			}
			else if(_params.align == "left"){
				_tabLabel.left = 10
			}
			
			_tabLabel.addEventListener("click", function(e){
				var now = new Date()
				var now_timer = now.getTime()
				if (e.source.stamp && now_timer - e.source.stamp<2000){
					return;
				}
				else{
					e.source.stamp = now_timer;
				}	
					
				_view.fireEvent(events.TAB_CLICK, {tabId : _tabView.id, ignore_select: true});
			});
		}
		else if (_params.isBack){
			_tabLabel = Ti.UI.createButton({
				//title : " " + _config.text + "  ",
				backgroundImage: "/images/android_back.png",
				backgroundSelectedImage : "/images/android_back_select.png",
				height: __l(40),
				width: __l(40),
				font: {fontSize: __l(14)},
				color: 'white',
				top: __l(2),
				left: 2,
				id: _config.id
			});
			if (_params.align == "right"){
				_tabLabel.right = 10;
			}
			else if(_params.align == "left"){
				_tabLabel.left = 2;
			}
			_tabLabel.addEventListener("click", function(){
				_view.fireEvent(events.TAB_CLICK, {tabId : _tabView.id, ignore_select: true});
			});
		}
		else if (_params.isLabel){
			var tab_title = _config.text;
			if (!_config.text){
				tab_title = ' ';
			}
			_tabLabel = Ti.UI.createLabel({
				html : tab_title,
				color : _params.color||_config.textColor,
				height : theme.buttonHeight,
				top: __l(0),
				left : 0,
				right : 0,
				font : {
					fontSize : __l(18),
					//fontWeight : 'bold'
				},
				textAlign: _params.align || 'center'
			});
			_tabLabel.addEventListener("click", function(){
				_view.fireEvent(events.TAB_CLICK, {tabId : _tabView.id, ignore_select: true});
			});
		}
		else{
			_tabLabel = Ti.UI.createLabel({
				text : _config.text,
				color : _config.textColor,
				backgroundColor : _config.backgroundColor,
				/*
				backgroundGradient: {
			        type: 'linear',
			        startPoint: { x: '0%', y: '0%' },
			        endPoint: { x: '0%', y: '100%' },
			        colors: [ { color: '#E88EBE', offset: 0.0}, { color: '#DC4790', offset: 1.0 }],
			   },
			   */
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				height : _config.selected ? theme.selectedButtonHeight : theme.buttonHeight,
				left : 0,
				right : -__l(1),
				width : (_params.__width || _config.width) + __l(1),
				font : {
					fontSize : theme.fontSize,
					//fontWeight : 'bold'
				}
			});
			
			_tabView.addEventListener('click', function() {
				_view.fireEvent(events.TAB_CLICK, {
					tabId : _tabView.id
				});
			});
		}

		_tabView.add(_tabLabel);		
		_tabView._tabLabel = _tabLabel;

		return {
			tabView : _tabView,
			select : function(bool) {
				_tabLabel.height = bool ? theme.selectedButtonHeight : theme.buttonHeight
			}
		};
	}

	actionbar._tabs = _tabs;
	actionbar._view = _view;
	return _view;
}

function ActionBarView(args) {
	var ActionBar = Ti.UI.createView({
		height : theme.height,
		//backgroundColor : theme.backgroundColor,
		/*
		backgroundGradient: {
	        type: 'linear',
	        startPoint: { x: '0%', y: '0%' },
	        endPoint: { x: '0%', y: '100%' },
	        colors: [ { color: '#E88EBE', offset: 0.0}, { color: '#DC4790', offset: 1.0 }],
	   },
	   */
	   backgroundColor: Ti.App.bar_color,
	   touchEnabled: false,
	   layout : 'horizontal',
	   tabs: args.tabs,
	   top : 0
	});
	
	var navigationTabGroup = createNavigationTabGroup(args.tabs, ActionBar);

	ActionBar.add(navigationTabGroup);

	return ActionBar;
}

module.exports = ActionBarView; 