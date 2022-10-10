import axios from 'axios';

const buildClient = ({req}) => {
  if(typeof window === 'undefined') {
    //this call is from server
    // if the request is from server should provide nginx service domane name 
    // http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    })
  }else {
    //this call is from browser
    // if the request is from browser just pass the relative path
    return axios.create({
      baseURL: '/',
    })
  }
}


export default buildClient;