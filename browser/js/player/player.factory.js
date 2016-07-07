'use strict';

juke.factory('PlayerFactory', function(){
  var playerObj = {};
  var audio = document.createElement('audio');
  var currentSong = null;
  var playing;
  var allSongs;

  playerObj.start = function(song, songList){
    this.pause();
    allSongs = songList;
    playing = true;
    if(song === currentSong) return audio.play();
    currentSong = song;
    songList.map(function(song, index){
      song.albumIndex = index;
      if(song === currentSong) currentSong.albumIndex = index;
    })
    audio.src = song.audioUrl;
    audio.load();
    audio.play();
  };

  playerObj.pause = function(){
    audio.pause();
    playing = false;
  };

  playerObj.resume = function(){
    this.start(currentSong);
  };

  playerObj.isPlaying = function(){
    return playing === true;
  };
  playerObj.getCurrentSong = function(){
    return currentSong;
  };

  playerObj.next = function(){
    this.pause();
    skip(1);
  };

  playerObj.previous = function(){
    this.pause();
    skip(-1);
  };
  playerObj.getProgress = function(){};

  return playerObj;

  function skip (interval){
    if(currentSong === null) return;
    var index = currentSong.albumIndex;
    console.log("here," , index);
  }
});

