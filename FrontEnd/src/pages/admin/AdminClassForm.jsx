import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "@/api/axiosConfig";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronLeft, Save } from "lucide-react";

// Kategori bisa dibuat dinamis, tapi untuk saat ini statis
const categories = ["Mathematics", "English", "Science", "General", "Business"];

const AdminClassForm = () => {
    const { classId } = useParams(); // Ambil classId dari URL
    const navigate = useNavigate();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        instructor: "",
        price: 0,
        image_url: "",
        category: "General",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const isEditMode = Boolean(classId);

    useEffect(() => {
        if (isEditMode) {
            setIsFetching(true);
            axios.get(`/premium-classes/${classId}`)
                .then(response => {
                    const cls = response.data;
                    setFormData({
                        title: cls.title || "",
                        description: cls.description || "",
                        instructor: cls.instructor || "",
                        price: cls.price || 0,
                        image_url: cls.image_url || "",
                        category: cls.category || "General",
                    });
                })
                .catch(err => {
                    console.error("Gagal fetch data kelas:", err);
                    toast({
                        title: "Error",
                        description: "Gagal mengambil data kelas.",
                        variant: "destructive",
                    });
                })
                .finally(() => setIsFetching(false));
        }
    }, [classId, isEditMode, toast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            ...formData,
            price: parseFloat(formData.price) || 0,
        };

        try {
            if (isEditMode) {
                await axios.put(`/premium-classes/${classId}`, payload);
                toast({
                    title: "Sukses!",
                    description: "Kelas berhasil diperbarui.",
                });
            } else {
                await axios.post("/premium-classes", payload);
                toast({
                    title: "Sukses!",
                    description: "Kelas baru berhasil dibuat.",
                });
            }
            navigate("/admin/classes");
        } catch (error) {
            console.error("Gagal menyimpan kelas:", error.response?.data);
            toast({
                title: "Gagal Menyimpan",
                description: error.response?.data?.error || error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <Loader2 className="h-12 w-12 animate-spin text-primary" />;
    }

    return (
        <div className="space-y-6">
            <Button variant="outline" size="sm" asChild>
                <Link to="/admin/classes">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Kembali ke Daftar Kelas
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">
                        {isEditMode ? "Edit Kelas Premium" : "Buat Kelas Baru"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Judul */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Judul Kelas</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Contoh: Mastery UTBK 2025"
                                required
                            />
                        </div>

                        {/* Instruktur */}
                        <div className="space-y-2">
                            <Label htmlFor="instructor">Instruktur</Label>
                            <Input
                                id="instructor"
                                name="instructor"
                                value={formData.instructor}
                                onChange={handleChange}
                                placeholder="Contoh: John Doe"
                                required
                            />
                        </div>

                        {/* Deskripsi */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Input
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Deskripsi singkat mengenai kelas ini"
                            />
                        </div>

                        {/* Kategori */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Kategori</Label>
                            <Select
                                name="category"
                                value={formData.category}
                                onValueChange={(value) => handleSelectChange("category", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Harga */}
                        <div className="space-y-2">
                            <Label htmlFor="price">Harga (IDR)</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Contoh: 150000"
                                required
                            />
                        </div>

                        {/* URL Gambar (Opsional) */}
                        <div className="space-y-2">
                            <Label htmlFor="image_url">URL Gambar (Opsional)</Label>
                            <Input
                                id="image_url"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                                placeholder="https://example.com/gambar.png"
                            />
                        </div>

                        {/* Tombol Submit */}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4 mr-2" />
                                )}
                                {isEditMode ? "Simpan Perubahan" : "Simpan Kelas"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminClassForm;