import { useState, useEffect } from "react";
import axios from "@/api/axiosConfig";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { toast } = useToast();

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/orders");
            setOrders(response.data || []);
        } catch (err) {
            setError("Gagal mengambil data pesanan.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleVerify = async (orderId) => {
        if (!window.confirm("Verifikasi pembayaran dan berikan akses premium?")) return;

        try {
            await axios.put(`/orders/${orderId}/verify`);
            toast({
                title: "Sukses",
                description: "Pesanan telah diverifikasi.",
            });
            fetchOrders();
        } catch (err) {
            toast({
                title: "Error",
                description: "Gagal memverifikasi pesanan.",
                variant: "destructive",
            });
            console.error(err);
        }
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("id-ID");
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Manage Orders</h1>

            {isLoading && <Loader2 className="h-8 w-8 animate-spin" />}
            {error && <p className="text-destructive">{error}</p>}

            {!isLoading && !error && (
                <Card>
                    <CardHeader>
                        <CardTitle>All Orders ({orders.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <Card key={order.id} className="p-4">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
                                            <p className="text-lg font-semibold">{order.item_type === 'class' ? "Premium Class" : "Premium Test"}</p>
                                            <p>User: <span className="font-medium">{order.User?.name || "N/A"}</span> ({order.User?.email || "N/A"})</p>
                                            <p>Amount: <span className="font-bold">{formatPrice(order.amount)}</span></p>
                                            <p className="text-xs text-muted-foreground">
                                                Tanggal: {formatDate(order.created_at)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-start md:items-end gap-2 mt-4 md:mt-0">
                                            <Badge variant={order.status === 'completed' ? "secondary" : "destructive"}>
                                                {order.status}
                                            </Badge>

                                            {order.payment_proof_url && (
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={`http://localhost:3000${order.payment_proof_url}`} target="_blank" rel="noopener noreferrer">
                                                        Lihat Bukti Bayar
                                                    </a>
                                                </Button>
                                            )}

                                            {order.status === 'pending' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleVerify(order.id)}
                                                    disabled={!order.payment_proof_url}
                                                >
                                                    <CheckCheck className="h-4 w-4 mr-2" />
                                                    Verifikasi
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AdminManageOrders;