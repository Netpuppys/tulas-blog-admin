import { Toaster } from "sonner";
import Routes from "./routes/Routes";

function App() {
  return (
    <div>
      <Routes />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
