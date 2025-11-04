import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "@/api/axiosConfig";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronLeft, Save, Plus, X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const AdminQuestionForm = () => {
    const { testId, questionId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]); // Default 4 pilihan
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const [explanation, setExplanation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const isEditMode = Boolean(questionId);

    useEffect(() => {
        if (isEditMode) {
            setIsFetching(true);
            axios.get(`/questions/${questionId}`)
                .then(response => {
                    const q = response.data;
                    setQuestionText(q.question_text);
                    setOptions(JSON.parse(q.options || '["", ""]'));
                    setCorrectAnswer(q.correct_answer);
                    setExplanation(q.explanation || "");
                })
                .catch(err => {
                    console.error("Gagal fetch soal:", err);
                    toast({ title: "Error", description: "Gagal memuat data soal.", variant: "destructive" });
                })
                .finally(() => setIsFetching(false));
        }
    }, [questionId, isEditMode, toast]);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };
    const addOption = () => setOptions([...options, ""]);

    const removeOption = (index) => {
        if (options.length <= 2) {
            toast({ title: "Warning", description: "Minimal harus ada 2 pilihan jawaban.", variant: "destructive" });
            return;
        }
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            test_id: testId,
            question_text: questionText,
            options: JSON.stringify(options),
            correct_answer: parseInt(correctAnswer, 10),
            explanation: explanation,
        };

        try {
            if (isEditMode) {
                await axios.put(`/questions/${questionId}`, payload);
                toast({ title: "Sukses", description: "Soal berhasil diperbarui." });
            } else {
                await axios.post("/questions", payload);
                toast({ title: "Sukses", description: "Soal baru berhasil ditambahkan." });
            }
            navigate(`/admin/questions/${testId}`);
        } catch (error) {
            console.error("Gagal menyimpan soal:", error.response?.data);
            toast({
                title: "Gagal Menyimpan",
                description: error.response?.data?.details || "Cek kembali data Anda.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) return <Loader2 className="h-12 w-12 animate-spin" />;

    return (
        <div className="space-y-6">
            <Button variant="outline" size="sm" asChild>
                <Link to={`/admin/questions/${testId}`}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Kembali ke Daftar Soal
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>{isEditMode ? "Edit Soal" : "Tambah Soal Baru"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Teks Pertanyaan */}
                        <div className="space-y-2">
                            <Label htmlFor="question_text">Teks Pertanyaan</Label>
                            <Input
                                id="question_text"
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                                required
                            />
                        </div>

                        {/* Pilihan Jawaban */}
                        <div className="space-y-4">
                            <Label>Pilihan Jawaban</Label>
                            {options.map((option, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Label htmlFor={`option-${index}`} className="w-10">
                                        {String.fromCharCode(65 + index)}:
                                    </Label>
                                    <Input
                                        id={`option-${index}`}
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeOption(index)}
                                    >
                                        <X className="h-4 w-4" color="white"/>
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={addOption}>
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Pilihan
                            </Button>
                        </div>

                        {/* Kunci Jawaban */}
                        <div className="space-y-2">
                            <Label htmlFor="correct_answer">Kunci Jawaban</Label>
                            <Select
                                value={String(correctAnswer)}
                                onValueChange={(value) => setCorrectAnswer(Number(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kunci jawaban" />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.map((_, index) => (
                                        <SelectItem key={index} value={String(index)}>
                                            Pilihan {String.fromCharCode(65 + index)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Penjelasan */}
                        <div className="space-y-2">
                            <Label htmlFor="explanation">Penjelasan (Opsional)</Label>
                            <Input
                                id="explanation"
                                value={explanation}
                                onChange={(e) => setExplanation(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <Save className="h-4 w-4 mr-2" />
                                )}
                                Simpan Soal
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminQuestionForm;