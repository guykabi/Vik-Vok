"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { GoVerified } from 'react-icons/go';
import Link from 'next/link';

import NoResults from '../../components/NoResults';
import VideoPost from '../../components/VideoPost';
import authStore from '../../zustore/auth-store';
import { IUser, Video } from '../../types';

const Search = ({ videos }: { videos: Video[] }) => {
  const [isAccounts, setIsAccounts] = useState(false);
  const { allUsers }: { allUsers: IUser[] } = authStore();
  
  const {key} = useParams();
  
  const accounts = isAccounts ? 'border-b-2 border-black' : 'text-gray-400';
  const isVideos = !isAccounts ? 'border-b-2 border-black' : 'text-gray-400';
  const searchedAccounts = allUsers?.filter((user: IUser) => user.userName.toLowerCase().includes(key));
  
  return (
    <div className='w-full'>
      <div className='flex gap-10 mb-10  border-gray-200 z-50  w-full mb-10'>
        <p onClick={() => setIsAccounts(true)} className={`text-xl  font-semibold cursor-pointer ${accounts} mt-2`}>
          Accounts
        </p>
        <p className={`text-xl font-semibold cursor-pointer ${isVideos} mt-2`} onClick={() => setIsAccounts(false)}>
          Videos
        </p>
      </div>
      {isAccounts ? (
        <div className='mt-16'>
          {searchedAccounts.length > 0 ? (
            searchedAccounts.map((user: IUser, idx: number) => (
              <Link key={idx} href={`/profile/${user._id}`}>
                <div className=' flex gap-3 p-2 cursor-pointer font-semibold rounded border-b-2 border-gray-200'>
                  <div>
                    <Image width={50} height={50} className='rounded-full' alt='user-profile' src={user.image}/>
                  </div>
                  <div>
                    <div>
                      <p className='flex gap-1 items-center text-lg font-bold text-primary'>
                        {user.userName} <GoVerified className='text-blue-400' />
                      </p>
                      <p className='capitalize text-gray-400 text-sm'>
                        {user.userName}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <NoResults text={`No Account Results for ${key}`} />
          )}
        </div>
      ) : (
        <div className='md:mt-16 flex flex-wrap gap-6 md:justify-start '>
          {videos.length ? (
            videos.map((post: Video, idx: number) => (
              <VideoPost post={post} key={idx} />
            ))
          ) : (
            <NoResults text={`No Video Results for ${key}`} />
          )}
        </div>
      )}
    </div>
  );
};



export default Search;