import axios from "axios";

export class PostService {
    // create get post method with json plachollder api pf posts with axios
    // get posts method
    getPosts() {
        try {
            const response = axios.get('https://jsonplaceholder.typicode.com/posts');
            console.log("response: ",  response);
            return response;
        } catch (error) {
            console.log("error: ", error);
        }
    }
   
}