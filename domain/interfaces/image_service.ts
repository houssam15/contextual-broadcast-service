
export abstract class  ImageService {
     abstract isImageUrlValid(url: string): Promise<boolean>;
}

