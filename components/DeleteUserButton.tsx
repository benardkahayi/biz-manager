"use client"

import { deleteUser } from "@/services/users"
import { useTransition } from "react"

export function DeleteUserButton({ userId, userName }: { userId: string; userName: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete ${userName || "this user"}? This cannot be undone.`
    )
    if (!confirmed) return

    startTransition(async () => {
      try {
        await deleteUser(userId)
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to delete user")
      }
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  )
}