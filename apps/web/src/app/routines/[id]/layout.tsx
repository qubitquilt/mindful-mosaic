import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default auth(async (user) => {
  if (!user) {
    redirect("/login")
  }
})
