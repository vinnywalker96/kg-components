import { useToast as useToastUI } from "@/components/ui/use-toast"

export function useToast() {
  const { toast } = useToastUI()
  
  return {
    success: (message: string) => {
      toast({
        title: "Success",
        description: message,
        variant: "default",
      })
    },
    error: (message: string) => {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    },
    info: (message: string) => {
      toast({
        title: "Info",
        description: message,
      })
    },
    warning: (message: string) => {
      toast({
        title: "Warning",
        description: message,
        variant: "destructive",
      })
    },
    custom: (options: any) => {
      toast(options)
    }
  }
}

