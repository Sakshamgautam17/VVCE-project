import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Shield, Eye, CheckCircle, Check } from "lucide-react";
import bg from '../bg.gif';

// Add global styles for the scrollbar
const globalStyles = `
  /* For Webkit browsers (Chrome, Safari) */
  ::-webkit-scrollbar {
    width: 8px;
    background: transparent;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    transition: background 0.2s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  /* For Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  }
`;

const Button = ({ children, variant = "default", className = "", onClick, ...props }) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-all duration-200";
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    ghost: "bg-transparent hover:bg-white/10 text-white",
    pricing: "bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-lg",
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

const Landing= () => {
  const [scrolled, setScrolled] = useState(false);
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const faqRef = useRef(null);
  const pricingRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Add global styles to head
    const styleSheet = document.createElement("style");
    styleSheet.innerText = globalStyles;
    document.head.appendChild(styleSheet);

    // Cleanup
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (ref) => {
    const navbarHeight = 80;
    const element = ref.current;
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: "smooth"
      });
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };


  const pricingPlans = [
    {
      name: "Basic",
      price: "299",
      features: [
        "Up to 50 exams per month",
        "Basic AI monitoring",
        "24/7 Support",
        "Basic reporting",
      ]
    },
    {
      name: "Professional",
      price: "499",
      features: [
        "Up to 200 exams per month",
        "Advanced AI monitoring",
        "24/7 Priority Support",
        "Advanced analytics",
        "Custom branding"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Unlimited exams",
        "Premium AI monitoring",
        "Dedicated support team",
        "Custom integration",
        "Advanced security features",
        "API access"
      ]
    }
  ];

  const faqItems = [
    {
      question: "How does ProcX ensure exam integrity?",
      answer: "ProcX uses advanced AI-powered monitoring systems that detect suspicious behavior, track eye movements, and scan the environment for unauthorized materials. Our system maintains continuous surveillance throughout the examination process."
    },
    {
      question: "What technical requirements are needed to use ProcX?",
      answer: "Users need a computer with a working webcam, microphone, and stable internet connection. Our system works with most modern browsers and requires minimal setup. Detailed system requirements will be provided during registration."
    },
    {
      question: "Is ProcX compliant with privacy regulations?",
      answer: "Yes, ProcX is fully compliant with GDPR, FERPA, and other major privacy regulations. We implement strict data protection measures and only collect necessary information for proctoring purposes."
    },
    {
      question: "What happens if there's an internet disconnection during an exam?",
      answer: "Our system automatically saves progress regularly. In case of disconnection, students can resume their exam from where they left off once connection is restored, subject to institutional policies."
    },
    {
      question: "Can ProcX accommodate students with special needs?",
      answer: "Yes, ProcX is designed to be accessible and can be configured to accommodate various special needs and requirements. Contact our support team for specific accommodations."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
        {/* Video Background */}
        <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img src={bg} className="w-full h-full object-cover opacity-55" alt="background" />
      </div>

      {/* [Previous navbar remains the same but add FAQ button with scroll] */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-black/80 backdrop-blur-lg" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            ProcX
          </span>
          <div className="flex gap-8">
            <Button 
              variant="ghost" 
              className="text-white hover:text-blue-400" 
              onClick={() => scrollToSection(featuresRef)}
            >
              Features
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:text-blue-400" 
              onClick={() => scrollToSection(aboutRef)}
            >
              About
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:text-blue-400"
              onClick={() => scrollToSection(faqRef)}
            >
              FAQ
            </Button>
            <Button onClick={handleLoginClick}>
              Login
            </Button>
            <Button onClick={handleLoginClick}>
              Sign up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Updated with pricing button */}
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
          <Button 
            variant="pricing"
            className="mb-8"
            onClick={() => scrollToSection(pricingRef)}
          >
            Check out our prices starting from ₹299
          </Button>
          <p className="text-lg text-blue-400 mt-8">
            Developed by reactJK
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div ref={featuresRef} className="relative z-10 bg-black/80 backdrop-blur-lg py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
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
                icon: <Eye className="w-12 h-12 text-blue-400" />,
                title: "No Manual Invigilation",
                description: "Fully automated monitoring through advanced AI technology"
              },
              {
                icon: <CheckCircle className="w-12 h-12 text-blue-400" />,
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

      {/* Pricing Section */}
      <div ref={pricingRef} className="relative z-10 bg-black/90 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center text-blue-400 mb-16">Pricing Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 hover:transform hover:scale-105 transition-all duration-300">
                <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                <div className="text-4xl font-bold text-blue-400 mb-6">
                ₹{plan.price}
                  {plan.price !== "Custom" && <span className="text-lg text-gray-400">/month</span>}
                </div>
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <Check className="w-5 h-5 text-blue-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-8">Get Started</Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div ref={aboutRef} className="relative z-10 bg-gray-900 min-h-screen flex items-center py-32">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-blue-400 mb-8">About ProcX</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            ProcX is a revolutionary AI-driven proctoring solution designed to uphold the integrity of online examinations
            in educational institutions and corporate training environments. Our platform integrates state-of-the-art
            facial recognition, environment monitoring, and behavioral analysis to provide seamless, secure, and automated
            exam invigilation. With a focus on delivering a streamlined user experience, ProcX aims to make remote exams
            both fair and accessible.
          </p>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            ProcX is built on cutting-edge technology, ensuring minimal interruptions
            and maximum security. Whether you're a student or an administrator, ProcX is here to simplify and safeguard
            the examination process, making academic honesty a priority.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div ref={faqRef} className="relative z-10 bg-gray-900/80 py-32">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center text-blue-400 mb-16">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-800/70 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-4">{item.question}</h3>
                <p className="text-gray-300 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;