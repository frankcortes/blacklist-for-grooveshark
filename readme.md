#Blacklist for Grooveshark

##Why?

When I'm playing random playlists (like popular, or random songs), sometimes I would avoid several songs I don't like too much. For this reason I created this bookmarklet.

##Use
Use this 


##How works
The plugin is split into different files, *blacklist-api.js* and *blacklist-ui.js*. The first one implements the needed new methods and the other creates a interface to use these methods.

##API
This plugin adds few methods to window.Grooveshark object, so another developers can use the blacklist-api to develop another plugins.

- addSongInBlackListFromSongID
- getSongsInBlackList
- removeSongInBlackListFromSongID


##FAQ
###Why are you using Underscore/Lodash in your code?
I'm taking advantage of some libraries have been loaded for Grooveshark.com,like Lodash or jQuery are. I know they are using require.js and Backbone.js, although I don't want to use its versions - concretely they aren't using all the Backbone components.
###