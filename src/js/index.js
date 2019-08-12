import '../css/index.scss'
import './icons.js'
import musiclist from '../data/music.json'
import mp300 from '../songs/00.mp3'
import mp301 from '../songs/01.mp3'
import mp302 from '../songs/02.mp3'
import mp303 from '../songs/03.mp3'

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
const log = console.log.bind(console)


let initData = function () {
  musiclist[0].url = mp300;
  musiclist[1].url = mp301;
  musiclist[2].url = mp302;
  musiclist[3].url = mp303;
  let body = $('.footer>.musiclist>.panel-body');
  let temphtml = ``;
  musiclist.forEach(item => {
    temphtml+=`<li data-id="${item.id}">
    <span class="iconVoice">
        <svg class="icon" xmlns:xlink="http://www.w3.org/1999/xlink"  aria-hidden="true"><use xlink:href="#icon-voice"/></svg>
    </span>
    <span class="songName">${item.title}</span>
    <span class="author"> - ${item.author}</span>
  </li>`
  });
  body.innerHTML = `<ul>${temphtml}</ul>`;
}

console.log(musiclist)
let formateTime = function (secondsTotal) {
  let minutes = parseInt(secondsTotal / 60);
  minutes = minutes >= 10 ? '' + minutes : '0' + minutes;
  let seconds = parseInt(secondsTotal % 60);
  seconds = seconds >= 10 ? '' + seconds : '0' + seconds;
  return minutes + ':' + seconds;
}

let canplay = false;
let currentIndex = 0;
const audio = new Audio();

let initAudio = function () {
  // 当资源文件加载完成时触发
  audio.addEventListener('loadedmetadata', function (e) {
    // 获取音乐的总时间
    log('音乐的总时长', audio.duration)
    $('.footer>.processbar>.time-end').innerText = formateTime(audio.duration);
  });
  // 播放进度事件
  audio.addEventListener('timeupdate', function () {
    log('%', (audio.currentTime / audio.duration) * 100);
    let percent = (audio.currentTime / audio.duration) * 100;
    if (percent === 100) {
      log('播放下一首');
      playNext();
    } else {
      // 设置进度百分比
      $('.footer>.processbar>.bar>.progress').style.width = `${percent}%`;
      $('.footer>.processbar>.time-start').innerText = formateTime(audio.currentTime);
    }
  });

}

let loadSong = function () {
  let music = musiclist[currentIndex];
  
  $('.header h1').innerText = music.title;
  $('.header p').innerText = `${music.author} - ${music.albumn}`;
  audio.src = music.url;
  Array.from($$('.musiclist li')).forEach((element, index)=>{
    if(parseInt(element.dataset.id, 10) === currentIndex){
      element.classList.add('active');
    }else{
      element.classList.remove('active');
    }
  })

}

let play = function () {
  if(canplay){
    audio.play();
  }
}

let pause = function () {
  audio.pause();
}
let playNext = function () {
  currentIndex += 1;
  currentIndex = currentIndex % musiclist.length;
  loadSong();
  play();
}
let playPrev = function () {
  currentIndex -= 1;
  log('prev', currentIndex);
  currentIndex = (musiclist.length + currentIndex) % musiclist.length;
  log('prev new ', currentIndex)
  loadSong()
  play();

}

let bindEvent = function () {
  $('.footer > .actions > .btn-play-control').addEventListener('click', function (e) {
    let element = e.currentTarget;
    if (element.classList.contains('playing')) {
      element.querySelector('use').setAttribute('xlink:href', '#icon-play')
      element.classList.remove('playing');
      element.classList.add('pause');
      $('.main>.effects').classList.toggle('active');
      canplay = false;
      pause();
    } else {
      element.classList.remove('pause');
      element.classList.add('playing');
      element.querySelector('use').setAttribute('xlink:href', '#icon-pause');
      $('.main>.effects').classList.toggle('active');
      canplay = true;
      play();
      
    }
  });
  $('.footer>.actions>.btn-pre').addEventListener('click', function (e) {
    playPrev();
  });
  $('.footer>.actions>.btn-next').addEventListener('click', function (e) {
    playNext();
  });
  $('.footer>.actions>.btn-music-list').addEventListener('click', function (e) {
    log('显示播放列表');
    // audio.currentTime += 10;
    $('.footer>.musiclist').classList.add('active');
    e.stopPropagation();    
  });
  $('.footer>.musiclist>.panel-header>.close').addEventListener('click', function (e) {
    log('关闭');
    $('.footer>.musiclist').classList.remove('active');
  });
  $('.footer>.musiclist').addEventListener('click', function(e){
    e.stopPropagation();
    let targetElement = e.target;
    log(targetElement, targetElement.nodeType, targetElement.nodeName)
    if(targetElement.nodeName === 'LI'){
      log(targetElement.dataset.id)
      currentIndex = parseInt(targetElement.dataset.id, 10);
      loadSong()
    }
  })
  document.addEventListener('click', function(){
    log('body 关闭')
    $('.footer>.musiclist').classList.remove('active');
  });

}

let __main = function () {
  initData();
  initAudio();
  loadSong();
  bindEvent();
}

__main()