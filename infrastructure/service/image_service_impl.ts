import {ImageService} from "../../domain/interfaces/image_service";

export class ImageServiceImpl implements ImageService{

    async isImageUrlValid(url: string): Promise<boolean> {
        try{
            let response = await fetch(url, {
                        method: 'HEAD',
                        signal: AbortSignal.timeout(5000),
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Node.js Fetch)'
                        }
            });

            if (!response.ok && (response.status === 405 || response.status === 403)) {
                response = await fetch(url, {
                    method: 'GET',
                    signal: AbortSignal.timeout(5000),
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Node.js Fetch)'
                    }
                });
            }

            const contentType = response.headers.get('content-type') || '';
            const isStatusOk = response.ok; 
            const isImage = contentType.startsWith('image/');
            
            return isStatusOk && isImage;
        }catch(err){
            return false;
        }
    }

}