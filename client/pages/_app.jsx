import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({Component, pageProps, currentUser}) => {
  return <div className="">
      <Header currentUser={currentUser} />
      <Component {...pageProps}/>
    </div>
}

AppComponent.getInitialProps = async appContext => {
  try {
    const {data} = await buildClient(appContext.ctx).get('/api/users/currentuser')
    let pageProps = {}
    if(appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx)
    }
    return {
      pageProps,
      ...data //currentUser
    }
  }catch(err) {
    console.log(err)
    return {}
  }
}

export default AppComponent;