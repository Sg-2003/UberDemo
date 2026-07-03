import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ConfirmRidePopUp = (props) => {
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()
        if (!otp || otp.length !== 6) {
            return setError('Please enter the 6-digit OTP from the passenger')
        }
        setError('')
        setLoading(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
                params: {
                    rideId: props.ride._id,
                    otp: otp
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('captain-token')}`
                }
            })

            if (response.status === 200) {
                props.setConfirmRidePopupPanel(false)
                props.setRidePopupPanel(false)
                navigate('/captain-riding', { state: { ride: props.ride } })
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setConfirmRidePopupPanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>Start the Ride</h3>
            <div className='flex items-center justify-between p-3 border-2 border-yellow-400 rounded-xl mt-4'>
                <div className='flex items-center gap-3'>
                    <img className='h-12 rounded-full object-cover w-12' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" />
                    <div>
                        <h2 className='text-lg font-medium capitalize'>{props.ride?.user?.fullname?.firstname} {props.ride?.user?.fullname?.lastname}</h2>
                        <p className='text-xs text-gray-500'>Passenger</p>
                    </div>
                </div>
                <h5 className='text-lg font-semibold'>{props.ride?.distance ? (props.ride.distance / 1000).toFixed(1) : '2.2'} KM</h5>
            </div>
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill text-green-600"></i>
                        <div>
                            <h3 className='text-base font-medium'>{props.ride?.pickup?.split(',')[0]}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill text-red-500"></i>
                        <div>
                            <h3 className='text-base font-medium'>{props.ride?.destination?.split(',')[0]}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line text-blue-500"></i>
                        <div>
                            <h3 className='text-base font-medium'>₹{props.ride?.fare}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>

                <div className='mt-4 w-full'>
                    <form onSubmit={submitHandler}>
                        <label className='block text-sm font-medium text-gray-600 mb-1'>Enter OTP from Passenger</label>
                        <input
                            value={otp}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                                setOtp(val)
                                setError('')
                            }}
                            type="text"
                            inputMode="numeric"
                            className='bg-[#eee] px-6 py-4 font-mono text-2xl text-center tracking-widest rounded-xl w-full mt-2 border-2 border-transparent focus:border-yellow-400 focus:outline-none'
                            placeholder='• • • • • •'
                            maxLength={6}
                        />

                        {error && (
                            <div className='flex items-center gap-2 bg-red-50 border border-red-300 rounded-lg p-3 mt-3'>
                                <i className="ri-error-warning-line text-red-500"></i>
                                <p className='text-sm text-red-600'>{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className='w-full mt-4 text-lg flex justify-center bg-green-600 disabled:bg-green-400 text-white font-semibold p-3 rounded-xl transition-all'
                        >
                            {loading ? (
                                <span className='flex items-center gap-2'>
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                    </svg>
                                    Verifying OTP...
                                </span>
                            ) : 'Start Ride'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                props.setConfirmRidePopupPanel(false)
                                props.setRidePopupPanel(false)
                            }}
                            className='w-full mt-2 bg-gray-200 text-lg text-gray-700 font-semibold p-3 rounded-xl'
                        >Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp