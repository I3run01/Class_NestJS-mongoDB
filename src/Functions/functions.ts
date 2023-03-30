
import {fromByteArray} from 'base64-js'
import * as fs from 'fs';
import {get} from 'https';

export let  reqresUserRequest = async (id:string) => {  
    let response = await fetch(`https://reqres.in/api/users/${id}`)
    let json = await response.json()
  
    return json.data
}
  
export async function imageToBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const encodedImage = fromByteArray(bytes);
    return encodedImage;
}

export async function encodeImageToBase64(filePath: string): Promise<string> {
  try {
    // Read the file from the file system
    const data = await fs.promises.readFile(filePath);

    // Convert the file data to a base64 string
    const base64Data = fromByteArray(data);

    // Construct the data URL
    const mimeType = 'image/' + filePath.split('.').pop(); // Assumes the file extension determines the MIME type
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    // Return the base64 encoded string
    return dataUrl;
  } catch (error) {
    throw error;
  }
}



export async function saveImageFromUrl(url: string, filePath: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const fullURL = new URL(url)
            const localPath = fs.createWriteStream(filePath)

            const response = await new Promise<any>((resolve, reject) => {
                get(fullURL, resolve).on('error', reject)
            })

            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download image: HTTP status code ${response.statusCode}`))
                return
            }

            response.pipe(localPath)

            localPath.on('finish', () => {
                localPath.close(() => {
                    resolve()
                })
            })
        } catch (error) {
            reject(error)
        }
    })
}