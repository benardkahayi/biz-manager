import { getBusinessProfile } from "@/services/settings"
import SettingsForm from "@/components/SettingsForm"
import { Settings } from "lucide-react"

export default async function SettingsPage() {
  const profile = await getBusinessProfile()

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:px-0">
      <div className="flex items-center gap-3 mb-6 animate-fade-up">
        <span className="bg-blue-100 text-blue-600 rounded-lg p-2.5">
          <Settings size={20} />
        </span>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">Manage your business profile</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-4 sm:p-6 animate-fade-up animation-delay-100">
        <SettingsForm profile={profile} />
      </div>
    </div>
  )
}
