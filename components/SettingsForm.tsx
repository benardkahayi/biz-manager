"use client"

import { useActionState } from "react"
import { updateBusinessProfile } from "@/services/settings"
import { CheckCircle2 } from "lucide-react"

type Profile = {
  storeName: string
  address: string
  phone: string
  currency: string
}

export default function SettingsForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState(updateBusinessProfile, null)

  return (
    <form action={action} className="flex flex-col gap-4">
      {state?.success && (
        <p className="flex items-center gap-2 text-sm text-green-700 font-medium bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <CheckCircle2 size={16} />
          Settings saved successfully.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Store Name</label>
          <input
            name="storeName"
            defaultValue={profile.storeName}
            placeholder="e.g. My Shop"
            className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <input
            name="phone"
            defaultValue={profile.phone}
            placeholder="e.g. +255 712 000 000"
            className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Address</label>
        <input
          name="address"
          defaultValue={profile.address}
          placeholder="e.g. Dar es Salaam, Tanzania"
          className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1 sm:max-w-xs">
        <label className="text-sm font-medium text-gray-700">Currency</label>
        <input
          name="currency"
          defaultValue={profile.currency}
          placeholder="e.g. TZS"
          className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={pending}
          className="w-full sm:w-auto rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  )
}
