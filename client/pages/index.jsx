import buildClient from "../api/build-client";

const LandingPage = ({currentUser}) => {
  return currentUser ? <h1>you aree logged in </h1> : <h1>you aree not logged in </h1>
}

LandingPage.getInitialProps = async (context) => {  
  try {
    const {data} = await buildClient(context).get('/api/users/currentuser')
    return data
  } catch(err) {
    console.log(err)
    return {}
  }
  
}

export default LandingPage;