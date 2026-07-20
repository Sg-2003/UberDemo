import React, { useRef, useState, useEffect, useContext, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LiveTracking from '../components/LiveTracking'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'
import { vehicleImages, vehicleLabels } from '../assets/vehicleAssets'
import { useToast } from '../context/ToastContext'

const CaptainRiding = () => {

    const [ finishRidePanel, setFinishRidePanel ] = useState(false)
    const finishRidePanelRef = useRef(null)
    const simulationRef = useRef(null)
    const location = useLocation()
    const rideData = location.state?.ride
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()
    const { captain } = useContext(CaptainDataContext)
    const { addToast } = useToast()

    const showBrowserNotification = (title, body) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body,
                icon: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png'
            })
        }
    }

    /* ── Location simulation: captain moves from pickup → destination ── */
    useEffect(() => {
        if (!captain?._id || !rideData) return;

        const handleConnect = () => {
            socket.emit('join', { userId: captain._id, userType: 'captain' })
        }

        if (socket.connected) {
            handleConnect()
        }

        socket.on('connect', handleConnect)

        // Clear any old simulation before starting a new one
        if (simulationRef.current) clearInterval(simulationRef.current)

        const startSimulation = async () => {
            try {
                const token = localStorage.getItem('captain-token');
                const [ pickupRes, destRes ] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
                        params: { address: rideData.pickup },
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
                        params: { address: rideData.destination },
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                const pc = pickupRes.data;
                const dc = destRes.data;

                if (pc?.ltd && dc?.ltd) {
                    let lat = pc.ltd, lng = pc.lng, step = 0;
                    const totalSteps = 60;

                    simulationRef.current = setInterval(() => {
                        if (step >= totalSteps) {
                            clearInterval(simulationRef.current);
                            simulationRef.current = null;
                            return;
                        }
                        lat = lat + (dc.ltd - lat) * 0.08;
                        lng = lng + (dc.lng - lng) * 0.08;
                        socket.emit('update-location-captain', {
                            userId: captain._id,
                            location: { ltd: lat, lng: lng }
                        });
                        step++;
                    }, 2000);
                }
            } catch (err) {
                console.error('Simulation error in CaptainRiding:', err);
            }
        };

        startSimulation();
        addToast('Ride started — navigate to destination!', 'info')
        showBrowserNotification('Ride Started', `Heading to ${rideData?.destination?.split(',')[0]}`)

        return () => {
            if (simulationRef.current) {
                clearInterval(simulationRef.current);
                simulationRef.current = null;
            }
            socket.off('connect', handleConnect)
        }
    }, [captain?._id, rideData?.pickup, rideData?.destination])  // stable deps only

    /* ── Payment received socket event ── */
    useEffect(() => {
        const handlePaymentCompleted = () => {
            addToast(`Payment received! ₹${rideData?.fare}`, 'success')
            showBrowserNotification(
                'Payment Received! 💰',
                `₹${rideData?.fare} received from ${rideData?.user?.fullname?.firstname || 'passenger'}`
            )
            setTimeout(() => navigate('/captain-home'), 3500)
        }
        socket.on('payment-completed', handlePaymentCompleted)
        return () => socket.off('payment-completed', handlePaymentCompleted)
    }, [socket, navigate, rideData, addToast])

    /* ── Slide-up panel animation ── */
    useGSAP(() => {
        if (!finishRidePanelRef.current) return;
        gsap.to(finishRidePanelRef.current, {
            transform: finishRidePanel ? 'translateY(0)' : 'translateY(100%)',
            duration: 0.35,
            ease: 'power2.out'
        })
    }, [ finishRidePanel ])

    const vType = rideData?.vehicleType || 'car'
    const vehicleLabel = vehicleLabels[vType] || 'UberGo'
    const vehicleImg = vehicleImages[vType] || vehicleImages.car

    return (
        <div className='h-screen relative overflow-hidden'>

            {/* Full-screen map — full z-index so it's interactive */}
            <div className='absolute inset-0 z-0'>
                <LiveTracking ride={rideData} />
            </div>

            {/* Toast Notifications — rendered by global ToastProvider */}

            {/* Top bar */}
            <div className='absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-4 pointer-events-none'>
                <img className='w-14 pointer-events-auto' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
                <Link
                    to='/captain-home'
                    className='h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md pointer-events-auto'
                >
                    <i className="text-lg ri-home-5-line"></i>
                </Link>
            </div>

            {/* Bottom HUD — tap to open FinishRide panel */}
            <div className='absolute bottom-0 left-0 right-0 z-20'>
                <div
                    className='bg-yellow-400 rounded-t-3xl shadow-2xl cursor-pointer select-none'
                    onClick={() => setFinishRidePanel(true)}
                >
                    {/* Drag handle */}
                    <div className='flex justify-center pt-3 pb-2'>
                        <div className='h-1 w-10 bg-yellow-600 rounded-full opacity-40'></div>
                    </div>

                    <div className='px-5 pb-6 pt-1 flex items-center justify-between gap-3'>
                        {/* Vehicle + Passenger Info */}
                        <div className='flex items-center gap-3 min-w-0'>
                            <img
                                src={vehicleImg}
                                alt={vehicleLabel}
                                className='h-14 w-20 object-contain flex-shrink-0'
                            />
                            <div className='min-w-0'>
                                <p className='text-[10px] text-yellow-900 font-bold uppercase tracking-widest'>{vehicleLabel}</p>
                                <h4 className='text-base font-bold text-black leading-tight truncate'>
                                    {rideData?.user?.fullname?.firstname || 'Passenger'} {rideData?.user?.fullname?.lastname || ''}
                                </h4>
                                <p className='text-xs text-yellow-800 font-medium'>
                                    {rideData?.distance ? `${(rideData.distance / 1000).toFixed(1)} km` : 'En Route'}
                                    {rideData?.fare ? ` • ₹${rideData.fare}` : ''}
                                </p>
                            </div>
                        </div>

                        {/* Complete button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setFinishRidePanel(true) }}
                            className='flex-shrink-0 bg-black text-white font-bold py-3 px-5 rounded-2xl text-sm shadow-lg active:scale-95 transition-transform whitespace-nowrap'
                        >
                            <i className="ri-flag-fill mr-1"></i>
                            Complete
                        </button>
                    </div>
                </div>
            </div>

            {/* Finish Ride Slide-up Panel */}
            <div
                ref={finishRidePanelRef}
                className='fixed w-full z-50 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 rounded-t-3xl shadow-2xl'
            >
                <FinishRide
                    ride={rideData}
                    setFinishRidePanel={setFinishRidePanel}
                />
            </div>

            {/* Slide-down keyframe (inline fallback) */}
            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}

export default CaptainRiding