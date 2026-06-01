import React from 'react'
import DomeGallery from './DoomGallery'


const page = () => {
  return (
    <div>
      <div className='h-96 border bg-black'>

      </div>
      <div style={{ width: '100vw', height: '100vh' }}>
        <DomeGallery
          fit={0.7}
          minRadius={100}
          maxVerticalRotationDeg={1}
          segments={30}
          dragDampening={1}
          // grayscale
        />
      </div>
    </div>
  )
}

export default page