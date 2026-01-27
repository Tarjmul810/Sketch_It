import Image, { type ImageProps } from "next/image";
import { Landing } from "./pages/Landing";
import { Signin } from "./pages/Signin";
import { Button } from "../components/Button";
// import { Button } from "@repo/ui/button";

export default function Home() {
  return (
    <div className="p-10">

     <Button children="Hello"/>

     <Landing />
    </div>
  )
}
