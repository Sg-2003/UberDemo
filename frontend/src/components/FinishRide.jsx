import React, { useState } from 'react'
import axios from 'axios'

const FinishRide = (props) => {
    const [loading, setLoading] = useState(false)
    const [ended, setEnded] = useState(false)

    async function endRide() {
        if (loading) return
        setLoading(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {
                rideId: props.ride._id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('captain-token')}`
                }
            })

            if (response.status === 200) {
                setEnded(true)
                // Don't navigate — wait for payment-completed socket event in CaptainRiding.jsx
            }
        } catch (err) {
            console.error('End ride error:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setFinishRidePanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>Finish this Ride</h3>
            <div className='flex items-center justify-between p-4 border-2 border-yellow-400 rounded-lg mt-4'>
                <div className='flex items-center gap-3 '>
                    <img className='h-12 rounded-full object-cover w-12' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" />
                    <h2 className='text-lg font-medium'>{props.ride?.user.fullname.firstname} {props.ride?.user.fullname.lastname}</h2>
                </div>
                <h5 className='text-lg font-semibold'>{props.ride?.distance ? (props.ride.distance / 1000).toFixed(1) : '2.2'} KM</h5>
            </div>
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill text-green-600"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{props.ride?.pickup.split(',')[0]}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill text-red-500"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{props.ride?.destination.split(',')[0]}</h3>
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

                <div className='mt-6 w-full'>
                    {ended ? (
                        <div className='bg-green-50 border border-green-300 rounded-xl p-4 flex flex-col items-center gap-2'>
                            <i className="ri-checkbox-circle-fill text-green-500 text-4xl"></i>
                            <p className='text-green-700 font-semibold text-center'>Ride ended! Waiting for passenger to pay...</p>
                        </div>
                    ) : (
                        <button
                            onClick={endRide}
                            disabled={loading}
                            className='w-full mt-5 flex text-lg justify-center bg-green-600 disabled:bg-green-400 text-white font-semibold p-3 rounded-lg transition-all'
                        >
                            {loading ? (
                                <span className='flex items-center gap-2'>
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                    </svg>
                                    Ending Ride...
                                </span>
                            ) : 'Finish Ride'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FinishRide