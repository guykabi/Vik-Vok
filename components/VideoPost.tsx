"use client"

import React, { useEffect, useRef, useState } from 'react';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import { BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs';
import { GoVerified } from 'react-icons/go';
import { BsPlay } from 'react-icons/bs';

import { Video } from './../types';

interface IProps {
  post: Video;
  isShowingOnHome?: boolean;
}

const VideoPost: NextPage<IProps> = ({ post: { caption, postedBy, video, _id, likes }, isShowingOnHome}) => {
  const [playing, setPlaying] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null); 

  
  const onVideoPress = () => {
    if (playing) {
      videoRef?.current?.pause();
      setPlaying(false);
    } else {
      videoRef?.current?.play();
      setPlaying(true);
    }
  };

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [isVideoMuted]);


  if(!isShowingOnHome) {
    return (
      <div>
        <Link href={`/details/${_id}`} passHref>
          <video
            loop
            src={video.asset.url}
            className='w-[250px] md:w-full rounded-xl cursor-pointer'
          ></video>
        </Link>
            <div className='flex gap-2 -mt-8 items-center ml-4'>
              <p className='text-white text-lg font-medium flex gap-1 items-center'>
                <BsPlay className='text-2xl' />
                {likes?.length || 0}
              </p>
            </div>
        <Link href={`/details/${_id}`} as='type' passHref>
          <p className='mt-5 text-md text-gray-800 cursor-pointer w-210'>
            {caption}
          </p>
        </Link>
      </div>
    )
  } 


  return (
    <div className='relative flex flex-col border-b-2 m-auto pb-6 w-10/12 p-2 shadow-md	'>
      <div>
        <div className='flex gap-3 p-2 cursor-pointer font-semibold rounded'>
          <div className='md:w-16 md:h-16 w-10 h-10'>
            <Link href={`/profile/${postedBy?._id}`} passHref>
              <>
                <Image
                  width={62}
                  height={62}
                  className=' rounded-full hover:scale-110 '
                  src={postedBy?.image}
                  alt='user-profile'

                />
              </>
            </Link>
          </div>
          <div>
            <Link href={`/profile/${postedBy?._id}`} passHref>
              <div className='flex items-center gap-2'>
                <p className='flex gap-2 items-center md:text-md font-bold text-primary'>
                  {postedBy.userName}{' '}
                  <GoVerified className='text-blue-400 text-md' />
                </p>
                <p className='capitalize font-medium text-xs text-gray-500 hidden md:block'>
                  {postedBy.userName}
                </p>
              </div>
            </Link>
            <Link href={`/details/${_id}`} passHref>
              <p className='mt-2 font-normal '>{caption}</p>
            </Link>
          </div>
        </div>
      </div>
      <div className='absolute left-0 bottom-0 items-center flex flex-row pl-2 pb-2 text-xl z-10'>
            <BsPlay size={35}/>
            {likes?.length || 0}
        </div>
      <div className='relative flex lg:ml-20 flex gap-4 justify-center relative items-center pb-4'>
        <div
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className='rounded-3xl'
        >
          <Link href={`/details/${_id}`} passHref>
            <video
              loop
              ref={videoRef}
              src={video.asset.url}
              className='lg:w-[600px]  h-[300px] md:h-[400px] lg:h-[528px]  rounded-2xl cursor-pointer bg-gray-100 m-auto'
            ></video>
          </Link>

          {isHover && (
            <div className='absolute ml-6/12 bottom-10 inset-x-0	m-auto cursor-pointer left-8 md:left-14 lg:left-0 flex justify-between gap-10  w-[100px] md:w-[50px] lg:w-[600px] p-3'>
              {playing ? (
                <button onClick={onVideoPress}>
                  <BsFillPauseFill className='text-black text-2xl lg:text-4xl' />
                </button>
              ) : (
                <button onClick={onVideoPress}>
                  <BsFillPlayFill className='text-black text-2xl lg:text-4xl' />
                </button>
              )}
              {isVideoMuted ? (
                <button onClick={() => setIsVideoMuted(false)}>
                  <HiVolumeOff className='text-black text-2xl lg:text-4xl' />
                </button>
              ) : (
                <button onClick={() => setIsVideoMuted(true)}>
                  <HiVolumeUp className='text-black text-2xl lg:text-4xl' />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPost;