import React from 'react'
import { vehicleImages } from '../assets/vehicleAssets'

const LookingForDriver = (props) => {
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setVehicleFound(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>Looking for a Driver</h3>

            {/* Animated search indicator */}
            <div className='flex flex-col items-center mb-5'>
                <div className='relative h-20 w-20 flex items-center justify-center'>
                    <div className='absolute inset-0 rounded-full border-4 border-yellow-400 animate-ping opacity-55'></div>
                    <div className='absolute inset-2 rounded-full border-4 border-yellow-500 animate-ping opacity-75 animation-delay-150'></div>
                    <img className='h-16 w-16 absolute rounded-full object-contain bg-white p-1 shadow-md' src={vehicleImages[props.vehicleType] || vehicleImages.car} alt="" />
                </div>
                <p className='text-sm text-gray-500 mt-3 animate-pulse'>Searching nearby drivers...</p>
            </div>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-2'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill text-green-600"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{props.pickup?.split(',')[0]}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill text-red-500"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{props.destination?.split(',')[0]}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line text-blue-500"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.fare[props.vehicleType]} </h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LookingForDriver