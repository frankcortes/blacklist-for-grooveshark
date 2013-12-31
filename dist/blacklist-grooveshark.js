;
(function (G, _) {

    //##BlackList Model
    //I'd prefer to use `Backbone.LocalStorage` with `Backbone.Model`, but for some reason the method `Backbone.Sync is not working in
    //Grooveshark page :S. Futhermore, it's simpler than use a collection.
    var BlackList = function () {
        this.blackList = localStorage.blackList && JSON.parse(localStorage.blackList);
        this.blackList = this.blackList ||  [];
    };

    var blackListMethods = {
        get: function () {
            return this.blackList;
        },
        add: function (song) {
            if (!this.contains(song)) {
                this.blackList.push(song.songID);
            }
            this.sync();
        },
        remove: function (song) {
            if (this.contains(song)) {
                this.blackList = _.without(this.blackList, song.songID);
            }
            this.sync();
        },
        contains: function (song) {
            return this.blackList.indexOf(song.songID) !== -1;
        },
        sync: function () {
            localStorage.blackList = JSON.stringify(this.blackList);
        }
    };
    //A more elegant way to add these methods to the prototype
    _.extend(BlackList.prototype, blackListMethods);

    //##BlackList Daemon
    //This class is used to apply the blacklist logic.
    var BlackListDaemon = function () {
        this.blackList = new BlackList();
        G.setSongStatusCallback(_.bind(this.filterBlackList, this));
    };

    var blackListDaemonMethods = {
        //This function is used to verify if the current song is inside of the black list or not.
        filterBlackList: function (currentSong) {
            var song = currentSong.song,
                status = currentSong.status;
            //Verify if is inside of the black list
            if (song && status === "loading" && this.blackList.contains(song)) {
                //Remove of the execution inmediately!
                G.removeCurrentSongFromQueue();
            }
        }
    };

    _.extend(BlackListDaemon.prototype, blackListDaemonMethods);


    var BlackListDaemon = new BlackListDaemon();

    //####External methods for Blacklist Grooveshark
    var externalPublicApi = {
        //- Add a song in the black list
        addSongInBlackListFromSongID: function (songID) {
            this.blackList.add({
                "songID": songID
            });
        },
        //- What songs did I ignore?
        getSongsInBlackList: function () {
            return this.blackList.get();
        },
        //- Remove a song to the black list
        removeSongInBlackListFromSongID: function (songID) {
            this.blackList.remove({
                "songID": songID
            });
        }
    };
    //add these elements to Grooveshark API
    _.each(externalPublicApi, function (func, funcName) {
        externalPublicApi[funcName] = _.bind(func, BlackListDaemon);
    });
    _.extend(Grooveshark, externalPublicApi);
})(Grooveshark, _);
;
(function (G, _, $) {
    //All staff is initialized in this function.
    var BlackListUI = function () {
        this.initializeButtons();
        this.initializeEvents();
    };

    //Css classes used to display the ban button.
    var iconBanClass = "icon-ex-gray-flat",
        iconAllowClass = "icon-ex-gray-outline";

    var blackListUIMethods = {
        //Initialize the UI elements
        initializeButtons: function () {
            var self = this;
            $(".module-row.song").each(function () {
                var $buttons = $(this).find(".row-actions.secondary"),
                    $groupButtons = $buttons.find(".btn-group"),
                    songID = $groupButtons.children("a").first().data("song-id"),
                    bannedList = Grooveshark.getSongsInBlackList();
                console.log($buttons);
                $groupButtons.prepend("<a 
                    class=\"btn btn-small btn-icon-only banned song-row-banned\"\
                    data-song-id=\"" + songID + "\">\
                    <i class=\"icon ex " + iconBanClass + "\"></i></a>");
                $buttons.css("width", "120px !important");
                //If this song is banned, the class is the other one
                if (bannedList.indexOf(songID) !== -1) {
                    self._toogleButtons($buttons.find(".song-row-banned"));
                }
            });
        },
        //Initialize the events that UI needs
        initializeEvents: function () {
            var self = this;
            //Banned buttons
            $(".song-row-banned").click(function ()  {
                var songID = $(this).data("song-id"),
                    $banIcon = $(this).find(".icon"),
                    bannedAction = $banIcon.hasClass(iconBanClass) ? "remove" : "Add";
                if (bannedAction === "remove") {
                    if (typeof G.addSongInBlackListFromSongID !== "undefined") {
                        G.addSongInBlackListFromSongID(songID);
                    }
                } else {
                    if (typeof G.removeSongInBlackListFromSongID !== "undefined") {
                        G.removeSongInBlackListFromSongID(songID);
                    }
                }
                self._toogleButtons($(this));
            });
        },
        //Auxiliar function to modify the button apparence
        _toogleButtons: function ($button) {
            var $banIcon = $button.find(".icon"),
                hasBanIcon = $banIcon.hasClass(iconBanClass),
                classToRemove = hasBanIcon ? iconBanClass : iconAllowClass,
                classToAdd = hasBanIcon ? iconAllowClass : iconBanClass;

            $banIcon.removeClass(classToRemove);
            $banIcon.addClass(classToAdd);
        }
    };

    _.extend(BlackListUI.prototype, blackListUIMethods);

    var blackListUI = new BlackListUI();
})(Grooveshark, _, jQuery);