import { getUsers, createStaffUser } from "@/services/users"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function UsersPage() {
  const session = await auth()

  // Only admins may see this page
  if (session?.user?.role !== "admin") {
    redirect("/dashboard")
  }

  const users = await getUsers()

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Users</h1>
      <p className="text-sm text-gray-500 mb-6">Manage who can access the system</p>

      <form action={createStaffUser} className="mb-8 flex flex-wrap gap-3 items-end bg-white p-5 rounded-xl border shadow-sm">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Name</label>
          <input name="name" required className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Email</label>
          <input name="email" type="email" required className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Password</label>
          <input name="password" type="password" required className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Role</label>
          <select name="role" className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors">
          Add User
        </button>
      </form>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500 uppercase text-xs tracking-wide">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{u.name || "—"}</td>
                <td className="p-4 text-gray-600">{u.email}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${u.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}