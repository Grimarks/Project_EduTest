import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "@/api/axiosConfig";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminManageQuestions = () => {
        const { testId } = useParams();
        const { toast } = useToast();
        const [questions, setQuestions] = useState([]);
        const [testTitle, setTestTitle] = useState("");
        const [isLoading, setIsLoading] = useState(true);

        const fetchQuestions = async () => {
                setIsLoading(true);
                try {
                        const testRes = await axios.get(`/tests/${testId}`);
                        setTestTitle(testRes.data.title || "Tes");

                        const questionsRes = await axios.get(`/questions/test/${testId}`);
                        setQuestions(questionsRes.data || []);
                } catch (err) {
                        console.error("Gagal mengambil data soal:", err);
                        toast({
                                title: "Error",
                                description: "Gagal mengambil data soal.",
                                variant: "destructive",
                        });
                } finally {
                        setIsLoading(false);
                }
        };

        useEffect(() => {
                if (testId) {
                        fetchQuestions();
                }
        }, [testId]);

        const handleDelete = async (questionId) => {
                if (!window.confirm("Yakin ingin menghapus soal ini?")) return;
                try {
                        await axios.delete(`/questions/${questionId}`);
                        toast({ title: "Sukses", description: "Soal berhasil dihapus." });
                        fetchQuestions();
                } catch (err) {
                        console.error(err);
                        toast({ title: "Error", description: "Gagal menghapus soal.", variant: "destructive" });
                }
        };

        const getCorrectOptionText = (optionsJson, correctIndex) => {
                try {
                        const options = JSON.parse(optionsJson);
                        return options[correctIndex] || "Indeks tidak valid";
                        // eslint-disable-next-line no-unused-vars
                } catch (e) {
                        return "Format JSON salah";
                }
        };

        return (
            <div className="space-y-6">
                    <Button variant="outline" size="sm" asChild>
                            <Link to="/admin/tests">
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    Kembali ke Daftar Tes
                            </Link>
                    </Button>

                    <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold text-foreground">
                                    Manage Questions
                                    <span className="text-xl text-muted-foreground ml-2">({testTitle})</span>
                            </h1>
                            <Button asChild>
                                    <Link to={`/admin/questions/${testId}/new`}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Tambah Soal Baru
                                    </Link>
                            </Button>
                    </div>

                    {isLoading && <Loader2 className="h-8 w-8 animate-spin" />}

                    {!isLoading && (
                        <Card>
                                <CardHeader>
                                        <CardTitle>Daftar Soal ({questions.length})</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                        {questions.length === 0 ? (
                                            <p className="text-muted-foreground">Belum ada soal untuk tes ini.</p>
                                        ) : (
                                            questions.map((q, index) => (
                                                <Card key={q.id} className="p-4">
                                                        <div className="flex justify-between items-start">
                                                                <div>
                                                                        <p className="font-semibold">{index + 1}. {q.question_text}</p>
                                                                        <Badge variant="secondary" className="mt-2">
                                                                                Jawaban: {getCorrectOptionText(q.options, q.correct_answer)}
                                                                        </Badge>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                        <Button variant="outline" size="icon" asChild>
                                                                                <Link to={`/admin/questions/${testId}/edit/${q.id}`}>
                                                                                        <Edit className="h-4 w-4" />
                                                                                </Link>
                                                                        </Button>
                                                                        <Button variant="destructive" size="icon" onClick={() => handleDelete(q.id)}>
                                                                                <Trash2 className="h-4 w-4" color="white" />
                                                                        </Button>
                                                                </div>
                                                        </div>
                                                </Card>
                                            ))
                                        )}
                                </CardContent>
                        </Card>
                    )}
            </div>
        );
};

export default AdminManageQuestions;
