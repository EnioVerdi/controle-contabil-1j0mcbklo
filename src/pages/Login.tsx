import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import logoVerdi from '@/assets/image-c1f91.png'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [email, setEmail] = useState('eniol.verdi@gmail.com')
  const [password, setPassword] = useState('securepassword123')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      toast({ title: 'Erro ao fazer login', description: error.message, variant: 'destructive' })
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="flex flex-col items-center mb-8">
          <img src={logoVerdi} alt="Verdi Oelke" className="h-20 w-auto object-contain mb-4" />
          <p className="text-slate-500 text-sm text-center">Gerenciamento Contábil Inteligente</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 mt-8">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          <p>Credenciais de teste:</p>
          <p className="font-medium text-slate-700 mt-1">
            eniol.verdi@gmail.com / securepassword123
          </p>
        </div>
      </div>
    </div>
  )
}
