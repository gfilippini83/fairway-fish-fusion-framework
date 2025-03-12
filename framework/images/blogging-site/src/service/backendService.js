import axios from 'axios'

export async function sendToApi(array, ID_TOKEN) {
    const postUrl = `${process.env.REACT_APP_API_GATEWAY_BASE_URL}/upload_blog`
    console.log(array)
    await axios.post(postUrl, JSON.stringify(array), { headers: {"Authorization": ID_TOKEN, "Content-Type": "application/json"}})
}