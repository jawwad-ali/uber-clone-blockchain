import { useEffect, useContext } from "react"
import mapboxgl from "mapbox-gl"
import Head from "next/head"
import { UberContext } from "../../context/uberContext"

const style = {
    wrapper: `flex-1 h-full w-full`,
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

const Map = () => {

    const { pickupCoordinates, dropoffCoordinates } = useContext(UberContext)

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-99.29011, 39.39178], // starting position [lng, lat]
            zoom: 3
        });

        if (pickupCoordinates) {
            addToMap(map, pickupCoordinates)
        } 

        if (dropoffCoordinates) {
            addToMap(map, dropoffCoordinates)
        } 

        if (pickupCoordinates && dropoffCoordinates) {
            map.fitBounds([dropoffCoordinates, pickupCoordinates], {
                padding: 200
            })
        } 
    }, [pickupCoordinates, dropoffCoordinates])

    // function to add Pins to map
    const addToMap = (map, coordinates) => {
        const marker1 = new mapboxgl.Marker().setLngLat(coordinates).addTo(map)
    }

    return (
        <>
            <Head>
                <link href='https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css' rel='stylesheet' />
            </Head>
            <div className={style.wrapper} id='map' />
        </>
    )
}

export default Map