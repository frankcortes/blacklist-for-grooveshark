;(function(G, _, $){
	//All staff is initialized in this function.
	var BlackListUI = function() {
		this.initializeButtons();
		this.initializeEvents();
	};

	var blackListUIMethods = {
		//Initialize the UI elements
		initializeButtons: function() {
			var self = this;
			$(".module-row.song").each(function(){
			    var $buttons = $(this).find(".row-actions.secondary"),
			        $groupButtons = $buttons.find(".btn-group"),
			        songID = $groupButtons.children("a").first().data("song-id"),
			        bannedList = Grooveshark.getSongsInBlackList();
			    console.log($buttons);
			    $groupButtons.prepend("<a class=\"btn btn-small btn-icon-only banned song-row-banned\"  data-song-id=\"" + songID + "\"><i class=\"icon ex icon-ex-gray-flat\"></i></a>");
			    $buttons.css("width", "120px !important");
			    //If this song is banned, the class is the other one
			    if(bannedList.indexOf(songID) !== -1) {
			    	self._toogleButtons($buttons.find(".song-row-banned"));		    	
			    }
			});
		},
		//Initialize the events that UI needs
		initializeEvents: function() {
			var self = this;
			//Banned buttons
			$(".song-row-banned").click(function() {
				var songID = $(this).data("song-id"),
					$banIcon = $(this).find(".icon"),
					bannedAction = $banIcon.hasClass("icon-ex-gray-flat") ? "remove" : "Add";
				if(bannedAction === "remove") {
					if(typeof G.addSongInBlackListFromSongID !== "undefined") {
						G.addSongInBlackListFromSongID(songID);
					}
				}
				else {
					if(typeof G.removeSongInBlackListFromSongID !== "undefined") {
						G.removeSongInBlackListFromSongID(songID);
					}
				}
				self._toogleButtons($(this));
			});
		},
		//Auxiliar function to modify the button apparence
		_toogleButtons: function($button) {
			var $banIcon = $button.find(".icon"),
				classToRemove = $banIcon.hasClass("icon-ex-gray-flat") ? "icon-ex-gray-flat" : "icon-ex-gray-outline",
				classToAdd = $banIcon.hasClass("icon-ex-gray-flat") ? "icon-ex-gray-outline" : "icon-ex-gray-flat";
			
			$banIcon.removeClass(classToRemove);
			$banIcon.addClass(classToAdd);
		}
	};

	_.extend(BlackListUI.prototype, blackListUIMethods);

	var blackListUI = new BlackListUI();
})(Grooveshark, _, jQuery);