import { Toaster } from "sonner";
import Routes from "./routes/Routes";

function App() {
  return (
    <div className="max-w-[1440px] mx-auto">
      <Routes />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
