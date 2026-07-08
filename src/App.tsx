// App.tsx - Version avec Outlet (plus propre)
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TrustBar from './components/TrustBar'
import ServicesMarquee from './components/ServicesMarquee'
import Services from './components/Services'
import DevisSimulator from './components/DevisSimulator'
import ZoneIntervention from './components/ZoneIntervention'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ProtectedRoute from './components/admin/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './components/admin/Dashboard'
import Users from './components/admin/Users'
import Bookings from './components/admin/Bookings'
import Gallery from './components/galleri'
import Login from './Pages/Login'
import GalleryManagement from './components/admin/Gallery'
import Chat from './components/Chat'
import Messages from './components/admin/Bookings'


function PublicSite() {
  const scrollToDevis = () => {
    document.getElementById('sec-devis')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToContact = () => {
    document.getElementById('sec-contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="font-sans bg-white text-gray-900">
      <Navbar onDevisClick={scrollToDevis} />
      <Hero onDevisClick={scrollToDevis} />
      <ServicesMarquee />
      <TrustBar />
      <Services />
      <DevisSimulator onConfirm={scrollToContact} />
      <Gallery />
      <ZoneIntervention />
      <Testimonials />
      <Contact />
      <Footer />
      <Chat />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Route publique */}
      <Route path="/" element={<PublicSite />} />
      
      {/* Page de login */}
      <Route path="/login" element={<Login />} />
      
      {/* Routes admin protégées - Structure avec Outlet */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="gallery" element={<GalleryManagement />} />
        </Route>
      </Route>
      
      {/* Redirection 404 */}
      <Route path="*" element={<PublicSite />} />
    </Routes>
  )
}