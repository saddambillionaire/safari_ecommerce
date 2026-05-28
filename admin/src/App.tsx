import {
  UserButton,
  SignInButton,
  SignedOut,
  SignedIn,
} from "@clerk/clerk-react";

function App() {
  return (
    <div>
      <h1>My App</h1>
      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}

export default App;
