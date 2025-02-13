import { useState } from "react";
import "./App.css";

function App() {
  const [socket, setSocket] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [responses, setResponses] = useState([]);

  const connectAndSendMessage = () => {
    console.log("Connecting WebSocket...");

    const newSocket = new WebSocket("ws://localhost:8080");

    newSocket.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(newSocket);
    };

    newSocket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log("Message from server:", data);

      if (data.type === "welcome") {
        // Save the clientId and then send the message
        setClientId(data.clientId);
        console.log(`Assigned clientId: ${data.clientId}`);

        // Send message now that we have clientId
        await sendMessage(newSocket, data.clientId);
      } else if (data.type === "response") {
        setResponses((prev) => [...prev, data.message]);
      } else if (data.type === "error") {
        console.error(`Error from server: ${data.message}`);
      } else if (data.type === "question") {
        console.log({ success: true, data: JSON.parse(data.message) });
      }
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed");
      setSocket(null);
      setClientId(null);
    };
  };

  const sendMessage = async (ws, clientId) => {
    try {
      const payload = JSON.stringify({
        clientId,
        content: "Test message from client",
      });

      ws.send(payload);
      console.log("Message sent via WebSocket");

      // Make a POST request
      const response = await fetch("http://localhost:5000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: `${clientId}`,
          code: `import java.util.Scanner;

public class AddTwoNumbers {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int num1 = scanner.nextInt();

        int num2 = scanner.nextInt(); 

        int sum = num1 + num2;
        System.out.println(sum);

        scanner.close();
    }
}
`,
          language: "java",
          problemId: "1",
          testcases:[{
            input:"3 4",
            output:"7"
          }]
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the message");
      }

      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <h1>WebSocket Client</h1>
      {clientId ? <p>Your Client ID: {clientId}</p> : <p>Click "Connect & Send" to start</p>}
      <div>
        <button onClick={connectAndSendMessage}>
          Connect & Send
        </button>
      </div>
      <div>
        <h2>Server Responses</h2>
        {responses.map((response, index) => (
          <p key={index}>{response}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
