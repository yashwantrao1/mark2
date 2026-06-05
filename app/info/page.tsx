import Image from 'next/image'
import React from 'react'
import Footer from '@/app/components/Footer'
import InfoProcessSection from '@/app/info/InfoProcessSection'
import WorkWithUs from '../components/WorkWithUs'
import Link from 'next/link'

const page = () => {
  return (
    <>
      <div className='h-screen 2xl:px-44 px-24 2xl:pr-0 pr-0 pt-14 overflow-hidden min-h-[700px] bg-(--offWhite)'>
        <div className='h-full w-full  grid 2xl:grid-cols-2 grid-cols-[60%_40%] text-(--charcoleBlack)'>
          <div className='col-[60%]'>
            <h2 className='text-sm font-bold'>About me</h2>
            <div className='pl-10 py-10 2xl:text-5xl text-4xl font-light leading-snug'>
              <p>Turning imagination into interaction, I craft AI-powered and full-stack solutions that balance innovation, usability, and performance. My focus is on building digital experiences that feel seamless, scale effortlessly, and create meaningful value.</p>
              <p className='mt-10 text-[8vw] font-light leading-none'>Yashwant
                <span className='text-[8vw] font-light leading-none -ml-30 inline-block whitespace-pre'><span className='invisible'>Yashwant</span> Rao</span></p>
            </div>
          </div>
          <div className='w-full h-full'>
            <Image src="/img/yashwant_rao.webp" alt="Yashwant Rao, AI Focused Full Stack Developer" width={500} height={500} className='w-full h-full object-contain grayscale-100 object-right' />
          </div>
        </div>
      </div>

      <InfoProcessSection />
      {/* Crafting Meaningful Digital Experiences With Purpose And Precision */}
      <div className=' my-64 uppercase text-(--charcoleBlack)'>
        <div className=''>
          <div>
            <div className=' 2xl:px-44 px-24'>
              <h3 className='text-sm font-bold'>The Manifesto</h3>
              <p className='text-[10vw] font-light leading-[1.4cap]'>Crafting</p>
            </div>
            <p className='text-[10vw] font-light leading-[1.4cap] ml-44 pl-44'>Meaningful</p>
            <div className='flex gap-5'>
              <div className='w-full h-auto relative'>
                <Image src="/img/manifesto_image.jpg" alt="Manifesto" width={500} height={500} className='absolute inset-0 w-full h-full object-cover opacity-75' />
              </div>
              <div className='pr-10'>
                <p className='text-[10vw] font-light leading-[1.4cap] '>Digital</p>
                <p className='text-[10vw] font-light leading-[1.4cap]'>Experiences</p>
              </div>
            </div>
            <div className='flex items-center gap-5'>
              <div className='pl-60'>
                <p className='text-[10vw] font-light leading-[1.4cap] text-right'>With</p>
                <p className='text-[10vw] font-light leading-[1.4cap] text-center'>Purpose</p>
              </div>
              <div>
                <Image src="/img/purpose.jpeg" alt="Manifesto" width={500} height={500} className='w-full h-full object-cover opacity-75' />
              </div>
            </div>
            <p className='text-[10vw] font-light leading-[1.4cap] text-center'>And</p>
            <p className='text-[10vw] font-light leading-[1.4cap] text-center'>Precision</p>
          </div>
        </div>
      </div>

      <div className='h-screen max-h-[700px] flex items-center justify-center flex-col gap-10 text-(--charcoleBlack)'>
        <p className='text-center text-3xl font-light leading-snug max-w-5xl mx-auto'>Every project is an opportunity to transform complexity into clarity. Through a blend of strategy, design, and engineering, I create digital experiences that are intuitive, scalable, and built to make a lasting impact.</p>
        <Link href="/work" className='border px-8 py-2 bg-(--offWhite) text-(--charcoleBlack) relative translate-x-0 translate-y-0 shadow-[5px_5px_0px_rgba(0,0,0,0.50)] active:shadow-[0px_0px_0px_rgba(0,0,0,0.50)] active:translate-x-[5px] active:translate-y-[5px]'>View The Work</Link>
      </div>
      <div className='2xl:px-44 px-24 '>
        <WorkWithUs theme={false} />
      </div>
      <Footer />
    </>
  )
}

export default page