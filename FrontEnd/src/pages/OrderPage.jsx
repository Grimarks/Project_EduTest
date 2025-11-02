import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "@/api/axiosConfig";
import { useAuth } from "@/context/UseAuth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, ArrowLeft, CreditCard, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {Badge} from "@/components/ui/badge.jsx"

// Fungsi format harga
const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);

const OrderPage = () => {
    const { itemType, itemId } = useParams();
    const navigate = useNavigate();
    const { user, isLoggedIn, isLoading: isAuthLoading } = useAuth();
    const { toast } = useToast();

    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isLoggedIn && !isAuthLoading) {
            toast({
                title: "Silakan Login",
                description: "Anda harus login untuk melakukan pemesanan.",
                variant: "destructive",
            });
            navigate("/login");
            return;
        }

        const fetchItem = async () => {
            setIsLoading(true);
            setError(null);
            let url = "";
            if (itemType === 'class') {
                url = `/premium-classes/${itemId}`;
            } else if (itemType === 'test') {
                url = `/tests/${itemId}`;
            } else {
                setError("Tipe item tidak valid.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(url);
                setItem(response.data);
            } catch (err) {
                setError("Gagal memuat detail item.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoggedIn) {
            fetchItem();
        }
    }, [itemType, itemId, isLoggedIn, isAuthLoading, navigate, toast]);

    const handleCreateOrder = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                item_type: itemType,
                item_id: itemId,
                amount: item.price || item.amount, // 'price' dari kelas/tes
            };

            const response = await axios.post("/orders", payload);

            toast({
                title: "Order Dibuat!",
                description: "Silakan lanjutkan ke pembayaran.",
            });

            // Redirect ke halaman "My Orders" untuk upload bukti
            navigate("/my-orders");

        } catch (err) {
            toast({
                title: "Gagal Membuat Order",
                description: err.response?.data?.error || "Terjadi kesalahan.",
                variant: "destructive",
            });
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || isAuthLoading) {
        return <div className="p-8 text-center"><Loader2 className="h-12 w-12 animate-spin mx-auto" /></div>;
    }

    if (error) {
        return <div className="p-8 text-center text-destructive">{error}</div>;
    }

    if (!item) {
        return <div className="p-8 text-center">Item tidak ditemukan.</div>;
    }

    // Cek jika user sudah premium
    if (user?.is_premium) {
        return (
            <div className="p-8 text-center space-y-4">
                <h1 className="text-2xl font-bold">Anda Sudah Premium</h1>
                <p className="text-muted-foreground">Anda sudah memiliki akses ke semua konten premium.</p>
                <Button asChild>
                    <Link to={itemType === 'class' ? "/premium" : "/tests"}>Kembali</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-page py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <Button variant="outline" size="sm" asChild className="mb-4">
                    <Link to={itemType === 'class' ? "/premium" : "/tests"}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali
                    </Link>
                </Button>

                <Card className="shadow-card">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <ShoppingBag className="h-6 w-6" />
                            Konfirmasi Pesanan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="border rounded-lg p-4 bg-muted/50">
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <div className="border-t my-2" />
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Tipe Item:</span>
                                <Badge variant="outline">{itemType}</Badge>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-muted-foreground">Instruktur:</span>
                                <span>{item.instructor || "-"}</span>
                            </div>
                        </div>

                        <Card>
                            <CardContent className="p-4">
                                <h4 className="font-semibold mb-2">Instruksi Pembayaran</h4>
                                <p className="text-sm text-muted-foreground">
                                    Setelah mengkonfirmasi, Anda akan diarahkan ke halaman "My Orders" untuk melihat instruksi pembayaran (Transfer Bank) dan mengunggah bukti bayar.
                                </p>
                            </CardContent>
                        </Card>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-lg font-medium">
                                <span>Total Pembayaran:</span>
                                <span className="text-primary">{formatPrice(item.price)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Dengan mengklik "Konfirmasi & Bayar", Anda menyetujui bahwa pembelian ini akan memberikan Anda akses Premium ke seluruh platform.
                            </p>
                        </div>

                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleCreateOrder}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <CreditCard className="h-4 w-4 mr-2" />
                            )}
                            Konfirmasi & Lanjutkan Pembayaran
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default OrderPage;