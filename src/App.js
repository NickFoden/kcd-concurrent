import React from "react";

const TRANSITION_CONFIG = {
  timeoutMs: 3000 // 🐨 Play with this number a bit...
};
function SuspenseDemo() {
  const [greetingResource, setGreetingResource] = React.useState(null);
  const [startTransition, isPending] = React.useTransition(TRANSITION_CONFIG);

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.nameInput.value;
    startTransition(() => {
      setGreetingResource(createGreetingResource(name));
    });
  }

  return (
    <div>
      <strong>Suspense Demo</strong>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nameInput">Name</label>
        <input id="nameInput" />
        <button type="submit">Submit</button>
      </form>
      <ErrorBoundary>
        <React.Suspense fallback={<p>loading greeting</p>}>
          <Greeting greetingResource={greetingResource} isPending={isPending} />
        </React.Suspense>
      </ErrorBoundary>
    </div>
  );
}

function Greeting({ greetingResource, isPending }) {
  return (
    <p style={{ opacity: isPending ? 0.4 : 1 }}>
      {greetingResource ? greetingResource.read() : "Please submit a name"}
    </p>
  );
}

// 🐨 make this function do something else. Like an HTTP request or something
function getGreeting(name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Hello ${name}!`);
      // 🐨 try rejecting instead... (make sure to comment out the resolve call)
      // reject(new Error(`Oh no. Could not load greeting for ${name}`))
    }, 1500); // 🐨 play with this number a bit
  });
}

// 🚨 This should NOT be copy/pasted for production code and is only here
// for experimentation purposes. The API for suspense (currently throwing a
// promise) is likely to change before suspense is officially released.
function createGreetingResource(name) {
  let status = "pending";
  let result;
  let suspender = getGreeting(name).then(
    greeting => {
      status = "success";
      result = greeting;
    },
    error => {
      status = "error";
      result = error;
    }
  );
  return {
    read() {
      if (status === "pending") throw suspender;
      if (status === "error") throw result;
      if (status === "success") return result;
    }
  };
}

class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch() {
    // log the error to the server
  }
  tryAgain = () => this.setState({ error: null });
  render() {
    return this.state.error ? (
      <div>
        There was an error. <button onClick={this.tryAgain}>try again</button>
        <pre style={{ whiteSpace: "normal" }}>{this.state.error.message}</pre>
      </div>
    ) : (
      this.props.children
    );
  }
}

function App() {
  return <SuspenseDemo />;
}

export default App;
