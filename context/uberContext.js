import { createContext, useEffect, useState } from "react"
import { faker } from "@faker-js/faker"

export const UberContext = createContext()

export const UberProvider = ({ children }) => {

    const [pickup, setPickup] = useState('')
    const [dropoff, setDropoff] = useState('')
    const [pickupCoordinates, setPickupCoordinates] = useState()
    const [dropoffCoordinates, setDropoffCoordinates] = useState()
    const [selectedRide, setSelectedRide] = useState([])
    const [price, setPrice] = useState()

    // account address
    const [currentAccount, setCurrentAccount] = useState()
    // userInfo
    const [currentUser, setCurrentUser] = useState([])
    const [basePrice, setBasePrice] = useState()

    // MetaMask Auth
    let metamask

    if (typeof window !== "undefined") {
        metamask = window.ethereum
    }

    useEffect(() => {
        checkIfWalletIsConnected()
    }, [])

    useEffect(() => {
        if (!currentAccount) return
        requestToGetCurrentUserInfo(currentAccount)
    }, [currentAccount])



    // Wallet Connection
    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) return

        try {
            const addressArray = await window.ethereum.request({
                method: 'eth_accounts',
            })

            if (addressArray.length > 0) {
                setCurrentAccount(addressArray[0])
                requestToCreateUserOnSanity(addressArray[0])
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    // connectWallet function
    const connectWallet = async () => {
        if (!window.ethereum) return

        try {
            const addressArray = await window.ethereum.request({
                method: 'eth_requestAccounts',
            })

            if (addressArray.length > 0) {
                setCurrentAccount(addressArray[0])
                requestToCreateUserOnSanity(addressArray[0])
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    // Create a user document on sanity if it doesnt exists
    const requestToCreateUserOnSanity = async (address) => {
        if (!window.ethereum) return
        try {
            await fetch("/api/db/createUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userWalletAddress: address,
                    name: faker.name.findName()
                })
            })

        }
        catch (err) {
            console.log(err)
        }
    }

    // GetLocation  
    const createLocationCoordinatePromise = (locationName, locationType) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch('/api/map/getLocationCoordinates', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        location: locationName,
                    }),
                })

                const data = await response.json()

                if (data.message === 'success') {
                    switch (locationType) {
                        case 'pickup':
                            setPickupCoordinates(data.data)
                            break
                        case 'dropoff':
                            setDropoffCoordinates(data.data)
                            break
                    }
                    resolve()
                } else {
                    reject()
                }
            } catch (error) {
                console.error(error)
                reject()
            }
        })
    }

    // getCurrentUserInfo  
    const requestToGetCurrentUserInfo = async (walletAddress) => {
        try {
            const response = await fetch(`/api/db/getUserInfo?walletAddress=${walletAddress}`)
            const data = await response.json()
            setCurrentUser(data.data)
        }
        catch (err) {
            console.log(err)
        }
    }

    // useEffect  
    useEffect(() => {
        if (pickup && dropoff) {
            ; (async () => {
                await Promise.all([
                    createLocationCoordinatePromise(pickup, "pickup"),
                    createLocationCoordinatePromise(dropoff, "dropoff")
                ])
            })()
        }
        else return
    }, [pickup, dropoff])

    // calculate price
    useEffect(() => {
        if (!dropoffCoordinates && !pickupCoordinates) return
        (async () => {
            try {
                const response = await fetch("/api/map/getDuration", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        pickupCoordinates: `${pickupCoordinates[0]},${pickupCoordinates[1]}`,
                        dropoffCoordinates: `${dropoffCoordinates[0]},${dropoffCoordinates[1]}`
                    })
                })
                const data = await response.json()
                setBasePrice(Math.round(await data.data))
            }
            catch (err) {
                console.log(err)
            }
        })()
    }, [])

    return (
        <UberContext.Provider
            value={{
                pickup,
                setPickup,
                dropoff,
                setDropoff,
                pickupCoordinates,
                setPickupCoordinates,
                dropoffCoordinates,
                setDropoffCoordinates,
                connectWallet,
                currentAccount,
                currentUser,
                selectedRide,
                setSelectedRide,
                price,
                setPrice,
                basePrice,
            }}
        >
            {children}
        </UberContext.Provider>
    )
}