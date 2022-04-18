import { useEffect } from "react"
import mapboxgl from "mapbox-gl"
import Head from "next/head"

const style = { 
    wrapper: `flex-1 h-full w-full`,
}  

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

const Map = () => {

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: 'map',
            // style: 'mapbox://styles/drakosi/ckvcwq3rwdw4314o3i2ho8tph',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-99.29011, 39.39178], // starting position [lng, lat]
            zoom: 3
        }); 
    }, [])

    return (
        <> 
            <Head>
                <link
                    href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
                    rel="stylesheet"
                />
            </Head>
            <div className={style.wrapper} id='map' />
        </>
    )
}

export default Map