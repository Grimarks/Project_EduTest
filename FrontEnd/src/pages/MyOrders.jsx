import { useState, useEffect, useRef } from "react";
import axios from "@/api/axiosConfig";
import { useAuth } from "@/context/UseAuth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Receipt, Upload, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID");
}

const getOrderItemName = (itemType) => {
    switch (itemType) {
        case "premium_monthly":
            return "Langganan Premium (1 Bulan)";
        case "premium_yearly":
            return "Langganan Premium (1 Tahun)";
        case "class":
            return "Premium Class";
        case "test":
            return "Premium Test";
        default:
            return "Aktivasi Akun Premium";
    }
};
const OrderItem = ({ order, fetchOrders }) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const uploadRes = await axios.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const fileURL = uploadRes.data.url;

            await axios.put(`/orders/${order.id}/payment-proof`, {
                url: fileURL,
            });

            toast.success("Upload Sukses", {
                description: "Bukti pembayaran berhasil diunggah. Mohon tunggu verifikasi admin."
            });
            fetchOrders();

        } catch (err) {
            console.error("Gagal upload:", err);
            toast.error("Upload Gagal", {
                description: err.response?.data?.error || "Terjadi kesalahan.",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const isSubscription = order.item_type.startsWith('premium_');

    return (
        <Card className="p-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
                    <p className="text-lg font-semibold capitalize">
                        {getOrderItemName(order.item_type)}
                    </p>
                    {!isSubscription && (
                        <p className="text-sm">Item: {order.item_type} (ID: {order.item_id})</p>
                    )}
                    <p>Jumlah: <span className="font-bold text-primary">{formatPrice(order.amount)}</span></p>
                    <p className="text-xs text-muted-foreground">
                        Tanggal: {formatDate(order.created_at)}
                    </p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2 mt-4 md:mt-0">
                    <Badge variant={order.status === 'completed' ? "secondary" : (order.status === 'pending' ? 'destructive' : 'outline')}>
                        {order.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1"/>}
                        {order.status === 'pending' && <Clock className="h-3 w-3 mr-1"/>}
                        {order.status}
                    </Badge>

                    {order.status === 'pending' && !order.payment_proof_url && (
                        <div className="p-3 bg-muted rounded-lg text-sm space-y-2 text-left md:text-right">
                            <p className="font-semibold">Silakan Transfer ke:</p>
                            <p>BNI: 1907200505 (a.n. EduTest+)</p>
                            <p>GOPAY: 081271148877 (a.n. EduTest+)</p>
                            <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                                {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                                Upload Bukti Bayar
                            </Button>
                            <Input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/png, image/jpeg, image/jpg"
                            />
                        </div>
                    )}

                    {order.status === 'pending' && order.payment_proof_url && (
                        <div className="p-3 bg-muted rounded-lg text-sm text-left md:text-right">
                            <p className="font-semibold text-primary">Bukti terkirim. Menunggu verifikasi admin.</p>
                            <Button variant="outline" size="sm" asChild className="mt-2">
                                <a href={`http://localhost:3000${order.payment_proof_url}`} target="_blank" rel="noopener noreferrer">
                                    Lihat Bukti
                                </a>
                            </Button>
                        </div>
                    )}

                    {order.status === 'completed' && (
                        <p className="p-3 bg-secondary/20 text-secondary-foreground rounded-lg text-sm">
                            Pembayaran sukses. Akun Anda sudah premium.
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
};
const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, isLoading: isAuthLoading } = useAuth();

    const fetchOrders = async () => {
        if (!user?.id) return;
        setIsLoading(true);
        try {
            const response = await axios.get(`/orders/user/${user.id}`);
            setOrders(response.data || []);
        } catch (err) {
            setError("Gagal mengambil data pesanan.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthLoading && user?.id) {
            fetchOrders();
        }
    }, [user, isAuthLoading]);

    if (isLoading || isAuthLoading) {
        return <div className="p-8 text-center"><Loader2 className="h-12 w-12 animate-spin mx-auto" /></div>;
    }

    if (error) {
        return <div className="p-8 text-center text-destructive">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-2">
                    <Receipt className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
                </div>

                {orders.length === 0 ? (
                    <Card className="p-8 text-center">
                        <p className="text-muted-foreground">Anda belum memiliki riwayat pesanan.</p>
                        <Button asChild className="mt-4">
                            <Link to="/premium">Lihat Kelas Premium</Link>
                        </Button>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <OrderItem key={order.id} order={order} fetchOrders={fetchOrders} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;