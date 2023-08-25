import React from 'react'
import { AiFillStar } from 'react-icons/ai';

function AvailabilityTableSingleRow() {

  var number = [];
  for (var i = 1; i <= 31; i++) {
    number.push(i);
  }

  return (
    <tbody className="text-sm">
      <tr
        className="border-b border-tableBorderColor"
      >
        <td className="p-3">
          Hotel name comes here
        </td>
        <td className="p-3">
          Dubai
        </td>
        <td className="p-3">
          <span className='text-green-600'>Available</span>
        </td>
        <td className="p-3">
          <div className="flex gap-[4px] items-center">
            <span className=''>5</span>
            <span className='text-lg text-yellow-500'><AiFillStar /> </span>
          </div>
        </td>
        <td className='underline text-blue-600 cursor-pointer'>
          Book now
        </td>
      </tr>
      <tr className='w-full'>
        <td colSpan="5">
          <div className='bg-[#f3f6f9] h-7 flex items-center px-3 font-[500]'>
            <p className=''>January</p>
          </div>
        </td>
      </tr>
      <tr className='w-full'>
        <td colSpan="5">
          <div className='w-11/12 grid grid-cols-12 h-7 items-center'>
            <div className='col-span-2'>
              <div className=' w-full whitespace-nowrap h-7  text-center px-3'></div>
            </div>
            <div className='col-span-10 flex justify-between items-center'>
              {number.map((item, index) => (
                <div className='border-x w-full h-7 flex justify-center items-center' key={index}>{item} </div>
              ))}
            </div>
          </div>
        </td>
      </tr>
      <tr className='w-full'>
        <td colSpan="5">
          <div className='w-11/12 grid grid-cols-12 h-7 items-center'>
            <div className='col-span-2'>
              <div className=' w-full whitespace-nowrap  h-7 text-center px-3'>Regency Room </div>
            </div>
            <div className='col-span-10 flex justify-between'>
              {number.map((item, index) => (
                <div className='border h-7 w-full text-center text-white' key={index}> .</div>
              ))}
            </div>
          </div>
        </td>
      </tr>
      <tr className='w-full'>
        <td colSpan="5">
          <div className='w-11/12 grid grid-cols-12 h-7 items-center'>
            <div className='col-span-2'>
              <div className=' w-full whitespace-nowrap h-7 text-center px-3'>Deluxe Room </div>
            </div>
            <div className='col-span-10 flex justify-between'>
              {number.map((item, index) => (
                <div className='border h-7 w-full text-center text-white' key={index}>. </div>
              ))}
            </div>
          </div>
        </td>
      </tr>
      <tr className='w-full'>
        <td colSpan="5">
          <div className='w-11/12 grid grid-cols-12 h-7 items-center'>
            <div className='col-span-2'>
              <div className=' w-full whitespace-nowrap h-7  text-center px-3'>Club Room </div>
            </div>
            <div className='col-span-10 flex justify-between'>
              {number.map((item, index) => (
                <div className='border w-full flex justify-center items-center h-7 text-white' key={index}>. </div>
              ))}
            </div>
          </div>
        </td>
      </tr>
      <tr className='w-full'>
        <td colSpan="5">
          <div className='w-11/12 grid grid-cols-12 h-7 items-center'>
            <div className='col-span-2'>
              <div className=' w-full whitespace-nowrap h-7 text-center px-3'>Club Deluxe Room</div>
            </div>
            <div className='col-span-10 flex justify-between'>
              {number.map((item, index) => (
                <div className='border w-full h-7 text-white flex justify-center items-center' key={index}>. </div>
              ))}
            </div>
          </div>
        </td>
      </tr>
      <tr className='w-full'>
        <td colSpan="5">
          <div className='w-11/12 grid grid-cols-12 h-7 items-center'>
            <div className='col-span-2'>
              <div className=' w-full whitespace-nowrap h-7 text-center px-3'>Regency Suite</div>
            </div>
            <div className='col-span-10 flex justify-between'>
              {number.map((item, index) => (
                <div className='border w-full flex justify-center items-center h-7 text-white' key={index}>. </div>
              ))}
            </div>
          </div>
        </td>
      </tr>

    </tbody>
  )
}

export default AvailabilityTableSingleRow