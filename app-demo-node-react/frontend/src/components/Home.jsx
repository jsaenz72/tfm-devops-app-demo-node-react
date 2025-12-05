import React from "react";
import { Link } from "react-router-dom";
import {
  FilePlus,
  Boxes,
  Building,
  ArrowRight,
  Settings,
  HelpCircle,
  FileText,
  Package,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-14 shadow-2xl mb-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
            Bienvenido al Sistema de Facturación
          </h1>
          <p className="text-lg text-blue-100 mb-10 max-w-xl leading-relaxed">
            Administra facturación, inventarios y tu empresa desde una interfaz moderna y optimizada.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/factura" className="btn-primary">
              <FilePlus size={20} /> Crear Factura
            </Link>
            <Link to="/productos" className="btn-secondary">
              <Boxes size={20} /> Ver Productos
            </Link>
          </div>
        </div>
      </section>

      {/* ACCIONES PRINCIPALES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-14">
        <Link to="/factura" className="card hover:border-blue-300">
          <div className="card-icon bg-blue-100 group-hover:bg-blue-600">
            <FilePlus className="text-blue-600 group-hover:text-white" size={28} />
          </div>
          <h3 className="card-title group-hover:text-blue-600">Nueva Factura</h3>
          <p className="card-desc">Genera facturas en minutos.</p>
          <span className="cta-link">Comenzar <ArrowRight size={18} /></span>
        </Link>

        <Link to="/productos" className="card hover:border-green-300">
          <div className="card-icon bg-green-100 group-hover:bg-green-600">
            <Package className="text-green-600 group-hover:text-white" size={28} />
          </div>
          <h3 className="card-title group-hover:text-green-600">Productos</h3>
          <p className="card-desc">Controla tu catálogo e inventario.</p>
          <span className="cta-link text-green-600">Ver catálogo <ArrowRight size={18} /></span>
        </Link>

        <Link to="/empresa" className="card hover:border-purple-300">
          <div className="card-icon bg-purple-100 group-hover:bg-purple-600">
            <Building className="text-purple-600 group-hover:text-white" size={28} />
          </div>
          <h3 className="card-title group-hover:text-purple-600">Empresa</h3>
          <p className="card-desc">Configura tus datos fiscales.</p>
          <span className="cta-link text-purple-600">Configurar <ArrowRight size={18} /></span>
        </Link>
      </section>

      {/* MÉTRICAS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        <div className="metric-card border-blue-200 bg-blue-50">
          <TrendingUp size={28} className="text-blue-700" />
          <h4 className="metric-title text-blue-900">Facturación</h4>
          <p className="metric-value text-blue-900">+120</p>
          <p className="metric-sub text-blue-700">Facturas este mes</p>
        </div>

        <div className="metric-card border-green-200 bg-green-50">
          <FileText size={28} className="text-green-700" />
          <h4 className="metric-title text-green-900">Gestión</h4>
          <p className="metric-value text-green-900">Completa</p>
          <p className="metric-sub text-green-700">Todo lo que necesitas</p>
        </div>

        <div className="metric-card border-purple-200 bg-purple-50">
          <Settings size={28} className="text-purple-700" />
          <h4 className="metric-title text-purple-900">Profesional</h4>
          <p className="metric-value text-purple-900">Elegante</p>
          <p className="metric-sub text-purple-700">Interfaz moderna y clara</p>
        </div>
      </section>

      {/* ACCESO RÁPIDO */}
      <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Acceso Rápido</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <Link to="/factura" className="quick-btn" aria-label="Nueva Factura">
            <FilePlus size={26} />
            <span>Nueva Factura</span>
          </Link>
          <Link to="/productos" className="quick-btn" aria-label="Productos">
            <Boxes size={26} />
            <span>Productos</span>
          </Link>
          <Link to="/empresa" className="quick-btn" aria-label="Empresa">
            <Building size={26} />
            <span>Empresa</span>
          </Link>
          <button className="quick-btn" aria-label="Ayuda">
            <HelpCircle size={26} />
            <span>Ayuda</span>
          </button>
        </div>
      </section>
    </div>
  );
}
