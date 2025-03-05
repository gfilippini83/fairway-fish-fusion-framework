import axios from 'axios'

export async function sendToApi(array) {
    const postUrl = "holder"
    await axios.post(postUrl, JSON.stringify(array))
}