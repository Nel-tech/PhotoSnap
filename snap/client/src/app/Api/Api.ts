
import axios from 'axios';
import cookie from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

   export const toggleBookmark = async (id: string) => {
        try {

            const token = cookie.get("token")
            if (!token) throw new Error('No token found');

            const res = await axios.post(`${API_URL}api/v1/stories/book-mark/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return res.data.data
        } catch (error) {
            return error
        }
    }

export const LikeStoryAPI = async (id: string) => {
try {
  const token = cookie.get('token');
  if (!token) throw new Error('No token found');
  
  const res = await axios.post(
    `${API_URL}api/v1/stories/like-Story/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  
  return res.data.data;
  
} catch (error) {
   return error
}

};


export const viewStoryAPI = async(id:string)=> {
try {
  const token = cookie.get('token')
  if(!token) throw new Error('no token found');
  
  const res = await axios.post( `${API_URL}api/v1/stories/story-views/${id}`,
  {},
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  )
  return res.data.data;
  
} catch (error) {
  return error
}

}

export const getStoryStatus = async(id:string) => {

  try {
    const token = cookie.get('token')
     if(!token) throw new Error('no token found');
 
     const res = await axios.get( `${API_URL}api/v1/stories/get-story-status/${id}`,
     {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     }
 )
   return res.data.data;
    
  } catch (error) {
    return error
  }
}

export const getBookmarkedbyStatus = async(id:string) => {
try {
  const token = cookie.get('token')
   if(!token) throw new Error('no token found');
  
   const res = await axios.get( `${API_URL}api/v1/stories/bookmarked-status/${id}`,
   {
     headers: {
       Authorization: `Bearer ${token}`,
     },
   }
  )
  return res.data.data;
  
} catch (error) {
  return error
}


}