import { FaSchool } from 'react-icons/fa';

const Logo = ({ size = 'text-2xl' }) => {
  return (
    <div className={`flex items-center gap-2 font-bold ${size}`}>
      <FaSchool className="text-primary" />
      <span>
        School<span className="text-primary">Fees</span>
      </span>
    </div>
  );
};

export default Logo;