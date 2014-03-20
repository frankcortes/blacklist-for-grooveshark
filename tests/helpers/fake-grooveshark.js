//First we are initialize A collection with songs
var songs = new Backbone.Collection([{
	id: 1,
	name: "My song is a song",
	status: "loading"
}, {
	id: 2,
	name: "It's just a song",
	status: "stopped"
}]);


//Fake Grooveshark object
window.Grooveshark = {
	//Auxiliar functions for testing
	getSongs: function() {
		return songs;
	},
	restart: function() {
		songs = new Backbone.Collection([{
			id: 1,
			name: "My song is a song",
			status: "loading"
		}, {
			id: 2,
			name: "It's just a song",
			status: "stopped"
		}]);
	},
	//Add a callback for Grooveshark
	setSongStatusCallback: function(callback) {
		songs.on("change", _.bind(this._conversionFunction, {
			callback: callback
		}));
	},
	//This function converts song into a JSON object
	_conversionFunction: function(song) {
		var plainSong = song.toJSON();
		this.callback(plainSong);
	},
	//Remove the current song from the queue
	removeCurrentSongFromQueue: function() {
		var currentSong = _.first(songs.where({
			status: "loading"
		})),
			nextId = parseInt(currentSong.get("id"), 10) + 1,
			nextSong = _.first(songs.where({
				id: nextId
			}));

		currentSong.set("status", "stopped");

		if (nextSong) {
			nextSong.set("status", "loading");
		}
	},
	//get the current song
	getCurrentSongStatus: function() {
		return _.first(songs.where({
			status: "loading"
		}));
	}
};