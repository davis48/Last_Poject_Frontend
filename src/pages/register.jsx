import { useState } from 'react';
import accountImg from '../assets/images/Account.png'
import RegisterForm from '../components/registerForm'
import Footer from '../components/Footer'

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col justify-center items-center text-center">
              <img src={accountImg} alt="Logo" width="100" height="100" className="align-text-top" />
              <h4  className=" mt-1 pb-1 text-xl font-semibold {connectionError ? 'mb-4': 'mb-12'} ">
                Creation de compte
              </h4>
            </div>
            <RegisterForm />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Register