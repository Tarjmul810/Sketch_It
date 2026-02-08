import Image, { type ImageProps } from "next/image";
import LandingPage from "./pages/Landing";
import SignInPage from "./pages/Signin";
import SignUpPage from "./pages/Signup";
// import { Button } from "@repo/ui/button";

export default function Home() {
  return (
    <div>

      <LandingPage />
      {/* <SignInPage />/ */}
      {/* <SignUpPage /> */}
    </div>
  )
}
