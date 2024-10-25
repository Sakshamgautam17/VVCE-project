import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Shield, Eye, CheckCircle } from "lucide-react";
import bg from '../bg.gif'
// Simple Button component since we can't access shadcn/ui
const Button = ({ children, variant = "default", className = "", onClick, ...props }) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-all duration-200";
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    ghost: "bg-transparent hover:bg-white/10 text-white",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const featuresRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white">
  {/* Video Background */}
  <div className="fixed inset-0 z-0">
    <div className="absolute inset-0 bg-black/60 z-10" />
    <img src={bg} className="w-full h-full object-cover" alt="background" />
  </div>



      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-black/80 backdrop-blur-lg" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            ProcX
          </span>
          <div className="flex gap-8">
            <Button variant="ghost" className="text-white hover:text-blue-400" onClick={scrollToFeatures}>
              Features
            </Button>
            <Button variant="ghost" className="text-white hover:text-blue-400">
              About
            </Button>
            <Button variant="ghost" className="text-white hover:text-blue-400">
              FAQ
            </Button>
            <Button onClick={handleLoginClick}>
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
          <h1 className="text-7xl font-bold mb-8 pb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent animate-fadeIn">
            The Future of
            <br />
            Online Proctoring
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Advanced AI-powered exam monitoring system that ensures academic integrity while providing a seamless experience.
          </p>
          <p className="text-lg text-blue-400 mt-8">
            Developed by reactJK
          </p>
        </div>
      </div>

      {/* Features Grid */}
<div ref={featuresRef} className="relative z-10 bg-black/80 backdrop-blur-lg py-32">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12"> {/* Adjusted grid layout */}
      {[
        {
          icon: <Camera className="w-12 h-12 text-blue-400" />,
          title: "Real-time Monitoring",
          description: "Advanced facial recognition and environment scanning"
        },
        {
          icon: <Shield className="w-12 h-12 text-blue-400" />,
          title: "Fraud Prevention",
          description: "AI-powered behavior analysis and pattern detection"
        },
        {
          icon: <Eye className="w-12 h-12 text-blue-400" />, // New icon suggestion
          title: "No Manual Invigilation",
          description: "Fully automated monitoring through advanced AI technology"
        },
        {
          icon: <CheckCircle className="w-12 h-12 text-blue-400" />, // New icon suggestion
          title: "Easy and Convenient to Use",
          description: "User-friendly design with minimal setup required"
        }
      ].map((feature, index) => (
        <div
          key={index}
          className="group p-8 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 
            hover:from-blue-900/20 hover:to-cyan-900/20 transition-all duration-300 backdrop-blur-sm"
        >
          <div className="mb-6 transform group-hover:scale-110 transition-transform">
            {feature.icon}
          </div>
          <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
          <p className="text-gray-400">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
</div>



    </div>
  );
};

export default LandingPage;