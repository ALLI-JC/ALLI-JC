// App.tsx - Version simplifiée
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import DevisSimulator from './components/DevisSimulator'
import ZoneIntervention from './components/ZoneIntervention'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ProtectedRoute from './components/admin/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './components/admin/Dashboard'
import DevisPage from './components/admin/DevisPage'
import Users from './components/admin/Users'
import Bookings from './components/admin/Bookings'
import Gallery from './components/galleri'
import Login from './Pages/Login'
import GalleryManagement from './components/admin/Gallery'

import Messages from './components/admin/Bookings'
import FloatingLogo from './components/FloatingLogo'

function PublicSite() {
  const scrollToDevis = () => {
    document.getElementById('sec-devis')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div id="top" className="brand-page font-sans min-h-screen text-[#0e2b38]">
      <Navbar onDevisClick={scrollToDevis} />
      <Hero onDevisClick={scrollToDevis} />
      
      <Services />
      <DevisSimulator />
      <Gallery />
      <ZoneIntervention />
      <Testimonials />
      <Contact />
      <Footer />
   
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={
        <>
          <PublicSite />
            <FloatingLogo 
              src="/shamois.png" 
           
            />
        </>
      } />
      
      <Route path="/login" element={<Login />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="devis" element={<DevisPage />} />
          <Route path="users" element={<Users />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="gallery" element={<GalleryManagement />} />
        </Route>
      </Route>
      
      <Route path="*" element={
        <>
          <PublicSite />
          <FloatingLogo 
            src="/alliéjc-logo-3.png" 
            size={70} 
            offset={120}
          />
        </>
      } />
    </Routes>
  )
}
