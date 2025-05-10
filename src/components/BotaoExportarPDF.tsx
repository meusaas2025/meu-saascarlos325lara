import html2pdf from "html2pdf.js"
import { Button } from "./ui/button"
import { Download } from "lucide-react"
import { useToast } from "./ui/use-toast"

export default function BotaoExportarPDF() {
  const { toast } = useToast()
  const exportarPDF = async () => {
    const area = document.getElementById("painel-dashboard")
    if (!area) {
      toast({
        title: "Erro ao exportar",
        description: "Área do dashboard não encontrada",
        variant: "destructive"
      })
      return
    }

    const opt = {
      margin: 0.5,
      filename: "dashboard.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff'
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    }

    try {
      toast({
        title: "Gerando PDF",
        description: "Aguarde enquanto preparamos seu relatório..."
      })

      const html2pdfInstance = html2pdf.default()
      await html2pdfInstance.set(opt).from(area).save()

      toast({
        title: "PDF gerado com sucesso!",
        description: "O download começará automaticamente",
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao gerar o relatório",
        variant: "destructive"
      })
    }
  }

  return (
    <Button 
      onClick={exportarPDF} 
      className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-800"
    >
      <Download className="mr-2 h-4 w-4" /> Exportar PDF
    </Button>
  )
}