var sp     = getSpotifyApi(10),
    views  = sp.require('sp://import/scripts/api/views'),
    models = sp.require('sp://import/scripts/api/models');

$(function() {
  // create a blank playlist
  playlist = models.Playlist.fromURI("spotify:user:rodreegez:playlist:5EqkTkPMQdhlTdG2RFi7vU");
  playlist.subscribed = true
  var oldListLength = playlist.tracks.length,
      poll = function(callback) {
    console.log("POLLING");
    // get songs from server
    $.getJSON("http://collabify.musictechmeetup.com/list.js", function(data) {
      console.log(data);
      // grab the latest additions
      var newTracks = data.slice(oldListLength, data.length);
      for (var i = 0; i < newTracks.length; i++) {
        // instantiate a track
        var track = models.Track.fromURI(newTracks[i].uri);
        // add track to playlist
        playlist.add(track);
      }
      oldListLength = data.length;
    });
  };

  poll(function() {
    player.play(playlist.tracks[0].data.uri, playlist.data.uri);
  });

  setInterval(poll, 10000);

  // create a list view for the playlist
  listView = new views.List(playlist);

  // append list to view
  $("div.playlist").append(listView.node);

  // listen for state changes
  models.player.observe(models.EVENT.CHANGE, function(event) {
    if(event.data.playstate){
      if(models.player.playing) {
        $.ajax({
          type: "POST",
          url: "http://collabify.musictechmeetup.com/now-playing.json",
          data: {track: models.player.track.data.uri},
          dataType: 'json'
        })
      } else {
        $.ajax({
          type: "POST",
          url: "http://collabify.musictechmeetup.com/now-playing.json",
          data: {track: ""},
          dataType: 'json'
        })
      }
    }
  });
});
