import React, { useContext, useState, useEffect } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'

const CaptainDetails = () => {

    const { captain } = useContext(CaptainDataContext)
    const [onlineTime, setOnlineTime] = useState(0) // minutes online this session

    useEffect(() => {
        const start = Date.now()
        const interval = setInterval(() => {
            setOnlineTime(Math.round((Date.now() - start) / 60000))
        }, 60000)
        return () => clearInterval(interval)
    }, [])

    if (!captain) return null;

    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start gap-3'>
                    <img className='h-12 w-12 rounded-full object-cover border-2 border-yellow-400' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
                    <div>
                        <h4 className='text-lg font-semibold capitalize'>{captain.fullname.firstname} {captain.fullname.lastname}</h4>
                        <p className='text-xs text-gray-500 capitalize'>{captain.vehicle?.color} {captain.vehicle?.vehicleType} · {captain.vehicle?.plate}</p>
                    </div>
                </div>
                <div className='text-right'>
                    <div className='flex items-center gap-1'>
                        <div className='h-2 w-2 rounded-full bg-green-500 animate-pulse'></div>
                        <span className='text-sm text-green-600 font-medium'>Online</span>
                    </div>
                </div>
            </div>
            <div className='flex p-4 mt-6 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-timer-2-line text-blue-500"></i>
                    <h5 className='text-lg font-semibold'>{onlineTime}</h5>
                    <p className='text-xs text-gray-600'>Mins Online</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-speed-up-line text-orange-500"></i>
                    <h5 className='text-lg font-semibold'>{captain.vehicle?.capacity}</h5>
                    <p className='text-xs text-gray-600'>Capacity</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-car-line text-green-500"></i>
                    <h5 className='text-lg font-semibold capitalize'>{captain.vehicle?.vehicleType}</h5>
                    <p className='text-xs text-gray-600'>Vehicle Type</p>
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails