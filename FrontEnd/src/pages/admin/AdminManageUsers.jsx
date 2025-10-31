import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
const AdminManageUsers = () => (
    <Card><CardHeader><CardTitle>Manage Users</CardTitle></CardHeader>
        <CardContent><p>Halaman untuk melihat daftar pengguna dan mengubah role mereka akan muncul di sini.</p>
            <p className="text-sm text-accent mt-2"><b>Catatan:</b> Ini membutuhkan endpoint <b>GET /api/users</b> di Backend.</p></CardContent></Card>
);
export default AdminManageUsers;