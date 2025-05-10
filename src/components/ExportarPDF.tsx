import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function ExportarPDF() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportarParaPDF = async () => {
    try {
      setIsExporting(true);
      const elemento = document.getElementById("painel-dashboard");
      if (!elemento) {
        throw new Error("Elemento do dashboard não encontrado");
      }

      toast({
        title: "Iniciando exportação",
        description: "Gerando PDF do dashboard...",
      });

      const canvas = await html2canvas(elemento, {
        scale: 2, // Better quality
        useCORS: true, // Handle cross-origin images
        logging: false, // Disable console logs
        backgroundColor: "#ffffff", // Ensure white background
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const larguraPagina = pdf.internal.pageSize.getWidth();
      const alturaPagina = pdf.internal.pageSize.getHeight();
      const proporcao = larguraPagina / canvas.width;
      const alturaImagem = canvas.height * proporcao;

      // If image height exceeds page height, adjust scale
      const escala = alturaImagem > alturaPagina ? alturaPagina / alturaImagem : 1;
      const alturaFinal = alturaImagem * escala;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        larguraPagina,
        alturaFinal,
        undefined,
        "FAST"
      );

      pdf.save("relatorio_dashboard.pdf");
      
      toast({
        title: "PDF gerado com sucesso!",
        description: "O download do seu relatório começará em instantes.",
        variant: "success",
      });
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao gerar o relatório. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={exportarParaPDF}
      disabled={isExporting}
      variant="default"
      className="bg-green-600 hover:bg-green-700"
    >
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Gerando PDF...
        </>
      ) : (
        <>
          📄 Exportar PDF da Dashboard
        </>
      )}
    </Button>
  );
}