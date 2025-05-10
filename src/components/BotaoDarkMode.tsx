"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function BotaoDarkMode() {
  const [temaEscuro, setTemaEscuro] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme === "dark" || (!savedTheme && prefersDark);
    
    setTemaEscuro(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme);
  }, []);

  const alternarTema = () => {
    const novoTema = !temaEscuro;
    setTemaEscuro(novoTema);
    document.documentElement.classList.toggle("dark", novoTema);
    localStorage.setItem("theme", novoTema ? "dark" : "light");

    toast({
      title: novoTema ? "Modo escuro ativado" : "Modo claro ativado",
      description: novoTema ? "O tema escuro foi aplicado" : "O tema claro foi aplicado",
      variant: "default",
    });
  };

  return (
    <Button 
      onClick={alternarTema} 
      className="fixed top-4 right-4 z-50 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 h-10 w-10 p-2"
    >
      {temaEscuro ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );
}