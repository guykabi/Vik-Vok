import React, { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GoVerified } from 'react-icons/go';
import { Button } from './UI/Button';

import authStore from '../zustore/auth-store';
import NoResults from './NoResults';
import { IUser } from '../types';

interface IProps {
  isPostingComment: Boolean;
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
  addComment: (e: React.FormEvent) => void;
  comments: IComment[];
}

interface IComment {
  comment: string;
  length?: number;
  _key: string;
  postedBy: { _ref?: string; _id?: string };
}

const Comments = ({ comment, setComment, addComment, comments, isPostingComment }: IProps) => {
  const { allUsers, userProfile }: any = authStore();

  return (
    <div className=' relative bottom-0 border-t-2 border-gray-200 pt-4 px-10 mt-4 bg-[#F8F8F8] border-b-2 lg:pb-0 pb-[100px]'>
      <div className='overflow-scroll no-scrollbar lg:h-[457px]'>
        {comments?.length > 0 ? (
          comments?.map((item: IComment, idx: number) => (
            <div key={idx}>
              {allUsers?.map(
                (user: IUser) =>
                  user._id === (item.postedBy._ref || item.postedBy._id) && (
                    <div className=' p-2 items-center' key={idx}>
                      <Link href={`/profile/${user._id}`} passHref>
                        <div className='flex items-start gap-3'>
                          <div className='w-12 h-12'>
                            <Image
                              width={48}
                              height={48}
                              className='rounded-full cursor-pointer'
                              src={user.image}
                              alt='user-profile'
                            />
                          </div>

                          <p className='flex cursor-pointer gap-1 items-center text-[18px] font-bold leading-6 text-primary'>
                            {user.userName}{' '}
                            <GoVerified className='text-blue-400' />
                          </p>
                        </div>
                      </Link>
                      <div>
                        <p className='-mt-5 ml-16 text-[16px] mr-8'>
                          {item.comment}
                        </p>
                      </div>
                    </div>
                  )
              )}
            </div>
          ))
        ) : (
          <NoResults text='No Comments Yet' subText='Be the first...' />
        )}
      </div>
     {userProfile && <div className='absolute bottom-0 left-0  pb-6 px-2 md:px-10 w-full '>
        <form onSubmit={addComment} className='flex gap-4'>
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className='bg-primary px-6 py-4 text-md font-medium border-2 w-[250px] md:w-9/12 lg:w-[350px] border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 flex-1 rounded-lg'
            placeholder='Add comment..'
          />
          <Button 
          type='submit' 
          text={isPostingComment ? 'Commenting...' : 'Comment'}
          color='blue'
          textColor='white'
          width='6'
          disable={comment?.length==0}/>
            
        </form>
      </div>}
    </div>
  );
};

export default Comments;