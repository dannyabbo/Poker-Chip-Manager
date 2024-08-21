import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const goToCreateTable = () => {
    navigate('/create-table');
  };

  const goToJoinTable = () => {
    navigate('/join-table');
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-8">Poker Chip Manager</h1>
          <div className="space-y-4">
            <button className="btn btn-primary btn-lg w-full" onClick={goToCreateTable}>
              Create Table
            </button>
            <button className="btn btn-secondary btn-lg w-full" onClick={goToJoinTable}>
              Join Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;