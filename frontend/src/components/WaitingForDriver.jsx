import React from 'react'
import { vehicleImages, vehicleLabels } from '../assets/vehicleAssets'

const WaitingForDriver = (props) => {
    if (!props.ride) return null

    const captainVehicleType = props.ride?.captain?.vehicle?.vehicleType || props.ride?.vehicleType || 'car'
    const vehicleImg = vehicleImages[captainVehicleType] || vehicleImages.car
    const vehicleLabel = vehicleLabels[captainVehicleType] || 'UberGo'

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setWaitingForDriver(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

            <div className='flex items-center justify-between mb-4'>
                <div>
                    <img className='h-16 object-contain' src={vehicleImg} alt={captainVehicleType} />
                    <p className='text-xs text-center text-gray-500 mt-1 font-medium'>{vehicleLabel}</p>
                </div>
                <div className='text-right'>
                    <h2 className='text-lg font-medium capitalize'>{props.ride?.captain?.fullname?.firstname} {props.ride?.captain?.fullname?.lastname}</h2>
                    <h4 className='text-xl font-semibold -mt-1 -mb-1'>{props.ride?.captain?.vehicle?.plate}</h4>
                    <p className='text-sm text-gray-600 capitalize'>{props.ride?.captain?.vehicle?.color} {captainVehicleType}</p>
                </div>
            </div>

            <div className='flex justify-between items-center mt-4 p-3 bg-yellow-50 border-2 border-yellow-400 rounded-xl'>
                <div>
                    <p className='text-sm text-gray-500 mb-1'>Share OTP with Captain</p>
                    <h1 className='text-3xl font-bold tracking-widest text-yellow-600'>{props.ride?.otp}</h1>
                </div>
                <i className="ri-lock-2-line text-3xl text-yellow-500"></i>
            </div>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill text-green-600"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{props.ride?.pickup?.split(',')[0]}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill text-red-500"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{props.ride?.destination?.split(',')[0]}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line text-blue-500"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.ride?.fare} </h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WaitingForDriver