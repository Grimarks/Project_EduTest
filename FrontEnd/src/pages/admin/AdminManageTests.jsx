import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "@/api/axiosConfig";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, FilePenLine } from "lucide-react";

const AdminManageTests = () => {
    const [tests, setTests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { toast } = useToast();

    const fetchTests = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/tests");
            setTests(response.data || []);
        } catch (err) {
            setError("Gagal mengambil data tes.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTests();
    }, []);

    const handleDelete = async (testId) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus tes ini?")) return;

        try {
            await axios.delete(`/tests/${testId}`); //
            toast({
                title: "Sukses",
                description: "Tes berhasil dihapus.",
            });
            fetchTests();
        } catch (err) {
            toast({
                title: "Error",
                description: "Gagal menghapus tes. (Cek console)",
                variant: "destructive",
            });
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">Manage Tests</h1>
                <Button asChild>
                    <Link to="/admin/tests/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Buat Tes Baru
                    </Link>
                </Button>
            </div>

            {isLoading && <Loader2 className="h-8 w-8 animate-spin" />}
            {error && <p className="text-destructive">{error}</p>}

            {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.map((test) => (
                        <Card key={test.id} className="flex flex-col justify-between">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg line-clamp-1">{test.title}</CardTitle>
                                    <Badge variant={test.is_premium ? "secondary" : "outline"}>
                                        {test.is_premium ? "Premium" : "Free"}
                                    </Badge>
                                </div>
                                <div className="flex gap-2 text-xs text-muted-foreground">
                                    <span>{test.category}</span>
                                    <span>•</span>
                                    <span>{test.difficulty}</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {test.description}
                                </p>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                {/* --- PERBAIKAN: Tombol Edit --- */}
                                <Button variant="outline" size="sm" className="flex-1" asChild>
                                    <Link to={`/admin/tests/edit/${test.id}`}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Link>
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1" asChild>
                                    <Link to={`/admin/questions/${test.id}`}>
                                        <FilePenLine className="h-4 w-4 mr-2" />
                                        Soal
                                    </Link>
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(test.id)}
                                >
                                    <Trash2 className="h-4 w-4" color="white" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminManageTests;