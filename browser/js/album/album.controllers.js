'use strict';

juke.controller('AlbumsCtrl', function($scope, $log, AlbumFactory, $q){
  var promises = [];
  console.log("hi");
  AlbumFactory.fetchAll()
  .then(albums => {
    albums.forEach(album => {
      promises.push(AlbumFactory.fetchById(album.id));
    })
    $q.all(promises)
    .then((fetchedAlbums) =>{
      // fetchedAlbums.forEach(album =>{
      //   album.imageUrl = '/api/albums/' + album.id + '/image';
      // })
      console.log("fetch", fetchedAlbums);
      $scope.allAlbums = fetchedAlbums;
    })
    console.log($scope.allAlbums);
  })
  .catch($log.error);


});


juke.controller('AlbumCtrl', function ($scope, $rootScope, $log, StatsFactory, AlbumFactory) {

  AlbumFactory.fetchById(1)
  .then(function(album){
    $scope.album = album;
    StatsFactory.totalTime(album)
    .then(function (albumDuration) {
      $scope.fullDuration = albumDuration;
    });
  })
  .catch($log.error);

  // main toggle
  $scope.toggle = function (song) {
    if ($scope.playing && song === $scope.currentSong) {
      $rootScope.$broadcast('pause');
    } else $rootScope.$broadcast('play', song);
  };

  // incoming events (from Player, toggle, or skip)
  $scope.$on('pause', pause);
  $scope.$on('play', play);
  $scope.$on('next', next);
  $scope.$on('prev', prev);

  // functionality
  function pause () {
    $scope.playing = false;
  }
  function play (event, song) {
    $scope.playing = true;
    $scope.currentSong = song;
  }

  // a "true" modulo that wraps negative to the top of the range
  function mod (num, m) { return ((num % m) + m) % m; }

  // jump `interval` spots in album (negative to go back, default +1)
  function skip (interval) {
    if (!$scope.currentSong) return;
    var index = $scope.currentSong.albumIndex;
    index = mod( (index + (interval || 1)), $scope.album.songs.length );
    $scope.currentSong = $scope.album.songs[index];
    if ($scope.playing) $rootScope.$broadcast('play', $scope.currentSong);
  }
  function next () { skip(1); }
  function prev () { skip(-1); }

});



juke.factory('StatsFactory', function ($q) {
  var statsObj = {};
  statsObj.totalTime = function (album) {
    var audio = document.createElement('audio');
    return $q(function (resolve, reject) {
      var sum = 0;
      var n = 0;
      function resolveOrRecur () {
        if (n >= album.songs.length) resolve(sum);
        else audio.src = album.songs[n++].audioUrl;
      }
      audio.addEventListener('loadedmetadata', function () {
        sum += audio.duration;
        resolveOrRecur();
      });
      resolveOrRecur();
    });
  };
  return statsObj;
});

