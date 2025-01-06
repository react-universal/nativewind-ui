// @ts-nocheck
import { createVariants } from '@native-twin/core';
  
export const Component = () => {
  return (
    <div>
      <div className={`bg-rose-700 bg-blue text(sm md:gray)`} />
      <div className='bg-blue' />
    </div>
  );
};
   
createVariants({
  base: 'bg-blue-200 bg-red-500 bg-black translate-x-2',
  variants: {
    variant: {
      primary: `bg-pink-200`,
      sec: 'bg-red-200',
    },
  },
});

lol2`bg-gray-100`;
