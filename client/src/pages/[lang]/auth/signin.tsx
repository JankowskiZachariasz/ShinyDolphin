import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { signIn, getCsrfToken, getProviders } from 'next-auth/react'
import { trpc } from '../../../utils/trpc';
import { TRPCClientError } from '@trpc/client';
import { useRef, useState } from 'react';
import { LogoBig } from '../../../components/Common/Logo'

export default function SignIn({ csrfToken, providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [mfaToken, setMfaToken] = useState('');

  const emailInput :React.RefObject<HTMLInputElement> = useRef(null);
  const passwordInput :React.RefObject<HTMLInputElement> = useRef(null);

  const credentialsForm :React.RefObject<HTMLFormElement> = useRef(null);
  const tokenHiddenInput :React.RefObject<HTMLInputElement>  = useRef(null);

  const client = trpc.useContext().client;

  const handleSubmitButton = async (event: any) => {
    switch(step){
      case 1:{
        try{
          const email = emailInput.current?.value;
          const password = passwordInput.current?.value;
          if(!email || ! password){
            throw new Error('Complete all fields.')
          }
          let loginResult = await client.authentication.login.mutate({email, password})
          if(loginResult.status === 'pending' && loginResult.mfaToken){
            setMfaToken(loginResult.mfaToken)
            setStep(2);
          }
          if(loginResult.status === 'success' && loginResult.token){
            await finishLoginFlow(loginResult.token);
          }
          setErrorMessage('');
        }
        catch(e : unknown){
          if(e instanceof Error ){
            setErrorMessage(e.message)
          }
        }
        break;
      }
      case 2:{
        break;
      }
    }
  }

  const finishLoginFlow = async (token : string) =>{
    if(!tokenHiddenInput.current || !credentialsForm.current){
      return;
    }
    tokenHiddenInput.current.value = token;
    credentialsForm.current.submit(); 
  }

  const onSubmitHandler = (event : any) => {

      //event.preventDefault()
  }

  return (
    <>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <span className="flex justify-center h-10 w-auto">
          <LogoBig href="/"></LogoBig>
        </span>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                ref={emailInput}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                ref={passwordInput}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              onClick={handleSubmitButton}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>

          <hr />
          {providers &&
            Object.values(providers).map(provider => (
              <div key={provider.name} style={{ marginBottom: 0 }}>
                <button onClick={() => signIn(provider.id, {callbackUrl: window.location.origin, })} >
                  Sign in with{' '} {provider.name}
                </button>
              </div>
            ))}

        </div>
      </div>
    </div>
     <div style={{display: 'none'}}>
        <form ref={credentialsForm} method="post" action="/api/auth/callback/credentials" onSubmit={onSubmitHandler}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <input ref = {tokenHiddenInput} name="token" type="hidden" />
        </form>
    </div>
  </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext ) {
  const providers = await getProviders()
  const csrfToken = await getCsrfToken(context)
  return {
    props: {
      providers,
      csrfToken
    },
  }
}