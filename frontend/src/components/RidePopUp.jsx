import React from 'react'

const RidePopUp = (props) => {
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setRidePopupPanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>New Ride Available!</h3>
            <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-xl mt-4'>
                <div className='flex items-center gap-3'>
                    <img className='h-12 rounded-full object-cover w-12 border-2 border-white' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" />
                    <div>
                        <h2 className='text-lg font-semibold capitalize'>
                            {props.ride?.user?.fullname?.firstname} {props.ride?.user?.fullname?.lastname}
                        </h2>
                        <p className='text-xs text-yellow-800'>Passenger</p>
                    </div>
                </div>
                <div className='text-right'>
                    <h5 className='text-xl font-bold'>{props.ride?.distance ? (props.ride.distance / 1000).toFixed(1) : '2.2'} KM</h5>
                    <p className='text-xs text-yellow-800'>Distance</p>
                </div>
            </div>
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill text-green-600 text-lg"></i>
                        <div>
                            <h3 className='text-base font-semibold'>{props.ride?.pickup?.split(',')[0]}</h3>
                            <p className='text-sm -mt-1 text-gray-500'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill text-red-500"></i>
                        <div>
                            <h3 className='text-base font-semibold'>{props.ride?.destination?.split(',')[0]}</h3>
                            <p className='text-sm -mt-1 text-gray-500'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line text-blue-500 text-lg"></i>
                        <div>
                            <h3 className='text-base font-semibold'>₹{props.ride?.fare}</h3>
                            <p className='text-sm -mt-1 text-gray-500'>Cash</p>
                        </div>
                    </div>
                </div>
                <div className='mt-3 w-full flex gap-2'>
                    <button onClick={() => {
                        props.setConfirmRidePopupPanel(true)
                        props.confirmRide()
                    }} className='bg-green-600 flex-1 text-white font-semibold p-3 rounded-xl text-base'>
                        <i className="ri-checkbox-circle-line mr-1"></i>Accept
                    </button>
                    <button onClick={() => {
                        props.setRidePopupPanel(false)
                    }} className='bg-gray-200 flex-1 text-gray-700 font-semibold p-3 rounded-xl text-base'>
                        Ignore
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RidePopUp