const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    if (!apiKey || apiKey === 'dummy-google-maps-api-key') {
        console.log("No Google Maps API Key found. Fetching from Photon (OSM).");
        try {
            const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1`;
            const response = await axios.get(url);
            if (response.data && response.data.features && response.data.features.length > 0) {
                const feature = response.data.features[0];
                return {
                    ltd: feature.geometry.coordinates[1],
                    lng: feature.geometry.coordinates[0]
                };
            }
        } catch (err) {
            console.warn("Photon geocoding failed. Using mock coordinates.", err.message);
        }
        return {
            ltd: 19.0760 + (address.length % 10) * 0.01,
            lng: 72.8777 + (address.length % 7) * 0.01
        };
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[ 0 ].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.warn("Geocoding failed. Returning mock coordinates.", error.message);
        return {
            ltd: 19.0760 + (address.length % 10) * 0.01,
            lng: 72.8777 + (address.length % 7) * 0.01
        };
    }
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    if (!apiKey || apiKey === 'dummy-google-maps-api-key') {
        console.log("No Google Maps API Key found. Fetching route from OSRM.");
        try {
            const originCoords = await module.exports.getAddressCoordinate(origin);
            const destCoords = await module.exports.getAddressCoordinate(destination);
            
            const url = `https://router.project-osrm.org/route/v1/driving/${originCoords.lng},${originCoords.ltd};${destCoords.lng},${destCoords.ltd}?overview=false`;
            const response = await axios.get(url);
            
            if (response.data && response.data.routes && response.data.routes.length > 0) {
                const route = response.data.routes[0];
                return {
                    distance: {
                        text: `${(route.distance / 1000).toFixed(1)} km`,
                        value: Math.round(route.distance)
                    },
                    duration: {
                        text: `${Math.round(route.duration / 60)} mins`,
                        value: Math.round(route.duration)
                    }
                };
            }
        } catch (err) {
            console.warn("OSRM routing failed. Using mock distance/time.", err.message);
        }
        return {
            distance: { text: "15.2 km", value: 15200 },
            duration: { text: "32 mins", value: 1920 }
        };
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            if (response.data.rows[ 0 ].elements[ 0 ].status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }
            return response.data.rows[ 0 ].elements[ 0 ];
        } else {
            throw new Error('Unable to fetch distance and time');
        }
    } catch (err) {
        console.warn("DistanceMatrix failed. Returning mock distance/time.", err.message);
        return {
            distance: { text: "15.2 km", value: 15200 },
            duration: { text: "32 mins", value: 1920 }
        };
    }
}

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    const mockSuggestions = [
        `${input} Station, Mumbai`,
        `${input} Mall, Mumbai`,
        `${input} Airport, Mumbai`,
        `${input} Central, Mumbai`,
        `${input} Circle, Mumbai`
    ];

    if (!apiKey || apiKey === 'dummy-google-maps-api-key') {
        console.log("No Google Maps API Key found. Fetching suggestions from Photon (OSM).");
        try {
            const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(input)}&limit=5`;
            const response = await axios.get(url);
            if (response.data && response.data.features) {
                return response.data.features.map(f => {
                    const p = f.properties;
                    return [p.name, p.city || p.state, p.country].filter(Boolean).join(', ');
                });
            }
        } catch (err) {
            console.warn("Photon autocomplete failed. Using mock suggestions.", err.message);
        }
        return mockSuggestions;
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.warn("Autocomplete failed. Returning mock suggestions.", err.message);
        return mockSuggestions;
    }
}

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    // radius in km
    // NOTE: The captain location is stored as flat {ltd, lng} numbers (not GeoJSON),
    // so $geoWithin/$centerSphere won't work without a 2dsphere index.
    // We filter in-memory using the Haversine formula instead.

    const captains = await captainModel.find({ socketId: { $exists: true, $ne: null } });

    if (!captains.length) return [];

    function haversineKm(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    const nearby = captains.filter(captain => {
        if (!captain.location || captain.location.ltd == null || captain.location.lng == null) {
            // If captain has no location yet, include them anyway so new installs work
            return true;
        }
        const dist = haversineKm(ltd, lng, captain.location.ltd, captain.location.lng);
        return dist <= radius;
    });

    return nearby.length ? nearby : captains; // fallback: return all if none are in radius
}