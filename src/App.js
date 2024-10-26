import React from "react";
import Messages from "./Messages"; // Adjust the import path as necessary
import Chat from "./Chat";
function App() {
  return (
    <div>
      <h1>Real-Time Chat App</h1>
      <Messages />
      <Chat /> {/* Add your existing chat components here */}
      {/* Your existing components for sending messages, etc. */}
    </div>
  );
}

export default App;
