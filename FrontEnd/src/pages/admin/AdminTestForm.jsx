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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronLeft, Save } from "lucide-react";

const categories = ["Mathematics", "English", "Science", "General"];
const difficulties = ["Easy", "Medium", "Hard"];

const AdminTestForm = () => {
    const { testId } = useParams(); // Akan undefined jika ini halaman 'new'
    const navigate = useNavigate();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "General",
        difficulty: "Medium",
        duration: 60,
        is_premium: false,
        image_url: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const isEditMode = Boolean(testId);

    useEffect(() => {
        if (isEditMode) {
            setIsFetching(true);
            axios.get(`/tests/${testId}`)
                .then(response => {
                    const test = response.data;
                    setFormData({
                        title: test.title || "",
                        description: test.description || "",
                        category: test.category || "General",
                        difficulty: test.difficulty || "Medium",
                        duration: test.duration || 60,
                        is_premium: test.isPremium || false,
                        image_url: test.image_url || "",
                    });
                })
                .catch(err => {
                    console.error("Gagal fetch data tes:", err);
                    toast({
                        title: "Error",
                        description: "Gagal mengambil data tes.",
                        variant: "destructive",
                    });
                })
                .finally(() => setIsFetching(false));
        }
    }, [testId, isEditMode, toast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (checked) => {
        setFormData(prev => ({ ...prev, is_premium: checked }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            ...formData,
            duration: parseInt(formData.duration, 10) || 0,
        };

        try {
            if (isEditMode) {
                await axios.put(`/tests/${testId}`, payload);
                toast({
                    title: "Sukses!",
                    description: "Tes berhasil diperbarui.",
                });
            } else {
                await axios.post("/tests", payload);
                toast({
                    title: "Sukses!",
                    description: "Tes baru berhasil dibuat.",
                });
            }
            navigate("/admin/tests");
        } catch (error) {
            console.error("Gagal menyimpan tes:", error.response?.data);
            toast({
                title: "Gagal Menyimpan",
                description: error.response?.data?.details || error.message,
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
                <Link to="/admin/tests">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Kembali ke Daftar Tes
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">
                        {isEditMode ? "Edit Tes" : "Buat Tes Baru"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Judul */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Judul Tes</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Contoh: Try Out UTBK 2025 - Matematika"
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
                                placeholder="Deskripsi singkat mengenai tes ini"
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

                        {/* Kesulitan */}
                        <div className="space-y-2">
                            <Label htmlFor="difficulty">Kesulitan</Label>
                            <Select
                                name="difficulty"
                                value={formData.difficulty}
                                onValueChange={(value) => handleSelectChange("difficulty", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kesulitan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {difficulties.map(diff => (
                                        <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Durasi */}
                        <div className="space-y-2">
                            <Label htmlFor="duration">Durasi (dalam Menit)</Label>
                            <Input
                                id="duration"
                                name="duration"
                                type="number"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="Contoh: 90"
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

                        {/* Checkbox Premium */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_premium"
                                checked={formData.is_premium}
                                onCheckedChange={handleCheckboxChange}
                            />
                            <Label htmlFor="is_premium">Ini adalah tes premium (berbayar)</Label>
                        </div>

                        {/* Tombol Submit */}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4 mr-2" />
                                )}
                                {isEditMode ? "Simpan Perubahan" : "Simpan Tes"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminTestForm;