import axios from 'axios'

export async function sendToApi(array, ID_TOKEN) {
    const postUrl = `${process.env.REACT_APP_API_GATEWAY_BASE_URL}/upload_blog`
    await axios.post(postUrl, JSON.stringify(array), { headers: {"Authorization": ID_TOKEN, "Content-Type": "application/json"}})
}

export async function getPaginatedBlogs(cursor=undefined, limit=20) {
    let getUrl = `${process.env.REACT_APP_API_GATEWAY_BASE_URL}/get_blogs?limit=${limit}`
    if (cursor !== undefined) {
        getUrl += getUrl + `&cursor=${cursor}`
    }
    return await axios.get(getUrl)
}