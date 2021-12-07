// @ts-ignore
import * as Clappr from 'clappr';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';


export function useVideo(index: number) {
  const [cache, setCache] = useState(() => new Map<number, string>())
  useEffect(() => {
    axios.post<{
      data: {
        "channelNo": number,
        "url": string,
      }[],
    }>(`api/video/list`, {}).then((res) => {
      setCache(new Map(res.data.data.map((x) => [x.channelNo, x.url])))
    })
  }, [])
  const video = useRef(null);
  useEffect(() => {
    const url = cache.get(index)
    if (!url) { return }
    let videoPlayer = new Clappr.Player({
      source: url,
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
    return () => { videoPlayer.stop(); videoPlayer.destroy() }
  }, [cache])
  return video
}