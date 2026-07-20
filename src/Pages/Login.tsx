  // pages/admin/Login.tsx
  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { Mail, Lock, LogIn, AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';
  import { supabase } from '../lib/supabaseClient';


  export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        console.log('Connexion réussie:', data.user?.email);
        navigate('/admin');
        
      } catch (err: any) {
        console.error('Erreur login:', err);
        setError(err.message || 'Email ou mot de passe incorrect');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 relative overflow-hidden">
        {/* Décorations de fond */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#237395]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#237395]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#237395]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-md w-full mx-4 z-10">
          {/* Carte principale */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            
            {/* En-tête avec logo */}
            <div className="bg-gradient-to-r from-[#237395] to-[#237395] px-8 py-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10"></div>
              <div className="relative">
                {/* Logo */}
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden transform transition-transform hover:scale-105">
                    <img 
                      src="/1.jpeg" 
                      alt="Logo L'Allié JC" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent) {
                          parent.innerHTML = '<span class="text-[#237395] font-bold text-3xl">JC</span>';
                        }
                      }}
                    />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-white">L'Allié JC</h1>
                <p className="text-white/80 text-sm mt-1">Espace administration</p>
                <div className="flex justify-center mt-3">
              
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div className="px-8 py-8">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Connexion</h2>
                <p className="text-sm text-gray-500 mt-1">Connectez-vous à votre espace d'administration</p>
              </div>

              <form className="space-y-5" onSubmit={handleLogin}>
                {/* Message d'erreur */}
                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-4 animate-shake">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Erreur de connexion</h3>
                        <div className="mt-1 text-sm text-red-700">{error}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Champ Email */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#237395] transition-colors" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#237395] focus:ring-2 focus:ring-[#237395]/20 transition-all duration-200"
                      placeholder="admin@exemple.com"
                    />
                  </div>
                </div>

                {/* Champ Mot de passe */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#237395] transition-colors" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#237395] focus:ring-2 focus:ring-[#237395]/20 transition-all duration-200"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Options supplémentaires */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#237395] focus:ring-[#237395]" />
                    <span className="text-sm text-gray-600">Se souvenir de moi</span>
                  </label>
              
                </div>

                {/* Bouton de connexion */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[#237395] to-[#237395] hover:from-[#237395] hover:to-[#237395] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#237395] transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Connexion en cours...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5" />
                      <span>Se connecter</span>
                    </>
                  )}
                </button>

                {/* Séparateur */}
            

            
              </form>
            </div>
          </div>

          {/* Badge de sécurité */}
        
        </div>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.3s ease-in-out;
          }
        `}</style>
      </div>
    );
  }
