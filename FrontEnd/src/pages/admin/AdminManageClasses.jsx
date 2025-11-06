import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "@/api/axiosConfig";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Trash2, User, Clock } from "lucide-react";

const AdminManageClasses = () => {
        const [classes, setClasses] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState(null);
        const fetchClasses = async () => {
                setIsLoading(true);
                try {
                        const response = await axios.get("/premium-classes");
                        setClasses(response.data || []);
                } catch (err) {
                        setError("Gagal mengambil data kelas.");
                        console.error(err);
                } finally {
                        setIsLoading(false);
                }
        };

        useEffect(() => {
                fetchClasses();
        }, []);

        const handleDelete = async (classId) => {
                toast.warning("Apakah Anda yakin ingin menghapus kelas ini?", {
                        action: {
                                label: "Hapus",
                                onClick: async () => {
                                        try {
                                                await axios.delete(`/premium-classes/${classId}`);
                                                toast.success("Kelas berhasil dihapus.");
                                                fetchClasses();
                                        } catch (err) {
                                                toast.error("Gagal menghapus kelas.", {
                                                        description: err.response?.data?.error,
                                                });
                                                console.error(err);
                                        }
                                },
                        },
                        cancel: {
                                label: "Batal",
                        },
                });
        };

        return (
            <div className="space-y-6">
                    <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold text-foreground">Manage Classes</h1>
                            <Button asChild>
                                    <Link to="/admin/classes/new">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Buat Kelas Baru
                                    </Link>
                            </Button>
                    </div>

                    {isLoading && <Loader2 className="h-8 w-8 animate-spin" />}
                    {error && <p className="text-destructive">{error}</p>}

                    {!isLoading && !error && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {classes.map((cls) => (
                                    <Card key={cls.id} className="flex flex-col justify-between">
                                            <CardHeader>
                                                    <CardTitle className="text-lg line-clamp-1">{cls.title}</CardTitle>
                                                    <Badge variant="outline">{cls.category}</Badge>
                                            </CardHeader>
                                            <CardContent>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                            {cls.description}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                                            <User className="h-4 w-4" />
                                                            <span>{cls.instructor}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                                            <Clock className="h-4 w-4" />
                                                            <span>{cls.duration || "N/A"}</span>
                                                    </div>
                                            </CardContent>
                                            <CardFooter className="flex gap-2">
                                                    <Button variant="outline" size="sm" className="flex-1" asChild>
                                                            <Link to={`/admin/classes/edit/${cls.id}`}>
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Edit
                                                            </Link>
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(cls.id)}
                                                    >
                                                            <Trash2 className="h-4 w-4" />
                                                    </Button>
                                            </CardFooter>
                                    </Card>
                                ))}
                        </div>
                    )}
            </div>
        );
};

export default AdminManageClasses;