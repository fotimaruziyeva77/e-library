import Image from 'next/image'
import React from 'react'

function Page() {
  return (
    <div>
        <Image
            src={'/assets/call.png'}
            alt='Not Found'
            width={800}
            height={900}
            className='mx-auto'/>	 <br />
        <h1 className='text-center text-4xl font-medium uppercase'>Bunday kutubxona mavjud emas qo'llab-quvvatlash xizmatiga murojaat qiling</h1> <br />
        <br />
    </div>
  )
}

export default Page