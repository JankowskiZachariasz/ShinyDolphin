/**
 * This is a Next.js page.
 */
import { trpc } from '../utils/trpc';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function IndexPage() {
  // 💡 Tip: CMD+Click (or CTRL+Click) on `greeting` to go to the server definition
  const [xdText, setXdText] = useState('Nie było calla');
  const [sub, setSub] = useState(45.7);
  const result = trpc.greeting.hello.useQuery({name: 'Me'});
  const client = trpc.useContext().client;
  const { data: session } = useSession();
  const email = session?.user?.email;
  console.log(session?.user)
  //@ts-ignore

  async function fetchXd(){
    let txt = await client.greeting.objects.Account.query({name: 'Ihhhhaaaa'},{
      //@ts-ignore
      context:{token: session?.user?.token}});
    console.log(txt)
    
  }
  trpc.post.randomNumber.useSubscription(undefined,{
    onData(post) {
      setSub(post.randomNumber);
      console.log('post', post);
    },
    onError(err) {
      console.error('Subscription error:', err);
    },
  });

  return (
    <div>
      <button
          className="inline font-bold underline"
          onClick={() => signIn()}
        >
          sign in you {email}
        </button>

        <button
          className="inline font-bold underline"
          onClick={() => signOut()}
        >
          sign out you {email}
        </button>

       <button onClick={() => fetchXd()}>KLIKAJ MI TU</button>
      <h1>{result.data}</h1><br />
      <h1>{xdText}</h1><br />
      <h1>{sub}</h1><br />
      <h1>{
        //@ts-ignore
      session?.user?.token
      }</h1>
    </div>
  );
}

const styles = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
