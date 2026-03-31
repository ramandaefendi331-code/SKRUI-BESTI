/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  History, 
  FileText, 
  Database, 
  Download, 
  ChevronRight, 
  Menu, 
  X,
  Info,
  MapPin,
  Activity,
  ShieldCheck,
  Settings,
  Save,
  MessageCircle
} from 'lucide-react';

// --- Utils ---

const getDirectImageUrl = (url: string) => {
  if (!url) return url;
  
  // Google Drive Link Conversion
  // Handles:
  // - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // - https://drive.google.com/open?id=FILE_ID
  // - https://drive.google.com/uc?id=FILE_ID
  const driveRegex = /(?:https?:\/\/)?(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)|lh3\.googleusercontent\.com\/d\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  
  return url;
};

// --- Components ---

const Navbar = ({ isEditMode, setIsEditMode, content, navLinks }: any) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src={getDirectImageUrl(content.hero.logoUrl)} 
            alt="Logo Lampung" 
            className="h-14 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
          <span className={`font-display text-xl font-bold tracking-tight ${isScrolled ? 'text-emerald-900' : 'text-white'}`}>
            SKRUI BESTI
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              target={link.isExternal ? "_blank" : undefined}
              rel={link.isExternal ? "noopener noreferrer" : undefined}
              className={`text-sm font-medium transition-colors hover:text-emerald-500 flex items-center gap-1.5 ${isScrolled ? 'text-stone-600' : 'text-white/90'}`}
            >
              {link.isExternal && <link.icon size={14} className="text-emerald-500" />}
              {link.name}
            </a>
          ))}
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border ${
              isEditMode 
                ? 'bg-amber-500 border-amber-600 text-white shadow-lg shadow-amber-100' 
                : isScrolled ? 'bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
          >
            {isEditMode ? <><Save size={16} /> Mode View</> : <><Settings size={16} /> Mode Edit</>}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
                  </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-t border-stone-100 shadow-xl p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  target={link.isExternal ? "_blank" : undefined}
                  rel={link.isExternal ? "noopener noreferrer" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-stone-600 font-medium py-2"
                >
                  <link.icon size={18} className="text-emerald-600" />
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const EditableText = ({ value, onChange, isEditing, className = "", type = "text", label = "" }: any) => {
  if (!isEditing) {
    if (type === "textarea") {
      return <p className={className}>{value}</p>;
    }
    return <span className={className}>{value}</span>;
  }

  return (
    <div className="w-full group/edit relative inline-block">
      {label && <span className="absolute -top-5 left-0 text-[10px] font-bold text-amber-600 uppercase tracking-widest opacity-0 group-hover/edit:opacity-100 transition-opacity whitespace-nowrap z-10">{label}</span>}
      {type === "textarea" ? (
        <textarea 
          className={`w-full p-3 bg-amber-50 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-stone-800 ${className}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
        />
      ) : (
        <input 
          type="text"
          className={`w-full p-2 bg-amber-50 border-2 border-amber-200 rounded-lg focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-stone-800 ${className}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
};

const Section = ({ id, title, subtitle, children, className = "", isEditing, onTitleChange, onSubtitleChange }: any) => (
  <section id={id} className={`py-24 px-6 ${className}`}>
    <div className="max-w-5xl mx-auto">
      <div className="mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-emerald-600 font-semibold tracking-widest text-xs uppercase mb-2"
        >
          <EditableText isEditing={isEditing} value={subtitle} onChange={onSubtitleChange} label="Subtitle" />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-display font-bold text-emerald-950"
        >
          <EditableText isEditing={isEditing} value={title} onChange={onTitleChange} label="Judul Seksi" />
        </motion.div>
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: 60 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="h-1 bg-emerald-500 mt-6 rounded-full"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  </section>
);

const StatCard = ({ label, value, icon: Icon, description, isEditing, onLabelChange, onValueChange, onDescChange }: any) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 hover:border-emerald-100 transition-all hover:shadow-md group">
    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
      <Icon size={24} />
    </div>
    <div className="text-3xl font-bold text-emerald-950 mb-1">
      <EditableText isEditing={isEditing} value={value} onChange={onValueChange} label="Nilai" />
    </div>
    <div className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-3">
      <EditableText isEditing={isEditing} value={label} onChange={onLabelChange} label="Label" />
    </div>
    <div className="text-stone-500 text-sm leading-relaxed">
      <EditableText isEditing={isEditing} value={description} onChange={onDescChange} type="textarea" label="Deskripsi" />
    </div>
  </div>
);

const DEFAULT_CONTENT = {
  hero: {
    badge: "Program Pengembangan Sapi Krui",
    title1: "SKRUI",
    title2: "BESTI",
    description: "Sapi Krui Budidaya Efisien, Sehat, Terstandar dan Terintegrasi pada Bidang Perbibitan dan Produksi - Dinas Peternakan dan Kesehatan Hewan Provinsi Lampung.",
    cta1: "Pelajari Lebih Lanjut",
    cta2: "Tinjau E-Book",
    heroImage: "https://drive.google.com/file/d/1d1ROEdXWGx2WKf7m0m8yQkSCdNWjeRGz/view?usp=sharing",
    logoUrl: "https://drive.google.com/file/d/1Bxij4LZmY0DOYIKsJHmlczAj-VVGNlEB/view?usp=sharing"
  },
  visimisi: {
    title: "Visi & Misi",
    subtitle: "Tujuan Program",
    image: "https://drive.google.com/file/d/1I4pMpVYJJfmJBkIUBtsuC2lAxlHntPS5/view?usp=sharing"
  },
  background: {
    subtitle: "Konteks Program",
    title: "Latar Belakang",
    p1: "Sapi Krui (jawi peghia) merupakan plasma nutfah ternak lokal yang berkembang di Kabupaten Pesisir Barat, Provinsi Lampung, dan telah ditetapkan sebagai sumber daya genetik ternak lokal Indonesia. Sapi ini memiliki kemampuan adaptasi yang baik dan sesuai dengan sistem pemeliharaan tradisional peternak rakyat.",
    p2: "Namun, populasi Sapi Krui yang pada tahun 2026 tercatat 7.071 ekor masih berstatus rentan dan menghadapi tantangan berupa manajemen pemeliharaan yang sederhana serta keterbatasan informasi teknis budidaya. Melalui program SKRUI BESTI – SAPI KRUI Budidaya Efisien, Sehat, Terstandar dan Terintegrasi, diharapkan produktivitas ternak dan kesejahteraan peternak lokal dapat meningkat secara berkelanjutan..",
    statValue: "100%",
    statLabel: "Komitmen Pelestarian Lokal",
    image: "https://trubus.id/wp-content/uploads/2024/10/Mengenal-Sapi-Krui-Plasma-Nutfah-Lokal-yang-Berpotensi-Menjadi-Sapi-Pedaging-Unggul.jpg"
  },
  history: {
    subtitle: "Warisan Budaya",
    title: "Sejarah Singkat Sapi Krui",
    quote: "ini adalah hukum alam yang paling terabaikan. bahwa kemampuan intelektual yang beragam merupakan kompensasi atas perubahan, bahaya dan kesulitan.",
    p1: "Keturunan Banteng yang Bertahan dari Masa ke Masa, Jauh sebelum wilayah ini resmi berdiri sebagai sebuah kabupaten, tanah Pesisir Barat telah menjadi habitat bagi sejenis ternak yang unik dan sarat nilai sejarah, yakni Sapi Krui. Bagi masyarakat setempat, Sapi Krui bukan sekadar hewan ternak, melainkan bagian dari jejak alam dan budaya yang telah menyatu sejak lama. Secara turun-temurun diyakini bahwa sapi ini merupakan keturunan langsung banteng liar yang pernah hidup bebas di kawasan tersebut, kemudian berkembang biak secara alami dan beradaptasi dengan lingkungan Pesisir Barat.",
    p2: "Dalam bahasa lokal, Sapi Krui dikenal dengan sebutan Jawi Peghia, yang berarti “sapi kecil”. Penamaan ini bukan tanpa makna, melainkan mencerminkan ciri fisiknya yang relatif lebih kecil dibandingkan jenis sapi lainnya. Namun di balik tubuhnya yang sederhana, tersimpan ketangguhan, daya adaptasi, dan nilai genetik yang menjadi warisan berharga bagi masyarakat Pesisir Barat hingga saat ini.."
  },
  ebook: {
    subtitle: "E-Book SKRUI BESTI",
    title: "Panduan Budidaya",
    description: "Dapatkan panduan teknis lengkap yang mencakup Pembibitan Sapi Krui.",
    items: [
      'Bagaimana Memilih Bibit',
      'Kualitatif dan Kuantitatif',
      'Produksi Bibit Sapi Krui',
      'Recording Sapi Krui'
    ],
    button: "Download E-Book (PDF)",
    button2: "Tinjau E-Book",
    downloadUrl: "https://drive.google.com/file/d/1iiwyXPDknpInpezhEbeaudr3_Hn0tx3z/view?usp=sharing",
    previewUrl: "https://heyzine.com/flip-book/243979f7ed.html",
    coverTitle: "PANDUAN BUDIDAYA SAPI KRUI",
    coverEdition: "Edisi Terintegrasi 2026",
    coverImage: "https://drive.google.com/file/d/19q3Mb0qLmz8McZP0ce5nPDBRNXAQ6IAF/view?usp=sharing",
  },
  data: {
    subtitle: "Sapi Lokal Adaptif dan Produktif",
    title: "Profil Sapi Krui",
    image: "https://drive.google.com/file/d/1vG0-gyXvXWU8KZ63YvilhO7InRY9gCmj/view?usp=sharing",
    image2: "https://drive.google.com/file/d/1s8Kel-FgNu7jupiA1IL1M4jp-TbeAk-Q/view?usp=sharing"
  },
  footer: {
    description: "Inisiatif pengembangan budidaya sapi lokal yang berkelanjutan, sehat, dan terintegrasi untuk masa depan peternakan Provinsi Lampung yang lebih baik.",
    navTitle: "Navigasi",
    contactTitle: "Kontak",
    address: "Jl. Cut Mutia No.23 B, Gulak Galik, Kec. Tlk. Betung Utara, Kota Bandar Lampung, Lampung 35124",
    dept: "Dinas Peternakan dan Kesehatan Hewan Provinsi Lampung",
    copyright: "© 2026 SKRUI BESTI. All Rights Reserved.",
    tagline: "Budidaya Sapi Krui Berkelanjutan",
    whatsappUrl: "https://chat.whatsapp.com/HiLUHkale0C81sq0zsYIgW?mode=gi_t",
    whatsappLabel: "Gabung Grup Diskusi"
  }
};

export default function App() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem('skrui_besti_content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge saved content with DEFAULT_CONTENT to handle new sections
        return {
          ...DEFAULT_CONTENT,
          ...parsed,
          // Deep merge for nested objects if necessary, but simple top-level merge 
          // handles the current issue where 'visimisi' is missing.
          visimisi: { ...DEFAULT_CONTENT.visimisi, ...parsed.visimisi },
          hero: { 
            ...DEFAULT_CONTENT.hero, 
            ...parsed.hero,
            logoUrl: parsed.hero?.logoUrl || DEFAULT_CONTENT.hero.logoUrl
          },
          background: { ...DEFAULT_CONTENT.background, ...parsed.background },
          history: { ...DEFAULT_CONTENT.history, ...parsed.history },
          ebook: { 
            ...DEFAULT_CONTENT.ebook, 
            ...parsed.ebook,
            button2: parsed.ebook?.button2 || DEFAULT_CONTENT.ebook.button2,
            previewUrl: parsed.ebook?.previewUrl || DEFAULT_CONTENT.ebook.previewUrl
          },
          data: { 
            ...DEFAULT_CONTENT.data, 
            ...parsed.data,
            // Force reset if it's the old structure (has stats but no image)
            image: parsed.data?.image || DEFAULT_CONTENT.data.image,
            image2: parsed.data?.image2 || DEFAULT_CONTENT.data.image2
          },
          footer: { 
            ...DEFAULT_CONTENT.footer, 
            ...parsed.footer,
            // Reset if it's the old placeholder
            whatsappUrl: parsed.footer?.whatsappUrl === "https://chat.whatsapp.com/example" 
              ? DEFAULT_CONTENT.footer.whatsappUrl 
              : (parsed.footer?.whatsappUrl || DEFAULT_CONTENT.footer.whatsappUrl)
          },
        };
      } catch (e) {
        console.error("Failed to parse saved content", e);
      }
    }
    return DEFAULT_CONTENT;
  });

  useEffect(() => {
    localStorage.setItem('skrui_besti_content', JSON.stringify(content));
  }, [content]);

  const updateContent = (path, value) => {
    const keys = path.split('.');
    const newContent = { ...content };
    let current = newContent;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setContent(newContent);
  };

  const navLinks = [
    { name: 'Visi Misi', href: '#visimisi', icon: Activity },
    { name: 'Latar Belakang', href: '#latarbelakang', icon: Info },
    { name: 'Sejarah', href: '#sejarah', icon: History },
    { name: 'E-Book', href: '#ebook', icon: BookOpen },
    { name: 'Profil Sapi Krui', href: '#data', icon: Database },
    { name: 'Gabung WA', href: content.footer.whatsappUrl, icon: MessageCircle, isExternal: true },
  ];

  return (
    <div className={`min-h-screen bg-[#FDFCF9] text-stone-800 font-sans selection:bg-emerald-100 selection:text-emerald-900 ${isEditMode ? 'pt-12' : ''}`}>
      {isEditMode && (
        <div className="fixed top-0 left-0 right-0 h-12 bg-amber-500 text-white flex items-center justify-center text-xs font-bold uppercase tracking-[0.2em] z-[60] shadow-md">
          <Settings size={14} className="mr-2 animate-spin-slow" /> Mode Edit Aktif - Klik teks untuk mengubah
        </div>
      )}
      
      <Navbar isEditMode={isEditMode} setIsEditMode={setIsEditMode} content={content} navLinks={navLinks} />

      {/* Hero Section */}
      <header className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={getDirectImageUrl(content.hero.heroImage)} 
            alt="Cattle in pasture" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/60 via-emerald-950/40 to-[#FDFCF9]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          {isEditMode && (
            <div className="mb-8 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 max-w-md space-y-4">
              <EditableText isEditing={isEditMode} value={content.hero.heroImage} onChange={(v) => updateContent('hero.heroImage', v)} label="URL Gambar Hero (Background)" />
              <EditableText isEditing={isEditMode} value={content.hero.logoUrl} onChange={(v) => updateContent('hero.logoUrl', v)} label="URL Logo Instansi (Provinsi Lampung)" />
            </div>
          )}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-block px-4 py-1.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 rounded-full text-emerald-50 text-sm font-medium mb-6">
              <EditableText isEditing={isEditMode} value={content.hero.badge} onChange={(v) => updateContent('hero.badge', v)} label="Badge" />
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-bold text-white leading-[0.9] mb-8">
              <EditableText isEditing={isEditMode} value={content.hero.title1} onChange={(v) => updateContent('hero.title1', v)} label="Judul 1" /> <br />
              <span className="text-emerald-300">
                <EditableText isEditing={isEditMode} value={content.hero.title2} onChange={(v) => updateContent('hero.title2', v)} label="Judul 2" />
              </span>
            </h1>
            <div className="text-xl md:text-2xl text-emerald-50/90 font-light leading-relaxed mb-10 max-w-2xl">
              <EditableText isEditing={isEditMode} value={content.hero.description} onChange={(v) => updateContent('hero.description', v)} type="textarea" label="Deskripsi Hero" />
            </div>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#latarbelakang" 
                className="bg-white text-emerald-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all shadow-xl flex items-center gap-2"
              >
                <EditableText isEditing={isEditMode} value={content.hero.cta1} onChange={(v) => updateContent('hero.cta1', v)} label="Tombol 1" /> <ChevronRight size={20} />
              </a>
              <a 
                href="#ebook" 
                className="bg-emerald-600/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <EditableText isEditing={isEditMode} value={content.hero.cta2} onChange={(v) => updateContent('hero.cta2', v)} label="Tombol 2" /> <BookOpen size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Visi Misi Section */}
      {content.visimisi && (
        <Section 
          id="visimisi" 
          title={content.visimisi.title}
          subtitle={content.visimisi.subtitle}
          onTitleChange={(v) => updateContent('visimisi.title', v)}
          onSubtitleChange={(v) => updateContent('visimisi.subtitle', v)}
          isEditing={isEditMode}
          className="bg-[#FDFCF9]"
        >
        <div className="max-w-3xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-100 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="relative rounded-[32px] overflow-hidden shadow-xl border-4 border-white">
                <img 
                  src={getDirectImageUrl(content.visimisi.image)} 
                  alt="Visi Misi" 
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {isEditMode && (
                <div className="mt-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <EditableText isEditing={isEditMode} value={content.visimisi.image} onChange={(v) => updateContent('visimisi.image', v)} label="URL Gambar Visi Misi" />
                </div>
              )}
            </div>
          </div>
        </Section>
      )}

      {/* Latar Belakang */}
      <Section 
        id="latarbelakang" 
        title={content.background.title}
        subtitle={content.background.subtitle}
        onTitleChange={(v) => updateContent('background.title', v)}
        onSubtitleChange={(v) => updateContent('background.subtitle', v)}
        isEditing={isEditMode}
        className="bg-white"
      >
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 text-lg text-stone-600 leading-relaxed">
            <EditableText isEditing={isEditMode} value={content.background.p1} onChange={(v) => updateContent('background.p1', v)} type="textarea" label="Paragraf 1" />
            <EditableText isEditing={isEditMode} value={content.background.p2} onChange={(v) => updateContent('background.p2', v)} type="textarea" label="Paragraf 2" />
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={getDirectImageUrl(content.background.image)} 
                alt="Farm landscape" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {isEditMode && (
              <div className="mt-4 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                <EditableText isEditing={isEditMode} value={content.background.image} onChange={(v) => updateContent('background.image', v)} label="URL Gambar Latar Belakang" />
              </div>
            )}
            <div className="absolute -bottom-8 -left-8 bg-emerald-600 text-white p-8 rounded-3xl shadow-xl max-w-[240px]">
              <div className="text-4xl font-bold mb-2">
                <EditableText isEditing={isEditMode} value={content.background.statValue} onChange={(v) => updateContent('background.statValue', v)} label="Nilai Stat" />
              </div>
              <div className="text-sm font-medium opacity-90 uppercase tracking-wider">
                <EditableText isEditing={isEditMode} value={content.background.statLabel} onChange={(v) => updateContent('background.statLabel', v)} label="Label Stat" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Sejarah */}
      <Section 
        id="sejarah" 
        title={content.history.title}
        subtitle={content.history.subtitle}
        onTitleChange={(v) => updateContent('history.title', v)}
        onSubtitleChange={(v) => updateContent('history.subtitle', v)}
        isEditing={isEditMode}
        className="bg-stone-50"
      >
        <div className="bg-white p-12 rounded-[40px] shadow-sm border border-stone-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <History size={200} />
          </div>
          <div className="relative z-10 max-w-3xl">
            <div className="text-xl text-stone-700 leading-relaxed italic font-display mb-8">
              "<EditableText isEditing={isEditMode} value={content.history.quote} onChange={(v) => updateContent('history.quote', v)} type="textarea" label="Kutipan" />"
            </div>
            <div className="space-y-6 text-stone-600">
              <EditableText isEditing={isEditMode} value={content.history.p1} onChange={(v) => updateContent('history.p1', v)} type="textarea" label="Paragraf 1" />
              <EditableText isEditing={isEditMode} value={content.history.p2} onChange={(v) => updateContent('history.p2', v)} type="textarea" label="Paragraf 2" />
            </div>
          </div>
        </div>
      </Section>

      {/* E-Book Download */}
      <Section 
        id="ebook" 
        title={content.ebook.title}
        subtitle={content.ebook.subtitle}
        onTitleChange={(v) => updateContent('ebook.title', v)}
        onSubtitleChange={(v) => updateContent('ebook.subtitle', v)}
        isEditing={isEditMode}
        className="bg-emerald-900 text-white"
      >
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-emerald-400 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white p-4 rounded-2xl shadow-2xl transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                {content.ebook.coverImage ? (
                  <img src={getDirectImageUrl(content.ebook.coverImage)} className="aspect-[3/4] w-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                ) : (
                  <div className="aspect-[3/4] bg-emerald-800 rounded-xl flex flex-col items-center justify-center p-8 text-center border-4 border-emerald-700">
                    <BookOpen size={64} className="mb-6 text-emerald-300" />
                    <h3 className="text-2xl font-display font-bold mb-4">
                      <EditableText isEditing={isEditMode} value={content.ebook.coverTitle} onChange={(v) => updateContent('ebook.coverTitle', v)} label="Judul Cover" />
                    </h3>
                    <div className="w-12 h-1 bg-emerald-400 mb-6" />
                    <p className="text-xs uppercase tracking-widest text-emerald-200 font-bold">
                      <EditableText isEditing={isEditMode} value={content.ebook.coverEdition} onChange={(v) => updateContent('ebook.coverEdition', v)} label="Edisi Cover" />
                    </p>
                  </div>
                )}
              </div>
              {isEditMode && (
                <div className="mt-4">
                  <EditableText isEditing={isEditMode} value={content.ebook.coverImage} onChange={(v) => updateContent('ebook.coverImage', v)} label="URL Gambar Cover (Opsional)" />
                </div>
              )}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h3 className="text-3xl font-display font-bold mb-6">
              <EditableText isEditing={isEditMode} value={content.ebook.title} onChange={(v) => updateContent('ebook.title', v)} label="Judul Ebook" />
            </h3>
            <div className="text-emerald-100/80 text-lg mb-8 leading-relaxed">
              <EditableText isEditing={isEditMode} value={content.ebook.description} onChange={(v) => updateContent('ebook.description', v)} type="textarea" label="Deskripsi Ebook" />
            </div>
            <ul className="space-y-4 mb-10">
              {content.ebook.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-emerald-100">
                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-emerald-950">
                    <ChevronRight size={14} />
                  </div>
                  <EditableText isEditing={isEditMode} value={item} onChange={(v) => {
                    const newItems = [...content.ebook.items];
                    newItems[idx] = v;
                    updateContent('ebook.items', newItems);
                  }} label={`Item ${idx + 1}`} />
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={content.ebook.downloadUrl} 
                download 
                className="w-full md:w-auto bg-white text-emerald-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all shadow-xl flex items-center justify-center gap-3"
              >
                <Download size={20} /> <EditableText isEditing={isEditMode} value={content.ebook.button} onChange={(v) => updateContent('ebook.button', v)} label="Teks Tombol 1" />
              </a>
              <a 
                href={content.ebook.previewUrl} 
                className="w-full md:w-auto bg-emerald-800/50 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3"
              >
                <BookOpen size={20} /> <EditableText isEditing={isEditMode} value={content.ebook.button2} onChange={(v) => updateContent('ebook.button2', v)} label="Teks Tombol 2" />
              </a>
            </div>
            {isEditMode && (
              <div className="mt-4 space-y-2">
                <EditableText isEditing={isEditMode} value={content.ebook.downloadUrl} onChange={(v) => updateContent('ebook.downloadUrl', v)} label="URL Download File" />
                <EditableText isEditing={isEditMode} value={content.ebook.previewUrl} onChange={(v) => updateContent('ebook.previewUrl', v)} label="URL Tinjau E-Book" />
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Profil Sapi Krui Section */}
      <Section 
        id="data" 
        title={content.data.title}
        subtitle={content.data.subtitle}
        onTitleChange={(v) => updateContent('data.title', v)}
        onSubtitleChange={(v) => updateContent('data.subtitle', v)}
        isEditing={isEditMode}
        className="bg-white"
      >
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-100 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="relative rounded-[32px] overflow-hidden shadow-xl border-4 border-white">
                <img 
                  src={getDirectImageUrl(content.data.image)} 
                  alt="Profil Sapi Krui 1" 
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {isEditMode && (
                <div className="mt-4 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                  <EditableText isEditing={isEditMode} value={content.data.image} onChange={(v) => updateContent('data.image', v)} label="URL Gambar 1" />
                </div>
              )}
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-100 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="relative rounded-[32px] overflow-hidden shadow-xl border-4 border-white">
                <img 
                  src={getDirectImageUrl(content.data.image2)} 
                  alt="Profil Sapi Krui 2" 
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {isEditMode && (
                <div className="mt-4 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                  <EditableText isEditing={isEditMode} value={content.data.image2} onChange={(v) => updateContent('data.image2', v)} label="URL Gambar 2" />
                </div>
              )}
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-100 py-20 px-6 border-t border-emerald-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <span className="font-display text-2xl font-bold text-white">SKRUI BESTI</span>
              </div>
              <div className="text-emerald-200/60 max-w-sm leading-relaxed">
                <EditableText isEditing={isEditMode} value={content.footer.description} onChange={(v) => updateContent('footer.description', v)} type="textarea" label="Deskripsi Footer" />
              </div>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">
                <EditableText isEditing={isEditMode} value={content.footer.navTitle} onChange={(v) => updateContent('footer.navTitle', v)} label="Judul Nav" />
              </h5>
              <ul className="space-y-4 text-sm">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      target={link.isExternal ? "_blank" : undefined}
                      rel={link.isExternal ? "noopener noreferrer" : undefined}
                      className="hover:text-emerald-400 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">
                <EditableText isEditing={isEditMode} value={content.footer.contactTitle} onChange={(v) => updateContent('footer.contactTitle', v)} label="Judul Kontak" />
              </h5>
              <ul className="space-y-4 text-sm text-emerald-200/60">
                <li className="flex items-center gap-2"><MapPin size={14} /> <EditableText isEditing={isEditMode} value={content.footer.address} onChange={(v) => updateContent('footer.address', v)} label="Alamat" /></li>
                <li className="flex items-center gap-2"><Activity size={14} /> <EditableText isEditing={isEditMode} value={content.footer.dept} onChange={(v) => updateContent('footer.dept', v)} label="Instansi" /></li>
                <li className="flex items-center gap-2 pt-2">
                  <a 
                    href={content.footer.whatsappUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-bold"
                  >
                    <MessageCircle size={16} /> 
                    <EditableText isEditing={isEditMode} value={content.footer.whatsappLabel} onChange={(v) => updateContent('footer.whatsappLabel', v)} label="Label WA" />
                  </a>
                </li>
                {isEditMode && (
                  <li className="pt-1">
                    <EditableText isEditing={isEditMode} value={content.footer.whatsappUrl} onChange={(v) => updateContent('footer.whatsappUrl', v)} label="Link Grup WA" />
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-emerald-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-emerald-200/40 font-medium tracking-widest uppercase text-center md:text-left">
            <p><EditableText isEditing={isEditMode} value={content.footer.copyright} onChange={(v) => updateContent('footer.copyright', v)} label="Copyright" /></p>
            <p><EditableText isEditing={isEditMode} value={content.footer.tagline} onChange={(v) => updateContent('footer.tagline', v)} label="Tagline" /></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
