/*global google*/
import tripService from '../services/trip'

export const saveOfflineTrips = async () => {
    const trips = JSON.parse(window.localStorage.getItem('savedOfflineTrips'))
    const geocoder = new window.google.maps.Geocoder()
    const directionService = new google.maps.DirectionsService()

    return new Promise(async (resolve, reject) => {
        await Promise.all(trips.map(async trip => {
            await geocoder.geocode({ 'address': trip.startAddress }, (results, status) => {
                if (status === 'OK') {
                    trip.start = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() }
                }
            })
            await geocoder.geocode({ 'address': trip.endAddress }, (results, status) => {
                if (status === 'OK') {
                    trip.end = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() }
                }
            })
        })).then(async () => {
            await Promise.all(trips.map(async trip => {
                await directionService.route({
                    origin: trip.startAddress,
                    destination: trip.endAddress,
                    travelMode: google.maps.TravelMode.DRIVING
                }, (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        trip.length = result.routes[0].legs.map(leg => leg.distance.value).reduce((total, current) => { return total + current })
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                });
            })).then(async () => {
                setTimeout(async () => {
                    const savedTrips = []
                    await Promise.all(trips.map(async trip => {
                        try {
                            const savedTrip = await tripService.saveOne({ ...trip, start: JSON.stringify(trip.start), end: JSON.stringify(trip.end), markers: JSON.stringify([]) })
                            savedTrips.push(savedTrip)
                        } catch (error) {
                            console.log(error)
                        }
                    })).then(() => {
                        window.localStorage.setItem('savedOfflineTrips', JSON.stringify([]))
                        console.log("Cached trips sent!")
                        resolve(savedTrips)
                    })
                }, 1000)

            })
        }
        )
    })
}