import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, UsersIcon } from "lucide-react"
import type { Profile } from "@/lib/types"

interface UserListProps {
  users: Profile[]
}

export function UserList({ users }: UserListProps) {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user.id} className="border-2">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user.full_name}</h3>
                    {user.is_admin && <Badge variant="default">Admin</Badge>}
                  </div>
                  <div className="mt-2 space-y-1 text-base text-gray-600 dark:text-gray-400">
                    {user.gender && (
                      <p>
                        Jenis Kelamin:{" "}
                        {user.gender === "male" ? "Laki-laki" : user.gender === "female" ? "Perempuan" : "Lainnya"}
                      </p>
                    )}
                    {user.date_of_birth && (
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Tanggal Lahir:{" "}
                        {new Date(user.date_of_birth).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                    {user.height_cm && user.weight_kg && (
                      <p>
                        Tinggi: {user.height_cm} cm • Berat: {user.weight_kg} kg
                      </p>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                    Bergabung:{" "}
                    {new Date(user.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {users.length === 0 && (
        <Card className="border-2">
          <CardContent className="py-16 text-center">
            <UsersIcon className="mx-auto h-16 w-16 text-gray-400" />
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Belum ada pengguna</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
