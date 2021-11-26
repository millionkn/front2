// @ts-ignore
import * as Clappr from 'clappr';
import request from '@/utils/request';
import { withObservable } from './plantform-utils/react/observableHooks';
import { switchMap, timer } from 'rxjs';
import axios from 'axios';
import { useEffect } from '@umijs/renderer-react/node_modules/@types/react';
import { useRef } from 'react';

console.log(Clappr);

const videoinformations = [
  {

    url: 'https://hls01open.ys7.com/openlive/9c80ba17e44947f7bd7c68d77f19e314.hd.m3u8',
    no: '1号区域',
    date: new Date()
  },
  {

    url: 'https://hls01open.ys7.com/openlive/bed63d83618549d69f3702f916f30fb1.hd.m3u8',
    no: '2号区域',
    date: new Date()
  },
  {

    url: 'https://hls01open.ys7.com/openlive/ba0ad0009e124cbfb9aaff91a54c7d0b.hd.m3u8',
    no: '3号区域',
    date: new Date()
  },
  {

    url: 'https://hls01open.ys7.com/openlive/fca51d2ce03b4c7d8167ab36ccebca04.hd.m3u8',
    no: '4号区域',
    date: new Date()
  },
  {

    url: 'https://hls01open.ys7.com/openlive/9c2af1a8d37b4134852bed004a2d2b0a.hd.m3u8',
    no: '5号区域',
    date: new Date()
  }
];

export const videoService = {
  async getToken(): Promise<string> {
    const api = 'https://open.ys7.com/api/lapp/token/get?appKey=f8091da7552c4088bc1c30c95675ef0b&appSecret=fabd594b43e3953296013fbd0911fbd6';
    const result = await request(api, { method: 'POST' });
    return result.data.accessToken;
  },
  async openVideo(token: string, index: number) {
    const api = `https://open.ys7.com/api/lapp/live/video/open?accessToken=${token}&source=F18003603:${index}`;
    await request(api, { method: 'POST' });
  },
  async closeVideo(token: string, index: number) {
    const api = `https://open.ys7.com/api/lapp/live/video/close?accessToken=${token}&source=F18003603:${index}`;
    await request(api, { method: 'POST' });
  },
  async openVideos(token: string, swlere: string) {
    const api = `https://open.ys7.com/api/lapp/live/video/open?accessToken=${token}&source=${swlere}`
    await request(api, { method: 'POST' });
  },
  async closeVideos(token: string) {
    const api = `https://open.ys7.com/api/lapp/live/video/close?accessToken=${token}&source=F18003603:1,F18003603:2,F18003603:3,F18003603:4,F18003603:5`;
    await request(api, { method: 'POST' });
  },
  loadVideo(index: number, playerElement: HTMLElement) {
    this.getToken().then(async (token) => {
      await this.openVideo(token, index);
    });
    let videoPlayer = new Clappr.Player({
      source: videoinformations[index - 1].url,
      mute: true,
      width: '100%',
      height: '100%',
      autoPlay: true,
      disableCanAutoPlay: true, //禁用检测浏览器是否可以自动播放视频
      hideMediaControl: true, //禁用媒体控制自动隐藏
      hideMediaControlDelay: 100, //更改默认的媒体控件自动隐藏超时值
      hideVolumeBar: true, //当嵌入的宽度小于320时，音量条将被隐藏\
      exitFullscreenOnEnd: false, //禁用播放器将在媒体结束时自动退出全屏显示，即播放结束后不会退出全屏
      mediacontrol: { seekbar: '#000', buttons: '#FFF' }, //定义进度条和底部暂停等图标的颜色
    });
    videoPlayer.attachTo(playerElement);
    return () => { videoPlayer.stop(); videoPlayer.destroy() }
  },
}

export function useVideo(index: number) {
  const video = useRef(null);
  useEffect(() => {
    let videoPlayer = new Clappr.Player({
      source: videoinformations[index - 1].url,
      mute: true,
      width: '100%',
      height: '100%',
      autoPlay: true,
      disableCanAutoPlay: true, //禁用检测浏览器是否可以自动播放视频
      hideMediaControl: true, //禁用媒体控制自动隐藏
      hideMediaControlDelay: 100, //更改默认的媒体控件自动隐藏超时值
      hideVolumeBar: true, //当嵌入的宽度小于320时，音量条将被隐藏\
      exitFullscreenOnEnd: false, //禁用播放器将在媒体结束时自动退出全屏显示，即播放结束后不会退出全屏
      mediacontrol: { seekbar: '#000', buttons: '#FFF' }, //定义进度条和底部暂停等图标的颜色
    });
    videoPlayer.attachTo(video.current);
    () => { videoPlayer.stop(); videoPlayer.destroy() }
  }, [])
  return video
}