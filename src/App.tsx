import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DemonstrateLatticeMethod from "./components/DemonstrateLatticeMethod";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter
        basename={
          import.meta.env.DEV ? "/" : "/lattice-multiplication-teacher/"
        }
      >
        <Routes>
          <Route path="/" element={<DemonstrateLatticeMethod />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
