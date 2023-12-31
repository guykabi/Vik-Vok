"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {handleToast} from '../../utils/toastify'
import { SanityAssetDocument } from '@sanity/client';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useErrorBoundary } from "react-error-boundary";
import { MdDelete } from 'react-icons/md';
import axios from '../api/api-instance';

import  client  from '../../sanity/config/client-config';
import authStore from '../../zustore/auth-store';
import { topics } from '../../utils/constants';


const Upload = () => {
  const [caption, setCaption] = useState('');
  const [topic, setTopic] = useState<String>(topics[0].name);
  const [loading, setLoading] = useState<Boolean>(false);
  const [savingPost, setSavingPost] = useState<String | undefined>('Post');
  const [videoAsset, setVideoAsset] = useState<SanityAssetDocument | undefined>();
  const [wrongFileType, setWrongFileType] = useState<Boolean>(false);
  const { showBoundary } = useErrorBoundary();


  const userProfile: any = authStore((state) => state.userProfile);
  const router = useRouter();

  useEffect(() => {
    if (!userProfile) router.push('/');
  }, [userProfile, router]);

  const uploadVideo = async (e: any) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile.type.includes('video')) {
      
      setWrongFileType(false);
      setLoading(true);
  
         let uploaded = await client.assets
         .upload('file', selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        
        setVideoAsset(uploaded);
        setLoading(false);
   
    } else {
      setLoading(false);
      setWrongFileType(true);
   }
  };

  const handlePost = async () => {
    if (caption && videoAsset?._id && topic) {
      setSavingPost('Posting...');

      const newPost = {
        _type: 'post',
        caption,
        video: {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: videoAsset?._id,
          },
        },
        userId: userProfile?._id,
        postedBy: {
          _type: 'postedBy',
          _ref: userProfile?._id,
        },
        topic,
      }; 


      try{
        await axios.post('post', newPost);
        handleToast('success','Your post is ready!')
        router.push('/');
      }catch(err:any){

       if(err.response.status == 500){
          showBoundary(err)
       }
       else{
        
        setSavingPost('Unabled to post')
        let timer = setTimeout(()=>{
           setSavingPost('Post')
        },3000)
        return ()=> clearTimeout(timer)
       }
     }
              
    }
  };

  const handleDiscard = () => {
    setSavingPost('Post');
    setVideoAsset(undefined);
    setCaption('');
    setTopic('');
  };

  return (
    <div className='flex w-full h-[100vh]	 absolute left-0 top-[60px] lg:top-[70px] mb-10 pt-10 lg:pt-20 bg-[#F8F8F8] justify-center'>
      <div className=' bg-white rounded-lg h-fit flex gap-6 flex-wrap justify-center items-center p-14 pt-4'>
        <div>
          <div>
            <p className='text-2xl font-bold'>Upload Video</p>
            <p className='text-md text-gray-400 mt-1'>Share a video</p>
          </div>
          <div className=' border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center  outline-none mt-10 w-[260px] h-[458px] p-10 cursor-pointer hover:border-blue-400 hover:bg-gray-100'>
            {loading ? (
              <p className='text-center text-3xl text-sky-500	 font-semibold'>
                Uploading...
              </p>
            ) : (
              <div>
                {!videoAsset ? (
                  <label className='cursor-pointer'>
                    <div className='flex flex-col items-center justify-center h-full'>
                      <div className='flex flex-col justify-center items-center'>
                        <p className='font-bold text-xl'>
                          <FaCloudUploadAlt className='text-gray-300 text-6xl' />
                        </p>
                        <p className='text-xl font-semibold'>
                          Select video to upload
                        </p>
                      </div>

                      <p className='text-gray-400 text-center mt-10 text-sm leading-10'>
                        Only a video<br />
                        720x1280 resolution or higher <br />
                        Up to 10 minutes <br />
                      </p>
                      <p className='bg-[#3b82f6] text-center mt-8 rounded text-white text-md font-medium p-2 w-52 outline-none'>
                        Select file
                      </p>
                    </div>
                    <input
                      type='file'
                      name='upload-video'
                      accept="video/*"
                      onChange={(e) => uploadVideo(e)}
                      className='w-0 h-0'
                    />
                  </label>
                ) : (
                  <div className=' rounded-3xl w-[300px]  p-4 flex flex-col gap-6 justify-center items-center'>
                    <video
                      className='rounded-xl h-[462px] mt-16 bg-black'
                      controls
                      loop
                      src={videoAsset?.url}
                    />
                    <div className=' flex justify-between gap-20 h-10 max-h-10'>
                      <p className='text-lg'>{videoAsset.originalFilename}</p>
                      <button
                        type='button'
                        className=' rounded-full bg-gray-200 text-red-400 p-2 text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                        onClick={() => setVideoAsset(undefined)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {wrongFileType && (
            <p className='text-center text-xl text-red-400 font-semibold mt-2 w-[260px]'>
              Select an video file (mp4 or webm)
            </p>
          )}
        </div>
        <div className='flex flex-col gap-3 pb-10 mt-8'>
          <label className='text-md font-medium '>Caption</label>
          <input
            maxLength={30}
            type='text'
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className='rounded lg:after:w-650 outline-none text-md border-2 border-gray-200 p-2'
          />
          <label className='text-md font-medium '>Choose a topic</label>

          <select
            onChange={(e) => {
              setTopic(e.target.value);
            }}
            className='outline-none lg:w-650 border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded cursor-pointer'
          >
            {topics.map((item) => (
              <option
                key={item.name}
                className=' outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300'
                value={item.name}
              >
                {item.name}
              </option>
            ))}
          </select>
          <div className='flex gap-6 mt-4'>
            <button
              onClick={handleDiscard}
              type='button'
              className='border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none'
            >
              Discard
            </button>
            <button
              disabled={videoAsset?.url ? false : true}
              onClick={handlePost}
              type='button'
              className='bg-[#3b82f6] text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none'
            >
              {savingPost}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



export default Upload;