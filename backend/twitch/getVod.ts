import axios from "axios";
import fs from "fs";
import tmp from "tmp";
import { exec } from "child_process";
import crypto from "crypto";
const config = { headers: { "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko" } };
export type ImageURL = string;
export type DateString = string;
export interface VodInfo {
  title: string;
  views: number;
  url: string;
  language: string;
  created_at: DateString;
  published_at: DateString;
  recorded_at: DateString;
  game: string;
  length: number;
  preview: {
    small: ImageURL;
    medium: ImageURL;
    large: ImageURL;
  };
  channel: {
    display_name: string;
    logo: ImageURL;
    url: string;
    _id: string;
  };
}
const ACCESS_TOKEN_URL = "https://gql.twitch.tv/gql";
interface TokenOutput {
  data: {
    videoPlaybackAccessToken: {
      value: string;
      signature: string;
    };
  };
}

export const getVodInfo = async (id: string): Promise<VodInfo> => {
  const url = `https://api.twitch.tv/v5/videos/${id}`;
  return (await axios.get(url, config)).data;
};
const getAccessToken = async (videoID: string): Promise<TokenOutput> => {
  const body = {
    operationName: "PlaybackAccessToken_Template",
    query:
      'query PlaybackAccessToken_Template($login: String!, $isLive: Boolean!, $vodID: ID!, $isVod: Boolean!, $playerType: String!) {  streamPlaybackAccessToken(channelName: $login, params: {platform: "web", playerBackend: "mediaplayer", playerType: $playerType}) @include(if: $isLive) {    value    signature    __typename  }  videoPlaybackAccessToken(id: $vodID, params: {platform: "web", playerBackend: "mediaplayer", playerType: $playerType}) @include(if: $isVod) {    value    signature    __typename  }}',
    variables: {
      isLive: false,
      login: "",
      isVod: true,
      vodID: `${videoID}`,
      playerType: "site",
    },
  };
  return (await axios.post(ACCESS_TOKEN_URL, body, config)).data as TokenOutput;
};

const getPlaylists = async (id: string) => {
  const token = await getAccessToken(id);
  const PLAYLISTS_URL = `https://usher.ttvnw.net/vod/${id}.m3u8?nauthsig=${token.data.videoPlaybackAccessToken.signature}&nauth=${token.data.videoPlaybackAccessToken.value}&allow_source=true&player=twitchweb&allow_spectre=true&allow_audio_only=true`;
  const playlists: { [quality: string]: string } = {};
  ((await axios.get(PLAYLISTS_URL)).data as string)
    .split("\n")
    .filter(
      (info) => info.startsWith("#EXT-X-MEDIA") || info.startsWith("https")
    )
    .forEach((info, index, array) => {
      if (info.startsWith("#EXT-X-MEDIA")) {
        const firstIndex = info.indexOf("NAME") + 6;
        playlists[info.substring(firstIndex, info.indexOf('"', firstIndex))] =
          array[index + 1];
      }
    });

  return playlists;
};
export const getQualities = async (videoId: string): Promise<string[]> =>
  Object.keys(await getPlaylists(videoId));

const getPlaylist = async (videoId: string, quality: string) => {
  const playlists = await getPlaylists(videoId);
  const qualities = Object.keys(playlists);
  let selectedQuality = qualities[0];
  if (qualities.includes(quality)) selectedQuality = quality;
  const playlistUrl = playlists[selectedQuality];
  return {
    playlistData: ((await axios.get(playlists[selectedQuality], config))
      .data as string).split("\n"),
    baseUrl: playlistUrl.substring(0, playlistUrl.lastIndexOf("/")),
  };
};

const getVideoClip = async (url: string, newFilePath: string) => {
  const res = await axios.get(url, { responseType: "stream" });
  const stream = fs.createWriteStream(newFilePath);
  res.data.pipe(fs.createWriteStream(newFilePath));
  return new Promise((resolve, reject) => {
    res.data.on("end", () => {
      stream.close();
      resolve(null);
    });
    res.data.on("error", () => {
      reject({
        message: "Failed to download",
        url: url,
        filePath: newFilePath,
      });
    });
  });
};
const combineVideoClips = (
  path: string,
  startCropTime: number,
  startFileNum: number,
  lastFileNum: number,
  outputName: string,
  length: number
) => {
  let command = `ffmpeg -y -ss ${startCropTime} -i "concat:`;
  for (let i = startFileNum; i <= lastFileNum; i++) {
    if (i !== lastFileNum) command += `${path}\\${i}.ts|`;
    else command += `${path}\\${i}.ts"`;
  }
  command += ` -t ${length} -c copy ${outputName}`;
  return new Promise((resolve, reject) => {
    exec(command, (err) => {
      if (err) reject(err);
      resolve(null);
    });
  });
};
const getPlaylistInfo = (
  startTime: number,
  endTime: number,
  data: string[]
) => {
  if (startTime >= endTime) return null;
  let info: { partLength: number; name: string; fileIndex: number }[] = [];
  let actualTotalLength = 0;
  let fileIndex = 0;
  data.forEach((item, index) => {
    if (item.startsWith("#EXTINF:")) {
      const partLength = parseFloat(
        item.substring(item.indexOf(":") + 1, item.length - 1)
      );
      const name = data[index + 1];
      actualTotalLength += partLength;
      info.push({ partLength, name, fileIndex });
      fileIndex++;
    }
  });
  if (startTime > actualTotalLength) return null;

  // Simplifying the list of all video clips by specifying where the start video clip should be
  let tempTotalLength = 0;
  let startIndex = 0;
  let startCropTime = startTime;
  for (let i = 0; i < info.length; i++) {
    const partLength = info[i].partLength;
    if (tempTotalLength + partLength <= startCropTime)
      tempTotalLength += partLength;
    else {
      startCropTime -= tempTotalLength;
      startIndex = i;
      break;
    }
  }

  // Simplifying the list of video clips by specifying where the last video clip should be
  tempTotalLength = 0;
  let endIndex = info.length;
  for (let i = 0; i < info.length; i++) {
    const partLength = info[i].partLength;
    if (tempTotalLength >= endTime) {
      endIndex = i;
      break;
    }
    tempTotalLength += partLength;
  }
  // What the length of the final video should be
  const length =
    endTime > actualTotalLength
      ? actualTotalLength - startTime
      : endTime - startTime;
  info = info.slice(startIndex, endIndex);

  return { info, startCropTime, length };
};

export const getVideo = async (
  videoId: string,
  startTime: number,
  endTime: number,
  quality = "",
  outputPath: string,
  fileName: string | null
): Promise<string> => {
  const { playlistData, baseUrl } = await getPlaylist(videoId, quality);
  const playlistInfo = getPlaylistInfo(startTime, endTime, playlistData);
  if (playlistInfo) {
    const { info, startCropTime, length } = playlistInfo;
    const tmpobj = tmp.dirSync({ unsafeCleanup: true });
    const path = tmpobj.name;

    const promises = [];
    for (const item of info) {
      const { name, fileIndex } = item;
      promises.push(
        getVideoClip(`${baseUrl}/${name}`, `${path}/${fileIndex}.ts`)
      );
    }
    await Promise.all(promises);
    // Getting the final video file name
    const videoFileName = fileName
      ? `"${outputPath}\\${fileName}.mp4"`
      : `"${outputPath}\\${crypto.randomBytes(20).toString("hex")}.mp4"`;
    await combineVideoClips(
      path,
      startCropTime,
      info[0].fileIndex,
      info[info.length - 1].fileIndex,
      videoFileName,
      length
    );
    tmpobj.removeCallback();
    return videoFileName;
  }
  return null;
};
