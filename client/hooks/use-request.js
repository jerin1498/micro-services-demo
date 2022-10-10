import axios from 'axios';
import { useState } from 'react';

// custom hooks to send axios requests

const useRequest = ({url, method, body, onSuccess}) => {
  const [errors, setErrors] = useState(null)
  const doRequest = async () => {
    try{
      setErrors(null)
      const response = await axios[method](url, body)
      if(onSuccess) onSuccess(response.body)
      return response.body
    } catch(err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>ooppss</h4>
          <ul className="my-0">
            { err.response.data.errors.map(err => <li key={err.message}>{err.message}</li>)}
          </ul>
        </div> 
      )
    }
  }
  return {errors, doRequest}
}


export default useRequest;