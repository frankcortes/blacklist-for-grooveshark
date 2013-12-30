;(function(G, _){

	//just for development
	var list = [];
	/* Some examples for list values
	[
		39897777, //wake me up
		39582266 //tsunami
	];
	*/
	//I'd prefer to use Backbone.LocalStorage with Backbone.Model, but for any reason the method _Backbone.Sync_ is not working in
	//Grooveshark page :S. Futhermore, it's simpler than use a collection.
	var BlackList = function() {
		this.blackList = localStorage.blackList && JSON.parse(localStorage.blackList);
		this.blackList = this.blackList || list;
	};

	var blackListMethods = {
		get: function() {
			return this.blackList;
		},
		add: function(song) {
			if(!this.contains(song)) {
				this.blackList.push(song.songID);
			}
			this.sync();
		},
		remove: function(song) {
			if(this.contains(song)) {
				this.blackList = _.without(this.blackList, song.songID);
			}
			this.sync();	
		},
		contains: function(song) {
			return this.blackList.indexOf(song.songID) !== -1;
		},
		sync: function() {
			localStorage.blackList = JSON.stringify(this.blackList);
		}
	};
	//A more elegant way to add these methods to the prototype
	_.extend(BlackList.prototype, blackListMethods);

	//This class is used to apply the blacklist logic.
	var BlackListDaemon = function() {
			console.log("%c created class!","background-color: yellow;");
			this.blackList = new BlackList();
			G.setSongStatusCallback(_.bind(this.filterBlackList, this));
	};

	var blackListDaemonMethods = {
		//This function is used to verify if the current song is inside of the black list or not.
		filterBlackList: function(currentSong) {
			var song = currentSong.song,
				status = currentSong.status;
			//verify if is inside of the black list
			if(song && status === "loading" && this.blackList.contains(song)) {
				//Remove of the execution inmediately!
				G.removeCurrentSongFromQueue();
				console.log("%c removed the song %s in event %s", "background-color: yellow", song.songName, status);
			}
		}
	};

	_.extend(BlackListDaemon.prototype, blackListDaemonMethods);


	var BlackListDaemon = new BlackListDaemon();

	var externalPublicApi = {
		addSongInBlackListFromSongID: function(songID) {
			this.blackList.add({ "songID": songID });
		},
		getSongsInBlackList: function() {
			return this.blackList.get();
		},
		removeSongInBlackListFromSongID: function(songID) {
			this.blackList.remove({ "songID": songID });
		}
	};
	//add these elements to Grooveshark API
	_.each(externalPublicApi, function(func, funcName) {
		externalPublicApi[funcName] = _.bind(func, BlackListDaemon);
	});
	_.extend(Grooveshark, externalPublicApi);
})(Grooveshark, _);