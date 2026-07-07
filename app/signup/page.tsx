import { redirect } from "next/navigation"

export default function SignupPage() {
  // Public signup disabled — accounts are created by an admin in the Users area.
  redirect("/login")
}