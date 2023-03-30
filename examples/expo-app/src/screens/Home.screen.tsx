import React from 'react';
import { H1, H2, View } from '@universal-labs/primitives';

function HomeScreen() {
  return (
    <View className='flex-1'>
      <View className='bg-slate-80 group flex-[2] items-center justify-center hover:bg-gray-600'>
        <H1 className='text-primary font-inter-bold text-2xl hover:text-gray-900'>
          Nested Hover
        </H1>
        {/* <TextInput className='w-full bg-pink-400 focus:bg-gray-100' />
        <TextInput className='w-full bg-pink-400 focus:bg-gray-100 focus:px-10' /> */}
        <View className='mb-2 translate-x-10 rounded-lg bg-slate-300 p-2 group-hover:bg-gray-800'>
          <H2
            suppressHighlighting
            className='font-inter-bold text-xl text-gray-800 group-hover:text-gray-300'
          >
            Deeply nested hover
          </H2>
        </View>
      </View>
    </View>
  );
}

export { HomeScreen };
