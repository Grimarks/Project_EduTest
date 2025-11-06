import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "@/api/axiosConfig";
import { useAuth } from "@/context/UseAuth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, ArrowLeft, CreditCard, ShoppingBag, Star, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import {Badge} from "@/components/ui/badge.jsx"
import { cn } from "@/lib/utils";

const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);

const premiumPlans = [
    {
        id: "monthly",
        title: "Langganan Bulanan",
        description: "Akses premium penuh selama 30 hari.",
        price: 249000,
        discount: null,
        itemId: "premium_monthly",
    },
    {
        id: "yearly",
        title: "Langganan Tahunan",
        description: "Akses premium penuh selama 365 hari.",
        price: 2490000,
        discount: "Hemat 15%!",
        itemId: "premium_yearly",
    },
];

const VIRTUAL_PREMIUM_PRODUCT = {
    id: "membership",
    title: "EduTest+ Premium Membership",
    description: "Akses penuh ke semua Tes Premium dan Kelas Premium di platform.",
    instructor: "EduTest+ Team",
};

const OrderPage = () => {
    const { itemType, itemId } = useParams();
    const navigate = useNavigate();
    const { user, isLoggedIn, isLoading: isAuthLoading } = useAuth();
    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(premiumPlans[0]);

    useEffect(() => {
        if (!isLoggedIn && !isAuthLoading) {
            toast.error("Silakan Login", {
                description: "Anda harus login untuk melakukan pemesanan.",
            });
            navigate("/login");
            return;
        }

        if (isLoggedIn && itemType === 'premium' && itemId === 'membership') {
            setItem(VIRTUAL_PREMIUM_PRODUCT);
            setIsLoading(false);
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
                await axios.get(url);
                setItem(VIRTUAL_PREMIUM_PRODUCT);

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
    }, [itemType, itemId, isLoggedIn, isAuthLoading, navigate]);

    const handleCreateOrder = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                item_type: selectedPlan.itemId,
                item_id: '00000000-0000-0000-0000-000000000000',
                amount: selectedPlan.price,
            };

            await axios.post("/orders", payload);
            toast.success("Order Dibuat!", {
                description: "Silakan lanjutkan ke pembayaran.",
            });

            navigate("/my-orders");

        } catch (err) {
            toast.error("Gagal Membuat Order", {
                description: err.response?.data?.error || "Terjadi kesalahan.",
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
    if (user?.is_premium) {
        return (
            <div className="p-8 text-center space-y-4">
                <h1 className="text-2xl font-bold">Anda Sudah Premium</h1>
                <p className="text-muted-foreground">Anda sudah memiliki akses ke semua konten premium.</p>
                <Button asChild>
                    <Link to="/dashboard">Kembali ke Dashboard</Link>
                </Button>
            </div>
        );
    }

    const backLink = itemType === 'class'
        ? "/premium"
        : itemType === 'test'
            ? "/tests"
            : "/";

    return (
        <div className="min-h-screen bg-gradient-page py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <Button variant="outline" size="sm" asChild className="mb-4">
                    <Link to={backLink}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali
                    </Link>
                </Button>

                <Card className="shadow-card">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <ShoppingBag className="h-6 w-6" />
                            Upgrade ke Premium
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="border rounded-lg p-4 bg-muted/50">
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>

                        <Card>
                            <CardContent className="p-4 space-y-2">
                                <h4 className="font-semibold">Keuntungan Premium:</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Star className="h-4 w-4 text-accent flex-shrink-0" />
                                    <span>Akses penuh ke semua <strong>Tes Premium</strong></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Star className="h-4 w-4 text-accent flex-shrink-0" />
                                    <span>Akses penuh ke semua <strong>Kelas Premium</strong></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Star className="h-4 w-4 text-accent flex-shrink-0" />
                                    <span>Analisis Performa Mendalam</span>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            <h4 className="font-semibold">Pilih Paket Langganan:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {premiumPlans.map((plan) => (
                                    <Button
                                        key={plan.id}
                                        variant="outline"
                                        className={cn(
                                            "h-auto p-4 flex flex-col items-start text-left relative",
                                            selectedPlan.id === plan.id && "border-primary ring-2 ring-primary"
                                        )}
                                        onClick={() => setSelectedPlan(plan)}
                                    >
                                        {selectedPlan.id === plan.id && (
                                            <CheckCircle className="h-5 w-5 text-primary absolute top-2 right-2" />
                                        )}
                                        <span className="font-bold text-lg">{plan.title}</span>
                                        <span className="text-xl font-bold text-primary my-1">{formatPrice(plan.price)}</span>
                                        <span className="text-sm text-muted-foreground">{plan.description}</span>
                                        {plan.discount && (
                                            <Badge variant="destructive" className="mt-2">{plan.discount}</Badge>
                                        )}
                                    </Button>
                                ))}
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
                                <span className="text-primary">{formatPrice(selectedPlan.price)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {itemType === 'premium'
                                    ? "Dengan mengklik \"Konfirmasi & Bayar\", Anda menyetujui bahwa pembelian ini akan memberikan Anda akses Premium ke seluruh platform."
                                    : "Dengan mengklik \"Konfirmasi & Bayar\", Anda akan diarahkan untuk membayar item ini."}
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