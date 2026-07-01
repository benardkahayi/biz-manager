import { auth } from "@/auth"
import LandingHero from "@/components/LandingHero"

export default async function Home() {
  const session = await auth()
  return <LandingHero userName={session?.user?.name || session?.user?.email} />
}
