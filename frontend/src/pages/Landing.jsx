import { Link } from 'react-router-dom';
import { FaMoneyCheckAlt, FaShieldAlt, FaChartLine, FaUserGraduate, FaGraduationCap } from 'react-icons/fa';
import Logo from '../components/Logo.jsx';
import  hero from "../assets/hero2.svg"

const features = [
  {
    icon: <FaMoneyCheckAlt className="text-3xl text-primary" />,
    title: 'Easy Payments',
    description: 'Students and parents pay school fees securely online via Paystack in a few clicks.',
  },
  {
    icon: <FaShieldAlt className="text-3xl text-primary" />,
    title: 'Secure & Reliable',
    description: 'Every payment is verified automatically, so records are always accurate and up to date.',
  },
  {
    icon: <FaChartLine className="text-3xl text-primary" />,
    title: 'Admin Insights',
    description: 'School administrators get a clear overview of collections, outstanding fees, and class breakdowns.',
  },
  {
    icon: <FaUserGraduate className="text-3xl text-primary" />,
    title: 'Student Access',
    description: 'Students can view their fee history and outstanding balances anytime, anywhere.',
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow px-6">
        <div className="flex-1">
          <Logo size="text-xl" />
        </div>
        <div className="flex gap-2">
          <Link to="/login" className="btn btn-primary btn-sm">
            Login
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="hero min-h-[70vh]">
         <div className="hero-content flex-col lg:flex-row-reverse gap-10">
           <img
             src={hero}
             alt="School fees payment illustration"
             className="max-w-sm w-full"
           />
           {/* <FaGraduationCap className="text-primary text-[200px] opacity-80" /> */}
           <div className="max-w-xl text-center lg:text-left">
             <h1 className="text-4xl md:text-5xl font-bold mb-4">
               School Fee Payments, <span className="text-primary">Simplified</span>
             </h1>
             <p className="text-base-content/70 mb-6">
               A simple, secure platform for schools to manage student fees and for
               students and parents to pay with ease — no queues, no paperwork.
             </p>
             <Link to="/login" className="btn btn-primary btn-wide">
               Get Started
             </Link>
           </div>
         </div>
    </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-center mb-10">Why use this platform?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="card bg-base-100 shadow p-6 text-center">
              <div className="flex justify-center mb-3">{feature.icon}</div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-base-content/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-6 bg-base-100 text-base-content/70 text-sm">
        <p>© {new Date().getFullYear()} School Fees Payment System. Built by Lawal.</p>
      </footer>
    </div>
  );
};

export default Landing;