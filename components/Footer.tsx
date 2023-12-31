import React from 'react'
import { NextPage } from 'next';
import { footerItemsTop, footerItems } from '../utils/constants';

const List = ({ items, mt }: { items: string[], mt: Boolean }) => (
    <div className={`flex flex-wrap gap-2 ${mt && 'mt-5'}`}>
      {items.map((item: string) => (
        <p key={item} className='text-gray-400 text-sm  hover:underline cursor-pointer' >
          {item}
        </p>
      ))}
    </div>
  );

const Footer :NextPage= () => {
  return (
    <div className='mt-6 hidden xl:block'>
    <List items={footerItemsTop} mt={false} />
    <List items={footerItems} mt />
    <p className='text-gray-400 text-sm mt-5'>© 2023 Vik-Vok</p>
  </div>
  )
}

export default Footer