import { useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex justify-center items-center space-x-4 mb-6">
        <a
          href="https://vitejs.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={viteLogo}
            className="logo h-16"
            alt="Vite logo"
          />
        </a>
        <a
          href="https://react.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={reactLogo}
            className="logo h-16"
            alt="React logo"
          />
        </a>
      </div>
      <h1 className="text-4xl font-bold text-center mb-4">Vite + React</h1>
      <div className="card p-6 border rounded-lg shadow-lg text-center">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          count is {count}
        </button>
        <p className="mt-4">
          Edit{" "}
          <code className="font-mono bg-gray-200 p-1 rounded">src/App.tsx</code>{" "}
          and save to test HMR
        </p>
      </div>
      <p className="read-the-docs text-center mt-6 text-gray-600">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
