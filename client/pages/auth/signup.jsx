import { useState } from "react";
import Router from 'next/router'
import useRequest from '../../hooks/use-request';

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // const [errors, setErrors] = useState([])
  const {doRequest, errors} = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email, password
    },
    onSuccess: () => Router.push('/')
  })

  const onSubmit = async event => {
    event.preventDefault()
    doRequest()
  }

  return (
    <form onSubmit={onSubmit}>
      <h1 >Signup</h1>
      <div className="form-group">
        <label htmlFor="">Email address</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="text" className="form-control" />
      </div>
      <div className="form-group">
        <label htmlFor="">Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" />
      </div>
      {errors}
      <button className="btn btn-primary">Sign up</button>
    </form>
  )
}

export default Signup