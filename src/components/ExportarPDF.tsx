import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ExportarPDF() {
  const [isExporting, setIsExporting] = useState(false);

  const exportarParaPDF = async () => {
    try {
      setIsExporting(true);
      const elemento = document.getElementById("painel-dashboard");
      if (!elemento) {
        throw new Error("Elemento do dashboard não encontrado");
      }

      const canvas = await html2canvas(elemento, {
        scale: 2, // Better quality
        useCORS: true, // Handle cross-origin images
        logging: false // Disable console logs
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
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Erro ao gerar o PDF. Por favor, tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={exportarParaPDF}
      disabled={isExporting}
      className={`
        px-4 py-2 rounded-lg font-medium
        ${isExporting 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-green-600 hover:bg-green-700'
        }
        text-white transition-colors duration-200
        flex items-center gap-2
      `}
    >
      📄 {isExporting ? 'Gerando PDF...' : 'Exportar PDF da Dashboard'}
    </button>
  );
}