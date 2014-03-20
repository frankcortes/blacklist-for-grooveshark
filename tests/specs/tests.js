describe("localStorage", function() {
	var songs;

	beforeEach(function() {
		Grooveshark.restart();
		songs = Grooveshark.getSongs();
		window.localStorage.blackList = [];
	});


	it("Add a new element in banned song should appear in the Localstorage", function() {
		var jsonData,
			isInBlacklist;
		//Add the callback
		Grooveshark.addSongInBlackListFromSongID(2);
		jsonData = JSON.parse(window.localStorage.blackList);
		isInBlacklist = _.contains(jsonData, 2);
		expect(isInBlacklist).toEqual(true);
	});

	it("Remove a old element in banned song should appear in the Localstorage", function() {
		var jsonData,
			isInBlacklist;
		//Add the callback
		Grooveshark.removeSongInBlackListFromSongID(2);
		jsonData = JSON.parse(window.localStorage.blackList);
		isInBlacklist = _.contains(jsonData, 2);
		expect(isInBlacklist).toEqual(false);
	});

	it("If localStorage is corrupted, reload blacklist", function() {
		var blackList;
		window.localStorage.blacklist = "[2]";
		blacklist = Grooveshark.getSongsInBlackList();

		expect(blacklist).not.toBe(window.localStorage.blacklist);
		expect(blacklist.length).toBe(0);
	});

});

describe("Events", function() {
	var songs, firstSong, firstTime = true;

	beforeEach(function(done) {
		Grooveshark.restart();
		songs = Grooveshark.getSongs();
		window.localStorage.blackList = [];

		firstSong = _.first(songs.where({
			id: 2
		}));
		//Add the callback
		Grooveshark.addSongInBlackListFromSongID(2);

		Grooveshark.setSongStatusCallback(function() {
			if(firstTime) {
				done();
				firstTime = false;
			}
		});
		//Change the song
		Grooveshark.removeCurrentSongFromQueue();
		
	});


	it("if is the next song is a banned song, remove it", function(done) {
		//If the blacklist worked, the status should be stopped
		expect(firstSong.get("status")).toEqual("stopped");
		done();
	});
})