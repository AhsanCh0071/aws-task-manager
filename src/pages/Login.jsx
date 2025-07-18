import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

function Login() {
  return (
    <>
        <div className='flex justify-center items-center min-h-screen'>
            <Authenticator/>
        </div>
    </>
  )
}

export default Login