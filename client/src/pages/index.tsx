/**
 * This is a Next.js page.
 */
import { trpc } from '../utils/trpc';
import { useState } from 'react';

export default function IndexPage() {
  // 💡 Tip: CMD+Click (or CTRL+Click) on `greeting` to go to the server definition
  const [xdText, setXdText] = useState('Nie było calla');
  const [sub, setSub] = useState(45.7);
  const result = trpc.greeting.hello.useQuery({name: 'Me'});
  const client = trpc.useContext().client;
  async function fetchXd(){
    let txt = await client.greeting.objects.Account.query({name: 'Ihhhhaaaa'});
    setXdText(txt);
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

  if (!result.data) {
    return (
      <div style={styles}>
        <h1>Loading...</h1>
      </div>
    );
  }
  return (
    <div>
      {/**
       * The type is defined and can be autocompleted
       * 💡 Tip: Hover over `data` to see the result type
       * 💡 Tip: CMD+Click (or CTRL+Click) on `text` to go to the server definition
       * 💡 Tip: Secondary click on `text` and "Rename Symbol" to rename it both on the client & server
       */}
       <button onClick={() => fetchXd()}>KLIKAJ MI TU</button>
      <h1>{result.data}</h1><br />
      <h1>{xdText}</h1><br />
      <h1>{sub}</h1><br />
      {/* <h1>{subscription}</h1> */}
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
