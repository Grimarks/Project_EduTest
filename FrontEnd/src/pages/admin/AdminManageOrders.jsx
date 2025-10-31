import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
const AdminManageOrders = () => (
    <Card><CardHeader><CardTitle>Manage Orders</CardTitle></CardHeader>
        <CardContent><p>Halaman untuk melihat pesanan yang masuk dan melakukan verifikasi pembayaran akan muncul di sini.</p>
            <p className="text-sm text-accent mt-2"><b>Catatan:</b> Ini membutuhkan endpoint <b>GET /api/orders</b> di Backend.</p></CardContent></Card>
);
export default AdminManageOrders;