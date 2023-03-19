import { useEffect } from "react";
import "../../style.scss"

export default function App() {
  useEffect(() => {
    console.log("content view loaded");
  }, []);

  return <div className="content-view">nonso view</div>;
}
