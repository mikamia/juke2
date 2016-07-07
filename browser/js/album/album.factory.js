'use strict';

juke.factory('AlbumFactory', function($http, $log){
  var albumObj = {};

  albumObj.fetchAll = function(){
    return $http.get('/api/albums/')
    .then(function (res) { return res.data; })
    .catch($log.error);
  };

  albumObj.fetchById = function(id){
    return $http.get('/api/albums/' + id)
    .then(function (res) { return res.data; })
    .then(function (album) {
      console.log(album);
      album.imageUrl = '/api/albums/' + album.id + '/image';
      album.songs.forEach(function (song, i) {
        song.audioUrl = '/api/songs/' + song.id + '/audio';
        song.albumIndex = i;
      });
      return album;
    })
    .catch($log.error)
  };


  return albumObj;

})
