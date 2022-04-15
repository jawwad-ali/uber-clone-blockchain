import Navbar from "../components/Navbar/Navbar"

const style = {
  wrapper: `h-screen w-screen flex flex-col`,
}

export default function Home() {
  return (
    <div className={style.wrapper}>
      <Navbar />

      <div className={style.main}>
        {/* map */}
      </div>

      <div className={style.rideRequestContainer}>
        <div className={style.rideRequest}>
          {/* location server */}
          {/* confirm ride */}
        </div>
      </div>
    </div>
  )
}
// 16.27