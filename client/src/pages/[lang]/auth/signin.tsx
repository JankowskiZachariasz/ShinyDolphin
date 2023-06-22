import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getCsrfToken } from "next-auth/react"
import { trpc } from '../../../utils/trpc';
import { TRPCClientError } from '@trpc/client';
import { useRef, useState } from 'react';

export default function SignIn({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [mfaToken, setMfaToken] = useState('');
    const credentialsForm = useRef(null);
    const emailInput = useRef(null);
    const tokenInput = useRef(null);
    const passwordInput = useRef(null);
    const totpInput = useRef(null);
    const emailHiddenInput = useRef(null);
    //@ts-ignore
    const client = trpc.useContext().client;
    const handleSubmitButton = async (event: any) => {
      switch(step){
        case 1:{
          try{
            //@ts-ignore
            let loginResult = await client.greeting.objects.login.login.query({email: emailInput.current?.value, password: passwordInput.current?.value});
            // if(loginResult.status === 'pending' && loginResult.mfaToken){
            //   setMfaToken(loginResult.mfaToken)
            //   setStep(2);
            // }
            // if(loginResult.status === 'success' && loginResult.token){
            //   await finishLoginFlow(loginResult.token, loginResult.email);
            // }
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

    const finishLoginFlow = async (token : string, email : string) =>{
      //@ts-ignore
      tokenInput.current.value = token;
      //@ts-ignore
      emailHiddenInput.current.value = email;
      //@ts-ignore
      await credentialsForm.current.submit(); 
    }

    const onSubmitHandler = (event : any) => {
        console.log(event.message);
        //event.preventDefault()
    }

  return (
    <div>
      {step === 1?(
        <form>
          <label>Email<input ref={emailInput} name="email" type="text" /></label>
          <label>Password<input ref={passwordInput} name="password" type="password" /></label>
        </form>
      ):(    
        <form>
          <label>TOTP<input ref={totpInput} name="totp" type="text" /></label>
      </form>
    )}
    <div style={{color: 'red'}}>{errorMessage}</div>
    <button onClick={handleSubmitButton}>Submit</button>

    <div style={{display: 'none'}}>
        <form ref={credentialsForm} method="post" action="/api/auth/callback/credentials" onSubmit={onSubmitHandler}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <input ref = {tokenInput} name="token" type="hidden" />
          <input ref = {emailHiddenInput} name="email" type="hidden" />
        </form>
    </div>

    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}