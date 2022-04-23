import { client } from "../../../lib/sanity"

const query = `
*[_type=="rides"]{
  "service": title,
  "iconUrl": icon.asset->url, 
  priceMultiplier, 
  orderById
}|order(orderById asc)
` 

const getRideTypes = async (req, res) => {
    try { 
        const sanityResponse = await client.fetch(query)

        res.status(200).send({
            message: "Success", 
            data: sanityResponse
        })
    }
    catch (err) {
        res.status(500).send({
            message: "error",
            data: err.message
        })
    }
}
export default getRideTypes