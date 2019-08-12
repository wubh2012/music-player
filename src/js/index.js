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

class MusicPlayer{
  constructor(){
    this.audio = new Audio();
    this.canplay = false;
    this.currentIndex = 0;
    this.musiclist = musiclist;
    this.init();
    this.initAudio();
    this.bindEvent();
  }
  init(){
    this.musiclist[0].url = mp300;
    this.musiclist[1].url = mp301;
    this.musiclist[2].url = mp302;
    this.musiclist[3].url = mp303;

    let panelbody = $('.footer>.musiclist>.panel-body');
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
    panelbody.innerHTML = `<ul>${temphtml}</ul>`;
  }
  initAudio(){
    // 当资源文件加载完成时触发
    this.audio.addEventListener('loadedmetadata', (e) => {
      // 获取音乐的总时间
      log('音乐的总时长', this.audio.duration);
      $('.footer>.processbar>.time-end').innerText = this.formateTime(this.audio.duration);
    });
    // 播放进度事件
    this.audio.addEventListener('timeupdate',  () => {
      log('%', (this.audio.currentTime / this.audio.duration) * 100);
      let percent = (this.audio.currentTime / this.audio.duration) * 100;
      if (percent === 100) {
        log('播放下一首');
        playNext();
      } else {
        // 设置进度百分比
        $('.footer>.processbar>.bar>.progress').style.width = `${percent}%`;
        $('.footer>.processbar>.time-start').innerText = this.formateTime(this.audio.currentTime);
      }
    });
  }
  run(){
    this.loadSong();
  }
  loadSong(){
    let music = this.musiclist[this.currentIndex];  
    $('.header h1').innerText = music.title;
    $('.header p').innerText = `${music.author} - ${music.albumn}`;

    this.audio.src = music.url;
    this.activeSong();
  }
  activeSong(){
    Array.from($$('.musiclist li')).forEach((element, index)=>{
      if(parseInt(element.dataset.id, 10) === this.currentIndex){
        element.classList.add('active');
      }else{
        element.classList.remove('active');
      }
    })
  }  
  play(){
    if(this.canplay){
      this.audio.play();
    }
  }
  pause(){
    this.audio.pause();
  }
  playPrev(){
    this.currentIndex -= 1;
    this.currentIndex = (this.musiclist.length + this.currentIndex) % this.musiclist.length;
    this.loadSong()
    this.play();
  }
  playNext(){
    this.currentIndex += 1;
    this.currentIndex = currentIndex % this.musiclist.length;
    this.loadSong();
    this.play();
  }
  bindEvent(){
    let self = this;
    $('.footer > .actions > .btn-play-control').addEventListener('click', function (e) {
      let element = e.currentTarget;
      if (element.classList.contains('playing')) {
        element.querySelector('use').setAttribute('xlink:href', '#icon-play')
        element.classList.remove('playing');
        element.classList.add('pause');
        $('.main>.effects').classList.toggle('active');
        self.canplay = false;
        self.pause();
      } else {
        element.classList.remove('pause');
        element.classList.add('playing');
        element.querySelector('use').setAttribute('xlink:href', '#icon-pause');
        $('.main>.effects').classList.toggle('active');
        self.canplay = true;
        self.play();
        
      }
    });
    $('.footer>.actions>.btn-pre').addEventListener('click', () => {
      self.playPrev();
    });
    $('.footer>.actions>.btn-next').addEventListener('click', () => {
      self.playNext();
    });
    $('.footer>.actions>.btn-music-list').addEventListener('click', (e)=> {
      log('显示播放列表');
      $('.footer>.musiclist').classList.add('active');
      e.stopPropagation();    
    });
    $('.footer>.musiclist>.panel-header>.close').addEventListener('click', (e)=> {
      log('关闭');
      $('.footer>.musiclist').classList.remove('active');
    });
    $('.footer>.musiclist>.panel-body>ul').addEventListener('click', (e)=>{
      e.stopPropagation();
      let targetElement = e.target;
      
      while(targetElement.nodeName !== 'LI'){
        log(targetElement, targetElement.parentElement)
        targetElement = targetElement.parentElement;
        if(targetElement === null || targetElement.nodeName === 'UL'){
          break;
        }
      }
      self.currentIndex = parseInt(targetElement.dataset.id, 10);
      self.loadSong();
      self.play();
      
    })
    document.addEventListener('click', ()=>{
      log('body 关闭');
      $('.footer>.musiclist').classList.remove('active');
    });
  }
  formateTime(secondsTotal){
    let minutes = parseInt(secondsTotal / 60);
    minutes = minutes >= 10 ? '' + minutes : '0' + minutes;
    let seconds = parseInt(secondsTotal % 60);
    seconds = seconds >= 10 ? '' + seconds : '0' + seconds;
    return minutes + ':' + seconds;
  }

}

new MusicPlayer().run();