import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "@/api/axiosConfig";
import { useAuth } from "@/context/UseAuth";
import { Loader2, Lock, ArrowLeft, User, Clock, PlayCircle, Mic, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const PremiumClassDetail = () => {
    const { classId } = useParams();
    const { user, isLoggedIn, isLoading: isAuthLoading } = useAuth();
    const navigate = useNavigate();
    const [cls, setCls] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthLoading && !isLoggedIn) {
            toast.error("Silakan Login", { description: "Anda harus login untuk melihat kelas." });
            navigate("/login");
            return;
        }

        if (isLoggedIn) {
            const fetchClass = async () => {
                setIsLoading(true);
                try {
                    const res = await axios.get(`/premium-classes/${classId}`);
                    setCls(res.data);
                } catch (err) {
                    console.error("Gagal fetch kelas:", err);
                    toast.error("Gagal memuat kelas", { description: "Kelas tidak ditemukan." });
                    navigate("/premium");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchClass();
        }
    }, [classId, isLoggedIn, isAuthLoading, navigate]);

    if (isLoading || isAuthLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!user.is_premium) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
                <Lock className="h-16 w-16 text-destructive mb-4" />
                <h1 className="text-3xl font-bold text-foreground">Konten Terkunci</h1>
                <p className="text-lg text-muted-foreground mt-2">
                    Ini adalah konten khusus untuk anggota premium.
                </p>
                {cls && <p className="text-lg mt-1">Anda mencoba mengakses: <strong>{cls.title}</strong></p>}
                <Button asChild className="mt-6" variant="hero">
                    <Link to="/order/premium/membership">Upgrade ke Premium</Link>
                </Button>
                <Button asChild className="mt-2" variant="outline">
                    <Link to="/premium">Kembali ke Daftar Kelas</Link>
                </Button>
            </div>
        );
    }

    if (user.is_premium && cls) {
        return (
            <div className="min-h-screen bg-gradient-page py-12 px-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    <Button variant="outline" size="sm" asChild>
                        <Link to="/premium">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke Daftar Kelas
                        </Link>
                    </Button>

                    <Card className="shadow-card">
                        <CardHeader>
                            <Badge variant="secondary" className="w-fit mb-2">Premium Content</Badge>
                            <CardTitle className="text-3xl font-bold">{cls.title}</CardTitle>
                            <p className="text-muted-foreground pt-2">{cls.description}</p>
                            <div className="flex flex-wrap gap-4 pt-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>Instruktur: <strong>{cls.instructor}</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>Durasi: <strong>{cls.duration}</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">{cls.category}</Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="border-t pt-6">
                                <h3 className="text-2xl font-semibold mb-4">Materi Kelas</h3>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <PlayCircle className="h-6 w-6 text-primary" />
                                            <span className="font-medium">Video Pembelajaran HD</span>
                                        </div>
                                        <Button size="sm">Tonton</Button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <Mic className="h-6 w-6 text-primary" />
                                            <span className="font-medium">Live Q&A Mingguan</span>
                                        </div>
                                        <Button size="sm">Gabung</Button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-6 w-6 text-primary" />
                                            <span className="font-medium">Studi Kasus</span>
                                        </div>
                                        <Button size="sm">Lihat</Button>
                                    </div>
                                </div>

                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Fallback jika terjadi sesuatu
    return null;
};

export default PremiumClassDetail;