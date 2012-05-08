var sp     = getSpotifyApi(10),
    views  = sp.require('sp://import/scripts/api/views'),
    models = sp.require('sp://import/scripts/api/models');

$(function() {
  // create a blank playlist
  playlist = new models.Playlist("Music/Tech meetup");
  var oldListLength = 0,
      poll = function(callback) {
    console.log("POLLING");
    // get songs from server
    $.getJSON("http://musictechmeetup.com/list", function(data) {
      console.log(data);
      // grab the latest additions
      var newTracks = data.slice(oldListLength, data.length);
      for (var i = 0; i < newTracks.length; i++) {
        // instantiate a track
        var track = models.Track.fromURI(newTracks[i])
        // add track to playlist
        playlist.add(track);
      }
      oldListLength = data.length;
    });
  };

  poll();

  setInterval(poll, 20000);

  // create a list view for the playlist
  listView = new views.List(playlist);

  // append list to view
  $("div.playlist").append(listView.node);
});
